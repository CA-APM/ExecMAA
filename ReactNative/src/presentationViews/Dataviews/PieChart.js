import React, {Component} from 'react'
import * as shape from "d3-shape";
import * as scale from "d3-scale";
import * as axis from 'd3-axis'
import {Text, View, ART} from "react-native";
import * as Morph from "art/morph/path";
import {Button} from "react-native-elements";
import LoadingScreen from "../../../LoadingScreen";
import {LoadRestView, LoadView} from "../Other/PresentationUtil";
import {DataStatus} from "../../redux/ReduxUtil";
import {WIDTH} from "../../constants";
import {ComponentStyle} from "../../styles/componentStyle";
// Thanks to
// https://medium.com/the-react-native-log/animated-charts-in-react-native-using-d3-and-art-21cd9ccf6c58
const {Group, Shape, Surface} = ART;

const d3 = {
    shape,
    scale,
    axis
}
const formatText = (data, sum) => {
    let percent = (data / sum) * 100;
    percent = Math.round(percent);
    return " " + percent.toString() + "%";
}
export default class PieChart extends Component {


    constructor(props) {
        super(props);

        this.animate = this.animate.bind(this);
        this.getArcs = this.getArcs.bind(this);
        this.didSelect = this.didSelect.bind(this);
        this.calculateState = this.calculateState.bind(this);

        this.state = {
            selected: -1,
            arcs: [],
            currArcs: [],
            lineArcs: [],
            labels: [],
            colors: [],
            sum: -1
        };


    }


    didSelect(index) {
        this.setState({
            selected: index
        }, () => {
            this.setState({
                lineArcs: this.getArcs(this.state.arcs)
            });

        })
    }

    calculateState(props) {
        let theSum = 0;
        let data = props.data;

        if (!data || data.length === 0) {
            return;
        }
        for (let d of data) {
            theSum += d.value;
        }
        var arcs = shape.pie()
            .value((x) => {
                return x["value"];
            })(data);

        var startArcs = shape.pie()
            .value((x) => {
                return x["value"];
            })(data);
        startArcs.forEach((obj) => {
            obj.endAngle = obj.startAngle;
        });
        let colors = props.colors;
        let labels = props.data.map((item) => {
            return item.label;
        });
        let radius = (Math.min(props.width, props.height) / 2) - this.props.padding;

        this.setState({
            radius: radius,
            selected: -1,
            arcs: arcs,
            currArcs: startArcs,
            lineArcs: [],
            labels: labels,
            colors: colors,
            sum: theSum
        }, () => {
            this.animate()
        });


    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state !== nextState) {
            return true;
        }
        if (nextProps.metadata.status === DataStatus.success) {
            if (nextProps.data === this.props.data) {
                return false;
            } else {
                this.calculateState(nextProps);
                return true;
            }
        }
        return true;
    }


    getArcs(arcs) {

        let radius = this.state.radius;
        return arcs.map((arc, i) => {
            let addition = i == this.state.selected ? 15 : 0;
            return shape.arc()
                .outerRadius(radius)  // Radius of the pie
                .padAngle(.05)    // Angle between sections
                .innerRadius(this.props.innerRadius)  // Inner radius: to create a donut or pie
                (arc);
        });

    }


    animate(start) {
        let self = this;
        this.animating = requestAnimationFrame((timestamp) => {
            if (!start) {
                start = timestamp;
            }

            // Get the delta on how far long in our animation we are.
            const delta = (timestamp - start) / 2500;

            // If we're above 1 then our animation should be complete.
            if (delta > 1) {
                self.animating = null;

                self.setState({
                    lineArcs: self.getArcs(self.state.arcs)
                });

                // Stop our animation loop.
                return;
            }


            // Tween the SVG path value according to what delta we're currently at.
            let lineArcs = self.getArcs(self.state.currArcs.slice());
            let updatedArcs = self.state.currArcs.slice().map((arc, index, array) => {
                // if index comes out of order everything will look wierd and you should just use a constant
                // arc.endAngle = delta *  self.state.arcs[index].endAngle;
                let endAngle = self.state.arcs[index].endAngle;
                let startAngle = self.state.arcs[index].startAngle;
                let final = (delta * (endAngle - startAngle) ) + startAngle;
                arc.endAngle = final;
                if (self.state.arcs[index].endAngle < arc.endAngle) {
                    arc.endAngle = self.state.arcs[index].endAngle
                }
                return arc
            });


            // Update our state with the new tween value and then jump back into
            // self loop.
            self.setState({lineArcs: lineArcs, currArcs: updatedArcs}, () => {
                self.animate(start);
            });
        });
    }


    render() {
// Got a good amount of this code from https://bl.ocks.org/mbostock/3887235



        let {height, width,padding,metadata,title} = this.props;
        const props = this.props;
        let radius = this.state.radius;
        let midX = width /2;
        let midY = height /2;
        var colorScalar = d3.scale.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var label = d3.shape.arc()
            .outerRadius(radius)
            .innerRadius(40);


        let theLabels = this.state.labels;
        const lineArcs = this.state.lineArcs;
        const total = this.state.sum;
        const arcs = this.state.arcs;


        return (


            <LoadRestView metadata={metadata} width={width} height={height} props={props}>

                <View style={{alignItems:'center' ,backgroundColor:"#00000000"}}>
                    <Text style={ComponentStyle.label}>{title}</Text>


                    <Surface width={width} height={height}>
                        <Group  x={midX} y={midY}>
                            { lineArcs.map((arc, i) => (
                                <Shape d={arc} fill={colorScalar(arcs[i].value)}/>))}
                        </Group>
                    </Surface>





                    <View style={{position:'absolute',top:midY,left:midX}}>
                        {

                            theLabels.map((elem, i) => {
                                // I want the center of the text to be at x and y, not the top
                                // does it need .value????
                                let data = arcs[i].value;

                                let percent = Math.round((data / total) * 100).toString() +"%";
                                let pos = label.centroid(arcs[i]);
                                let x = pos[0];
                                let y = pos[1];
                                // 2 pi = 360
                                // anything less than 20 percent gets not label

                                if(elem == "No Data"){
                                    percent = "";

                                }
                                const minimumLabel=  0.5;
                                if(arcs[i].endAngle - arcs[i].startAngle < minimumLabel){
                                    // no label
                                    return undefined;
                                }
                                return (
                                    <Text key={i} style={[ComponentStyle.label,{alignSelf:'center',fontSize:18,color:"#000000", transform:[{translateX : x},{translateY:y}], position: 'absolute',backgroundColor:"#00000000"}]}>{elem +" " + percent}</Text>
                                )
                            })
                        }
                    </View>

                </View>
            </LoadRestView>
        );
    }


}

PieChart.defaultProps = {
    padding : 20,
    height: 340,
    innerRadius: 40,
    width: WIDTH,
    data: null,
    metadata: null,
    title: "",
    colors: [
        "#ff4e32",
        "#f4f90f",
        "#42f826",
        "#0240cb",
        "#c908cf",
        "#14f9f6",
        "#ff87fb",
        "#0d0095"
    ]
};

