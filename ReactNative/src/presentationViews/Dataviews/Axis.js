import React, {Component} from 'react'
import {Dimensions} from 'react-native'
import PropTypes from 'prop-types'
import * as shape from "d3-shape";
import * as scale from "d3-scale";
import * as axis from 'd3-axis'
import Svg, {G, Line, Text} from 'react-native-svg'

const d3 = {
    shape,
    scale,
    axis
};


/**
 * @description Use this function to get the exact position of the labels!
 *
 * @param usingNumber
 * @param data
 * @param reverseLabels
 * @param length
 * @returns {*}
 */
export const  getWidthFormatter = (usingNumber,data,reverseLabels,length,paddingBetweenBars) =>{
    let x;
    if (usingNumber) {

        let max = data.reduce((currMax, d) => {
            return Math.max(currMax, d);
        }, 0);


        let rangeStart = 0;
        let rangeEnd = length;
        if (reverseLabels) {
            rangeStart = length;
            rangeEnd = 0;
        }
        x = d3.scale.scaleLinear()
            .domain([0, max])
            .range([rangeStart, rangeEnd])
            .nice(); // rounds to the nearest nice numbers whatever that means


    } else { // string data
        let start = 0;
        if (reverseLabels) {
            start = length;
            length = 0;
        }
        x = d3.scale.scaleBand()
            .domain(data)
            .range([start, length]).paddingInner(paddingBetweenBars);
    }
    return x;
}
/**
 * @description This class is needs some work to fully function. The main problem at this moment
 * is that it is difficult to get the x function which will place the labels
 *
 * This could be fixed by having a callback and creating the x function in the constructor however!
 */
export default class Axis extends Component {

    constructor(props) {
        super(props);
        this.computeData = this.computeData.bind(this);
        // set state
        this.state = this.computeData(props);

    }
    componentWillReceiveProps(props){
        this.setState(this.computeData(props));
    }

    computeData(props){
        let {data,
            length,
            strokeWidth,
            strokeColor,
            tickCount,
            alternateTicks,
            useTicks,
            tickWidth,
            tickColor,
            tickHeight,
            alternateTickHeight,
            rotateLabels,
            reverseLabels,
            labelOffset,
            paddingBetweenBars,
            labelFormatter
        } = this.props;
        let x;
        let labels = [];
        let dress = [];
        let usingNumber = typeof data[0] === 'number';

        if(data.length !== 0) {
            if (usingNumber) {
                let max = data.reduce((currMax, d) => {
                    return Math.max(currMax, d);
                }, 0);
                x = getWidthFormatter(usingNumber, data, reverseLabels, length, paddingBetweenBars);
                let divider = max / tickCount;
                for (let i = 0; i <= tickCount; i++) {
                    labels.push(i * divider);
                }
            } else { // string data
                x = getWidthFormatter(usingNumber, data, reverseLabels, length, paddingBetweenBars);
                labels = data;
            }

            labels.forEach((label, i) => {
                dress.push({});
                dress[i].tickHeight = tickHeight;

                if (i % 2 === 0 && alternateTicks) {
                    dress[i].tickHeight = alternateTickHeight;
                }
            });
        }
        return {
            length : length,
            strokeColor : strokeColor ,
            strokeWidth : strokeWidth ,
            tickColor : tickColor ,
            labels : labels ,
            x : x ,
            tickWidth : tickWidth ,
            dress : dress ,
            rotateLabels : rotateLabels ,
            labelOffset : labelOffset ,
            labelFormatter : labelFormatter ,
        };
    }
    render() {
        // this data does not need to be recomputed every time
        let {length,strokeColor,strokeWidth,tickColor,labels,x,tickWidth,dress,rotateLabels,labelOffset,labelFormatter} = this.state;
        return (
            <G key={this.props.theKey}>
                <Line stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      x1={0}
                      x2={length + this.props.extraLineWidth}
                      y1={0}
                      y2={0}/>
                {labels.map((val, i) => (
                    <G key={`Tick ${i}`}>
                        <Line
                            stroke={tickColor}
                            strokeWidth={tickWidth}
                            x1={this.props.offset + x(val)}
                            x2={this.props.offset + x(val)}
                            y1={0}
                            y2={dress[i].tickHeight}/>
                        <Text
                            transform={{
                                rotate: rotateLabels,
                                translate: `${x(val) + labelOffset.x + this.props.offset},${dress[i].tickHeight + 2 + labelOffset.y}`
                            }}

                            fontSize={12}
                            textAnchor="middle"
                            fontWeight="bold"

                        >
                            {labelFormatter(val)}
                        </Text>
                    </G>
                ))}
            </G>
        );
    }
}
Axis.propTypes = {
    data: PropTypes.array,
    length: PropTypes.number,
    key: PropTypes.string,
    strokeWidth: PropTypes.string,
    strokeColor: PropTypes.string,
    alternateTicks: PropTypes.bool,
    useTicks: PropTypes.bool,
    tickCount: PropTypes.number,
    tickWidth: PropTypes.string,
    tickColor: PropTypes.string,
    tickHeight: PropTypes.number,
    labelFormatter: PropTypes.func


};
Axis.defaultProps = {
    data: [1, 3, 20, 100, 1, 30],
    length: Dimensions.get('window').width,
    theKey: 'Axis',
    strokeWidth: '4',
    strokeColor: '#000',
    tickCount: 10,
    alternateTicks: true,
    useTicks: true,
    tickWidth: '2',
    tickColor: '#000',
    tickHeight: 8,
    alternateTickHeight: 16,
    rotateLabels: "0",
    reverseLabels: false,
    labelOffset: {x: 0, y: 0},
    offset : 0,
    extraLineWidth : 20,
    paddingBetweenBars : 0.2,
    labelFormatter: (d) => (typeof d === 'number' ? Math.round(d) : d)
};