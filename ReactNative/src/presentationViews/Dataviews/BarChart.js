import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Svg, {Circle, G, Line, Path, Rect, Text} from 'react-native-svg'
import {
    StyleSheet,
    View
} from 'react-native'
import * as shape from "d3-shape";
import * as scale from "d3-scale";
import * as axis from 'd3-axis'
import {PRIMARY_COLOR_800, WIDTH} from "../../constants";
import {LoadView} from "../Other/PresentationUtil";
import * as Util from "../../utils/Util";
import {DataStatus} from "../../redux/ReduxUtil";
import {dateStringToLabel} from "../../utils/Util";

const d3 = {
    shape,
    scale,
    axis
};


export default class BarChart extends Component {


    constructor(props) {
        super(props);


        this.buildData = this.buildData.bind(this);
        this.animate = this.animate.bind(this);
        this.rect = this.rect.bind(this);

    }


    shouldComponentUpdate(nextProps, nextState) {

        if (this.state !== nextState) {
            return true;
        }
        if (nextProps.metadata.status === DataStatus.success) {
            if (nextProps.data === this.props.data) {
                return false;
            } else {
                this.buildData(nextProps);
                return true;
            }
        }
        return true;
    }


    componentWillMount() {
        if (this.props) {
            this.buildData(this.props);
        }
    }


    buildData(props) {

        if (!props) {
            return;
        }
        if (props.data === null) {
            return;
        }
        let final = [], copy = [], labels = [];
        let data = props.data;
        let theMax = 0;
        for (let index = 0; index < data.length; index++) {

            if (this.props.aggregation) {
                labels.push(dateStringToLabel(data[index].label, this.props.aggregation));
            } else {
                labels.push(data[index].label);
            }
            copy.push(data[index].value);
            final.push(data[index].value);
            copy[index] = 0;
            if (data[index].value > theMax) {
                theMax = data[index].value;
            }
        }
        this.setState({
            stateBuilt: true,
            data: copy,
            finalData: final,
            max: theMax,
            labels: labels

        }, this.animate);

    }


    animate(start) {
        let self = this;
        self.animating = requestAnimationFrame((timestamp) => {
            if (!start) {
                start = timestamp;
            }
            let delta = timestamp - start / self.props.animationDuration;

            // If we're above 1 then our animation should be complete.
            if (delta > 1) {
                self.animating = null;
                // Just to be safe set our final value to the new graph path.

                self.setState({
                    data: self.state.finalData
                });

                // Stop our animation loop.
                return;
            }

            let data = self.state.data.slice();
            for (let i = 0; i < data.length; i++) {
                data[i] = delta * self.state.finalData[i];
            }
            self.setState({data: data}, () => {
                self.animate(start);
            });
        });
    }

    // 0,0 is upper left corner
    rect(x, y, width, height, isRenderingChanges, percent) {
        if (!isRenderingChanges) {
            return `M${x} ${y},l ${width} 0, l 0 ${height}, l ${-width} 0 Z`
        }
    }


