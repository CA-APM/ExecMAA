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
/**
 * @description this is a basic wrapper around the normal bar chart, it includes a title
 * and also has a Loading view which will display an error if we fail to load the chart
 */
export default class UserBarChart extends Component {
    constructor(props) {
        super(props);
        // set state

    }
    render() {

        let title = "";
        if(this.props.aggregation) {
            title = `Total ${titles[this.props.aggregation]} Users`

        }else{
            title = this.props.title;
        }
        return (
            <LoadRestView metadata={this.props.metadata} width={this.props.width} props={this.props}>
                <View>
                    <Text style={[ComponentStyle.label, {marginTop: 10}]}>
                        {title}
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

UserBarChart.defaultProps = {
    bardirection: 'vertical',
    aggregation: "day",
    data: [],
    metadata: {},
    title : ""

};

