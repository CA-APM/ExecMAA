import React, {Component} from "react"
import PropTypes from "prop-types"
import {
    ART,
    Image,
    WebView,
    Text,
    View, Picker, ScrollView,
    StyleSheet, ActivityIndicator
} from "react-native"

import NavigatorBar from "./NavigationBar";
import {ComponentStyle} from "../styles/componentStyle";
import {HEIGHT, PRIMARY_COLOR_800, WIDTH} from "../constants";
import {FlatLayout, GridLayout} from "../presentationViews/Layouts/FlatLayout";
import UserBarChart from "../presentationViews/CustomDataviews/UserBarChart";
import PieChart from "../presentationViews/Dataviews/PieChart";
import {Blink} from "../presentationViews/Layouts/BasicAnimations";
import * as Profile from "../redux/Profile/Action";
import {DataStatus, UpdateStatus} from "../redux/ReduxUtil";
import {connect} from "react-redux";
import * as Util from "../redux/Util/Action";
import LiveDataView from "../presentationViews/CustomDataviews/LiveDataView";
import {getTest} from "../../projectTest/isTesting";
import AppList from "../presentationViews/CustomDataviews/AppList";
import {formatDate, getTimeFilter} from "../utils/Util";
import {Icon} from "react-native-elements";


const Style = StyleSheet.create({

    popupView: {
        shadowColor: '#000000',
        backgroundColor: '#FFFFFF',
        shadowOpacity: 0.35,
        shadowOffset: {width: .1, height: .1},
        marginBottom: 15,
        alignSelf: "center",
        width: "97%"

    }
});

/**
 * @description The overview is responsible for showing a brief overview of the data as a whole
 * It will show crashses, total users, and other important information based on aggregation selectin
 *
 */
class Overview extends Component {

    static navigationOptions = {
        drawerLabel: "Overview",
        drawerIcon: ({tintColor}) => (
            <Icon
                type="FontAwesome"
                name="home"
            />
        ),
    };

    constructor(props) {
        super(props);
    }

    /**
     * @description Used to transform the data into a form the live data view can understand!
     *
     * @param {Array} compareData - the data to be transformed
     * @param {Number} status - the status indicating success of not
     * @returns {Array}
     */
    transformCompareSummary(compareData, status) {
        // only going to grab these keys
        const keys = ["http_request", "http_request_errors", "crashes", "session_counter", "active_users",];
        const labels = ["HTTP Requests", "HTTP Errors", "Crashes", "Sessions", "Active Users"];
        const config = [true, false, false, true, true];
        if (status !== DataStatus.success) {
            return [];
        }
        let current = compareData[0];
        let previous = compareData[1];

        let data = [];
        keys.forEach((key, i) => {
            data.push({label: labels[i], current: current[key], past: previous[key], moreOfValueIsGood: config[i]})
        });

        return data;
    }


    render() {

        let crashData = this.props.crashes;
        let userVisits = this.props.userVisits;
        const padding = 20;
        const rowWidth = WIDTH / 5 * 2 + padding;
        const refreshRate = 13 * 1000;

        let currentMeta = this.props.metadata;
        let tf1 = getTimeFilter(currentMeta.timeFilter.jsEndDate, currentMeta.aggregation);
        let tf2 = getTimeFilter(tf1.jsStartDate, currentMeta.aggregation);
        let d1 = `${formatDate(tf1.jsStartDate)}-${formatDate(tf1.jsEndDate)}`;
        let d2 = `${formatDate(tf2.jsStartDate)}-${formatDate(tf2.jsEndDate)}`;


        let pie1;
        let pie2;
        let pie3;
        if (crashData.metadata.status === DataStatus.success) {
            pie1 = crashData.crashesByDevice;
            pie2 = crashData.crashesByPlatform;
            pie3 = crashData.crashesByCarrier;
            if (pie1.length === 0) {
                pie1.push({"value": 1, "label": "No Data"});
            }
            if (pie2.length === 0) {
                pie2.push({"value": 1, "label": "No Data"});
            }
            if (pie3.length === 0) {
                pie3.push({"value": 1, "label": "No Data"});
            }

        }

        let usersCopy = [];
        // only take top 12
        let ubc = this.props.usersByCountry;
        if (ubc.metadata.status === DataStatus.success && ubc.data.length) {
            usersCopy = this.props.usersByCountry.data.map((item) => {
                return Object.assign({}, item);
            }).sort((v1, v2) => {
                if (v1.value == v2.value) {
                    return 0;
                }
                if (v1.value < v2.value) {
                    return 1
                }
                return -1;
            });
            usersCopy = usersCopy.filter((item, i) => {
                return i < 12;
            });
        }

        return (
            <View style={{flex: 1}}>

                <NavigatorBar {...this.props}/>

                <View style={{flex: 1}}>
                        {/*<View style={{width:WIDTH,height:10}}/>*/}

                        <ScrollView bounces={false}>
                            <View style={{width: WIDTH, height: 10, backgroundColor: "#f7f7f7"}}/>


                            <View style={{width: WIDTH, backgroundColor: "#f7f7f7"}}>


                                <FlatLayout widthPercent={"93%"}>
                                    <LiveDataView
                                        titleView={
                                            <View style={{flex: 1, alignItems: 'center'}}>
                                                <View style={{flex: 1}}/>
                                                <Text style={[ComponentStyle.description]}>
                                                    {d1}
                                                </Text>
                                                <Text>{"vs."}</Text>
                                                <Text style={[ComponentStyle.description]}>
                                                    {d2}
                                                </Text>

                                                <View style={{flex: 1}}/>

                                            </View>}
                                        style={{width: WIDTH}}
                                        data={this.transformCompareSummary(this.props.compareSummary.data, this.props.compareSummary.metadata.status)}
                                        metadata={this.props.compareSummary.metadata}
                                        aggregation={this.props.metadata.aggregation}/>


                                    <UserBarChart data={userVisits.totalUsers}
                                                  metadata={userVisits.metadata}
                                                  aggregation={this.props.metadata.aggregation}
                                                  bardirection={"vertical"}/>

                                    <PieChart title="Crashes by Device" data={pie1}
                                              metadata={crashData.metadata}></PieChart>
                                    <PieChart title="Crashes by Platform" data={pie2}
                                              metadata={crashData.metadata}></PieChart>
                                    <PieChart title="Crashes by Carrier" data={pie3}
                                              metadata={crashData.metadata}></PieChart>

                                    <UserBarChart data={usersCopy}
                                                  metadata={ubc.metadata}
                                                  aggregation={null}
                                                  bardirection={"horizontal"}
                                                  title={"Users By Country"}/>

                                </FlatLayout>

                            </View>

                        </ScrollView>


                </View>
            </View>
        );
    }



}

export default connect((state) => ({
    userVisits: state.profile.data.userVisits,
    usersByCountry: state.profile.data.usersByCountry,
    crashes: state.profile.data.crashes,
    compareSummary: state.profile.compareData.compareSummary,
    metadata: state.profile.metadata,
    appToken: state.authentication.appToken
}))(Overview);
