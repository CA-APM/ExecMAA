import React, {Component} from 'react'
import {Dimensions} from 'react-native'
import PropTypes from 'prop-types'
import * as shape from "d3-shape";
import * as scale from "d3-scale";
import * as axis from 'd3-axis'
import Svg, {Circle, G, Line, Polyline, Text} from 'react-native-svg'
import Axis, {getWidthFormatter} from "./Axis";
import {HEIGHT, WIDTH} from "../../constants";

const d3 = {
    shape,
    scale,
    axis
};

export default class LineChart extends Component {

    constructor(props) {
        super(props);
        // set state
        this.computeData = this.computeData.bind(this);
        this.state = this.computeData(props);
    }

    componentWillReceiveProps(props) {
        this.setState(this.computeData(props));
    }

    computeData(props) {

    }

    render() {
        let leftMargin = 50;
        let rightMargin = 0;
        let topMargin = 70, bottomMargin = 20;
        let width = WIDTH * 5/6;
        let height = HEIGHT * 0.5;

        // get average
        // get min
        // get max
        let yMin = 10000, yMax = 0;
        let theMin = 10000, theMax = 0;
        this.props.data.forEach((arr) => {
            arr.forEach((d) => {
                yMin = Math.min(yMin, d.y);
                yMax = Math.max(yMax, d.y);
                theMin = Math.min(theMin, d.x);
                theMax = Math.max(theMax, d.x);
            });
        });
        // generate some labels

        // now i need to map the ranges, should use d3 scale
        let numXLabels = 5;
        let xAxis = [], yAxis = [];
        for (let i = theMin; i <= theMax; i += (theMax - theMin) / numXLabels) {
            xAxis.push(i);
        }
        for (let i = yMin; i <= yMax; i += ((yMax - yMin) / numXLabels)) {yAxis.push(i);}

        let yLabels = [];
        let divider = yMax / numXLabels;
        for (let i = 0; i <= numXLabels; i++) {
            yLabels.push(i * divider);
        }


        let verticalAxisHeight = height - topMargin - bottomMargin;
        let horizontalAxisWidth = width - leftMargin - rightMargin - 20;
        let xMap = d3.scale.scaleLinear()
            .domain([theMin, theMax])
            .range([0, horizontalAxisWidth])
            .nice();


        let yMap = d3.scale.scaleLinear()
            .domain([yMin, yMax])
            .range([0, verticalAxisHeight])
            .nice();

        let horizontalSeperatorSpace = verticalAxisHeight / numXLabels;
        let hSeperators = [];
        for (let i = 0; i < yAxis.length-1; i++) {
            hSeperators.push(
                (<Line
                    strokwWidth="1"
                    stroke="gray"
                    x1="0"
                    x2={`${horizontalAxisWidth}`}
                    y1={verticalAxisHeight-(yMap(yLabels[i]))}
                    y2={verticalAxisHeight-(yMap(yLabels[i]))}
                />));
        }

        this.props.data.forEach((arr) => {
            arr.forEach((d) => {
                d.x = xMap(d.x);
                d.y = (verticalAxisHeight)- (yMap(d.y));
            });
        });


        return (
            <G key="bye" x={leftMargin} y={topMargin}>
                <G >
                    {hSeperators}
                </G>
                <G  rotate="90">
                    <Axis
                        data={yAxis}
                        strokeColor="#000000"
                        tickCount={numXLabels}
                        alternateTicks={false}
                        tickWidth="1"
                        tickColor="gray"
                        strokeWidth="1.5"
                        length={verticalAxisHeight}
                        reverseLabels={true}
                    />
                </G>
                <G >
                    {
                        this.props.data.map((arr, i) => {
                            return polyLine(this.props.colors[i], 2, arr);
                        })
                    }
                </G>
                <G y={verticalAxisHeight}>
                    <Axis
                        data={xAxis}
                        tickCount={numXLabels}
                        alternateTicks={false}
                        tickWidth="2"
                        strokeWidth="1.5"
                        length={horizontalAxisWidth}
                    />
                </G>
                <G>
                    {circlesGivenPoints(5, "#000000FF", "#FFFFFF", "0", this.props.data, this.props.colors)}
                </G>


            </G>
        );
    }

}


const polyLine = (color, strokeSize, data) => {
    let strData = "";
    data.forEach((val) => {
        strData += `${val.x}, ${val.y} `;
    });
    return (
        <Polyline
            points={strData}
            fill="none"
            stroke={color}
            strokeWidth={strokeSize}
        />
    )
};

const circlesGivenPoints = (size, color, borderColor, borderWidth, arrOfArrays, colors) => {

    return (<G>
        {
            arrOfArrays.map((arr, i) => {
                return arr.map((d, index) => {
                    return (
                        <Circle
                            cx={d.x.toString()}
                            cy={d.y.toString()}
                            r={size.toString()}
                            fill={colors ? colors[i] : color}
                            stroke={borderColor}
                            strokWidth={borderWidth}
                        />
                    )
                })
            })
        }
    </G>)
}


LineChart.propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string,
    size: PropTypes.object
};
LineChart.defaultProps = {
    // data : [
    //      [ {x:1,y:2} ,{x:3,y:5} ...],
    //      .
    //      .
    //      .
    //      [ {x:11,y:21} ,{x:-1,y:22} ...]
    // ]
    data: [

        [{x:0,y:0,x: 50, y: 10}, {x: 100, y: 30}, {x: 150, y: 35}, {x: 200, y: 45}, {x: 250, y: 55}, {x: 300, y: 55}, {x: 350, y: 40}],
        [{x:0,y:40,x: 50, y: 10}, {x: 100, y: 50}, {x: 150, y: 65}, {x: 200, y: 25}, {x: 250, y: 35}, {x: 300, y: 75}, {x: 350, y: 40}],
        [{x:0,y:0,x: 50, y: 10}, {x: 100, y: 30}, {x: 150, y: 35}, {x: 200, y: 45}, {x: 250, y: 55}, {x: 300, y: 55}, {x: 350, y: 40}],
    ],
    colors: ["#FFAA00",
        "#fd48ff",
        "#4833ff",
        "#94ff80",
        "#42fff3",
        "#fffd45"],
    onPress: null,
    text: "You need to set the property text=",
    size: {
        width: 200,
        height: 350
    }
};