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
export default class Axis extends Component {

    constructor(props) {
        super(props);
        // set state
        this.state = {};

    }

    render() {
        // this data does not need to be recomputed every time
        let {reverseLabels,labelPlacer,alternateTicks,removeDecimals,rotateLabels,tickCount,data,labelOffset, id, labelFormatter,alternateTickHeight, tickHeight, strokeWidth, strokeColor, length, tickWidth, tickColor} = this.props;
        let x;
        let labels = [];
        let dress = [];
        let usingNumber =typeof data[0] === 'number';
        if(labelPlacer){
            x = labelPlacer
        }else {
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

                let divider = max / tickCount;
                for (let i = 0; i <= tickCount; i++) {
                    labels.push(i * divider);
                }
            } else { // string data
                labels = data;
                let start = 0;
                let end = length;
                if (reverseLabels) {
                    start = length;
                    length = 0;
                }
                x = d3.scale.scaleBand()
                    .domain(data)
                    .range([start, length]);
            }
        }
        labels.forEach((label,i)=>{
            dress.push({});
            dress[i].tickHeight = tickHeight;

            if(i % 2 === 0 && usingNumber && alternateTicks){dress[i].tickHeight = alternateTickHeight;}
        });
        return (
            <G id={id}>
                <Line stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      x1={0}
                      x2={length}
                      y1={0}
                      y2={0}/>
                {labels.map((val, i) => (
                    <G key={`Tick ${i}`}>
                        <Line
                            stroke={tickColor}
                            strokeWidth={tickWidth}
                            x1={x(val)}
                            x2={x(val)}
                            y1={0}
                            y2={dress[i].tickHeight}/>
                        <Text
                            transform={{rotate:rotateLabels,translate:`${x(val) + labelOffset.x},${dress[i].tickHeight + 2 + labelOffset.y}`}}

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
    id: PropTypes.string,
    strokeWidth: PropTypes.string,
    strokeColor: PropTypes.string,
    alternateTicks: PropTypes.bool,
    useTicks: PropTypes.bool,
    tickCount: PropTypes.number,
    tickWidth: PropTypes.string,
    tickColor: PropTypes.string,
    tickHeight: PropTypes.number,
    labelFormatter : PropTypes.func


};
Axis.defaultProps = {
    data: [1,3,20,100,1,30],
    length:  Dimensions.get('window').width,
    id: 'Axis',
    strokeWidth: '4',
    strokeColor: '#000',
    tickCount: 10,
    alternateTicks: true,
    useTicks: true,
    tickWidth: '2',
    tickColor: '#000',
    tickHeight: 8,
    alternateTickHeight : 16,
    rotateLabels :"0",
    reverseLabels : false,
    labelOffset : {x:0,y:0},
    labelPlacer : null,
    labelFormatter : (d)=> (typeof d === 'number' ? Math.round(d) : d),

};