    render() {

        if (!this.props.data || this.props.data.length == 0) {
            return LoadView({width: this.props.width, height: this.props.height});
        }

        let verticalAlignment = this.props.barAlignment === 'vertical';
        let data = this.state.data;
        let theMax = this.state.max;
        let margin = {top: verticalAlignment ? 20 : 50, right: 40, bottom: 60, left: 50},
            width = this.props.width - margin.left - margin.right,
            height = this.props.height - margin.top - margin.bottom;

        let labels = this.state.labels.slice();
        let scaleWidth = width;
        let scaleHeight = height;
        if (!verticalAlignment) {
            let tmp = scaleHeight;
            scaleHeight = scaleWidth;
            scaleWidth = tmp;

        }
        let x = d3.scale.scaleBand()
            .domain(labels)
            .range([0, scaleWidth])
            .paddingInner(0.2); // padding between bars

        let y = d3.scale.scaleLinear()
            .domain([0, this.state.max])
            .range([scaleHeight, 0])
            .nice(); // rounds to the nearest nice numbers whatever that means
        const bandwidth = x.bandwidth();
        let leftPadding = 3.5;
        let bottomPadding = 1.5;
        let pixelsPerSeperator = 40;
        let numberVerticalSeperators = height / pixelsPerSeperator;
        let numberHorizontalSeperators = labels.length;
        let leftValues = [];
        let fontSize = 10;
        if (verticalAlignment) {
            for (let i = 0; i < numberVerticalSeperators; i++) {
                leftValues.push((numberVerticalSeperators - i) * (theMax / numberVerticalSeperators));
            }
        } else {
            for (let i = 0; i < numberHorizontalSeperators; i++) {
                leftValues.push((numberHorizontalSeperators - i) * (theMax / numberHorizontalSeperators));

            }
        }
        let unit = "";
        let divisor = 1;
        if (theMax > 1000) {
            unit = "K";
            divisor *= 1000;
        }
        if (theMax > 1000000) {
            divisor *= 1000;
            unit = "M"
        }
        // TODO Make the horizontal labels depend on the location of the bar
        // this will be the bandwidth

        return (

            <Svg
                height={height + margin.top + margin.bottom}
                width={WIDTH + margin.left + margin.right}
            >

                <G/>
                <G id="verticalAxis">
                    <Line stroke='#000'
                          strokeWidth='2'
                          x1={margin.left - leftPadding}
                          x2={margin.left - leftPadding}
                          y1={margin.top}
                          y2={height + margin.top + bottomPadding * 1}/>
                    {leftValues.map((val, i) => (
                        <G>
                            <Line
                                stroke={verticalAlignment ? '#000' : '#000000FF'}
                                strokeWidth={'1'}
                                x1={margin.left - leftPadding - 10}
                                x2={margin.left - leftPadding}
                                y1={(verticalAlignment ? y(val) : x(labels[i])) + margin.top}
                                y2={(verticalAlignment ? y(val) : x(labels[i])) + margin.top}/>
                            <Text
                                x={20}
                                y={verticalAlignment ? y(val) + margin.top - 17 : x(labels[i]) + (1 / 2 * bandwidth - .75 * fontSize) + margin.top}
                                fontSize={fontSize}
                                textAnchor="middle"
                                fontWeight="bold"

                            >
                                {verticalAlignment ? Util.formatNumber(val, 10) : labels[i]}
                            </Text>
                        </G>
                    ))}

                </G>
                <G id="horizontalAxis">
                    <Line stroke='#000'
                          strokeWidth='2'
                          x1={margin.left - leftPadding}
                          x2={margin.left + width}
                          y1={height + margin.top + 1}
                          y2={height + margin.top + 1}/>

                    {data.map((val, i) => (
                        <G>
                            <Line stroke='#000'
                                  strokeWidth='1'
                                  x1={x(labels[i]) + margin.left + bandwidth / 2}
                                  x2={x(labels[i]) + margin.left + bandwidth / 2}
                                  y1={height + margin.top}
                                  y2={height + margin.top + 10 + (i % 2 === 0 ? 10 : 0)}/>


                            <Text
                                x={x(labels[i]) + margin.left + bandwidth / 2}
                                y={height + margin.top + 10 + (i % 2 === 0 ? 15 : 0)}
                                fontSize={fontSize}
                                textAnchor="middle"
                                fontWeight="bold"

                            >
                                {verticalAlignment ? labels[i] : Util.formatNumber(leftValues[leftValues.length - 1 - i], 10)}
                            </Text>

                        </G>
                    ))}

                </G>


                <G x={margin.left} y={margin.top}>
                    {data.map((val, i) => {
                        if (this.props.barAlignment === 'vertical') {
                            return (
                                <Path d={this.rect(x(labels[i]), y(val), bandwidth, height - y(val))}
                                      fill={PRIMARY_COLOR_800}/>
                            )
                        } else {
                            return ( <Path d={this.rect(0, x(labels[i]), width - y(val), bandwidth - 2)}
                                           fill={PRIMARY_COLOR_800}/>)
                        }
                    })}
                </G>


            </Svg>
        );
    }

}
BarChart.propTypes = {

    animationDuration: PropTypes.number,
    index: PropTypes.func,
    barAlignment: PropTypes.string
};
BarChart.defaultProps = {
    animationDuration: 1000,
    width: WIDTH,
    height: 400,
    data: [],
    barAlignment: 'vertical' // can be horizontal
};

