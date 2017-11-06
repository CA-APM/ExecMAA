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
import Fade from "../presentationViews/Layouts/Fade";
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

        // default load

    }


    random(num) {
        let toReturn = (.10 * Math.random() * num + num);
        toReturn = Math.round(toReturn);
        return toReturn.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

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
        let d1 =  `${formatDate(tf1.jsStartDate)}-${formatDate(tf1.jsEndDate)}`;
        let d2 =  `${formatDate(tf2.jsStartDate)}-${formatDate(tf2.jsEndDate)}`;

// /*style={{opacity:this.props.updateStatus === UpdateStatus.failed ? 0.8 : 0.0}*/
        //                {this.props.updateStatus === UpdateStatus.failed  ? <Text>Error loading please try again</Text>: undefined}


        return (


            // REMEMBER TO PUT FLEX : 1 here so the nav bar will render list corect
            <View style={{flex: 1}}>


                <NavigatorBar {...this.props}/>

                <View style={{flex: 1}}>
                    <Fade opacity={0} finalOpacity={1} duration={300}>
                        {/*<View style={{width:WIDTH,height:10}}/>*/}

                        <ScrollView bounces={false}>
                            <View style={{width: WIDTH, height: 10, backgroundColor: "#f7f7f7"}}/>


                            <View style={{width: WIDTH, backgroundColor: "#f7f7f7"}}>


                                <FlatLayout widthPercent={"93%"}>
                                    <LiveDataView
                                        titleView={
                                            <View style={{flex: 1, alignItems:'center'}}>
                                                <View style={{flex:1}}/>
                                                <Text>{"Comparing "}</Text>
                                                <Text style={[ComponentStyle.description]}>
                                                    {d2}
                                                </Text>
                                                <Text>{"to"}</Text>
                                                <Text style={[ComponentStyle.description]}>
                                                    {d1}
                                                </Text>

                                                <View style={{flex:1}}/>

                                            </View>}
                                        style={{width: WIDTH}}
                                        data={this.transformCompareSummary(this.props.compareSummary.data, this.props.compareSummary.metadata.status)}
                                        metadata={this.props.compareSummary.metadata}
                                        aggregation={this.props.metadata.aggregation}/>


                                    <UserBarChart data={userVisits.totalUsers}
                                                  metadata={userVisits.metadata}
                                                  aggregation={this.props.metadata.aggregation}
                                                  bardirection={"vertical"}/>

                                    <PieChart title="Crashes by Device" data={crashData.crashesByDevice}
                                              metadata={crashData.metadata}></PieChart>
                                    <PieChart title="Crashes by Platform" data={crashData.crashesByPlatform}
                                              metadata={crashData.metadata}></PieChart>
                                    <PieChart title="Crashes by Carrier" data={crashData.crashesByCarrier}
                                              metadata={crashData.metadata}></PieChart>

                                </FlatLayout>

                            </View>

                        </ScrollView>


                    </Fade>
                </View>
            </View>
        );
    }

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


}

export default connect((state) => ({
    userVisits: state.profile.data.userVisits,
    crashes: state.profile.data.crashes,
    compareSummary: state.profile.compareData.compareSummary,
    metadata: state.profile.metadata,
    appToken: state.authentication.appToken
}))(Overview);
