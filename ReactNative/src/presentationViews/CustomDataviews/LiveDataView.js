import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    StyleSheet, Text,
    View
} from 'react-native'
import {GridLayout} from "../Layouts/FlatLayout";
import {Blink} from "../Layouts/BasicAnimations";
import {PRIMARY_COLOR_800} from "../../constants";
import * as Util from "../../utils/Util";
import {DataStatus} from "../../redux/ReduxUtil";
import {LoadRestView} from "../Other/PresentationUtil";
import {ComponentStyle} from "../../styles/componentStyle";


/**
 * @description This presentation view was originally meant to display constantly changing data
 * It will show the changes in previous and current data and display positive changes in gree
 * and negative changes in red
 */
export default class LiveDataView extends Component {

    constructor(props) {
        super(props);
        // set state
        this.state = {
            data: []
        };
        this.computeState = this.computeState.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {

        if (this.state !== nextState) {
            return true;
        }
        if (nextProps.metadata.status === DataStatus.success) {
            if (nextProps.data === this.props.data) {
                return false;
            } else {
                this.computeState(nextProps);
                return true;
            }
        }
        return true;
    }

    /**
     * Formats the data based on previous and current values.
     * Will display views accordingly
     *
     * @param {Number}  old
     * @param {Number}  current
     * @param {String}  agg
     * @param {String}  label
     * @param {Bool}    positiveIsGood indicates if an increase ((current-old)>0) is a good thing
     * @returns {{title: string, value: string, changeString: string, color: (string|*)}}
     */
    getDataInfo(old, current, agg, label, positiveIsGood) {

        const green = "#00b941";
        const red = "#ff2c48";

        let color, cs;
        let delta = current - old;
        let deltaPercent = delta / old;
        deltaPercent *= 100;

        let didIncrease = deltaPercent > 0;
        let sign = didIncrease ? "+" : "-";

        let verb = didIncrease ? "more" : "less";

        if (!positiveIsGood) {
            didIncrease = !didIncrease;
        }
        current = Util.formatNumber(current, 1000);
        delta = Util.formatNumber(delta, 1000);
        deltaPercent = Util.formatToDecimal(deltaPercent, 100);
        if (deltaPercent == 0) {
            didIncrease = "";
        }


        deltaPercent = deltaPercent.toString().replace(/-/, "");
        delta = delta.toString().replace(/-/, "");
        color = didIncrease ? green : red;


        if (old === 0) {
            cs = `${sign}${delta} ${label}`;
        } else {
            cs = `${sign}${delta} (${deltaPercent}%) ${verb} ${label}`;

        }
        return {
            title: `${label}`,
            value: `${current}`,
            changeString: cs,
            color: color
        }
    }

    computeState(props) {
        let data = props.data;

        let computeData = [];
        let agg = props.aggregation[0].toUpperCase() + props.aggregation.slice(1);
        computeData = data.map((ele) => {
            return this.getDataInfo(ele.past, ele.current, agg, ele.label, ele.moreOfValueIsGood);
        });
        this.setState({data: computeData});

    }

    render() {
        return (

            <View style={{width: this.props.width}}>
                <LoadRestView metadata={this.props.metadata} width={this.props.width} height={200} props={this.props}>
                    <GridLayout titleView={this.props.titleView}
                                rows={2} cols={2} seperatorColor={PRIMARY_COLOR_800}
                                height={200}
                    >
                        {
                            this.state.data.map((d, index) => {
                                return (<View key={index} style={{flex: 1, alignSelf: "center", alignItems: "center"}}>
                                        <Text style={
                                            [ComponentStyle.label,
                                                {
                                                    fontSize: 14,
                                                    textAlign: "center",
                                                    fontWeight: "400",
                                                    color: "black"
                                                }
                                            ]}>{d.title}</Text>
                                        <Blink duration={500}>
                                            <Text style={[ComponentStyle.label, {color: "black"}]}>{d.value}</Text>
                                            <Text
                                                style={
                                                    [ComponentStyle.label,
                                                        {
                                                            fontSize: 14,
                                                            textAlign: "center",
                                                            fontWeight: "bold",
                                                            color: d.color
                                                        }
                                                    ]}>{d.changeString}
                                            </Text></Blink>

                                    </View>

                                )
                            })
                        }

                    </GridLayout>
                </LoadRestView>
            </View>

        );
    }


}
LiveDataView.propTypes = {

    aggregation: PropTypes.string
};

LiveDataView.defaultProps = {
    metadata: {status: DataStatus.notFetching},
    aggregation: "",
    titleView: null,
    data: [
        {label: "label", current: 0, past: 0, moreOfValueIsGood: true},
        {label: "label", current: 0, past: 0, moreOfValueIsGood: true},
        {label: "label", current: 0, past: 0, moreOfValueIsGood: true},
        {label: "label", current: 0, past: 0, moreOfValueIsGood: true},
    ]


}
