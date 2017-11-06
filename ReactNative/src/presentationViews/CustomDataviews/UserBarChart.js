import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View
} from 'react-native'
import BarChart from "../Dataviews/BarChart";
import {Text} from "react-native-elements";
import {ComponentStyle} from "../../styles/componentStyle";
import {LoadRestView} from "../Other/PresentationUtil";


const titles = {
    "hour": "Hourly",
    "day": "Daily",
    "week": "Weekly",
    "month": "Monthly"
}
export default class UserBarChart extends Component {

    constructor(props) {
        super(props);
        // set state

    }


    render() {

        let style = this.props.bardirection === "Vertical" ? 1 : 0;
        let data = this.props.data;
        let title = titles[this.props.aggregation];


        return (
            <LoadRestView metadata={this.props.metadata} width={this.props.width} props={this.props}>
                <View>
                    <Text style={[ComponentStyle.label, {marginTop: 10}]}>
                        {`Total ${title} Users`}
                    </Text>
                    <BarChart
                        data={this.props.data}
                        metadata={this.props.metadata}
                        aggregation={this.props.aggregation}

                        barAlignment={this.props.bardirection}
                        title={title}
                    />

                </View>
            </LoadRestView>
        );
    }

}

const moNum = (new Date()).getMonth();
const dayNum = (new Date()).getDay();
const weekNum = 3;
const yearNum = (new Date()).getYear();
UserBarChart.defaultProps = {
    bardirection: 'vertical',
    aggregation: "day",
    data: [],
    metadata: {}

};

