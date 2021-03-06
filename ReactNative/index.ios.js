// TEST
import React, {Component} from 'react';

import DataStore from "./src/redux/DataStore";
import {AppRegistry, Text, TouchableHighlight, View} from 'react-native'
import {Button, Icon, SearchBar} from 'react-native-elements'
import LoadingScreen from "./LoadingScreen";
import Provider from "react-redux/src/components/Provider";
import {
    loadToken, t1, testActiveUsers, testCrashes, testGetApps, testGetSessions, testPerformance, testUsers,
    testUsersByPlatform,
    testUsersByRegion,
    testGetAppSummary, testCompareSummary,
    testAppVersions
} from "./tester"
import * as Tester from "./tester"
import {AUTO_LOGIN_INFO, getTest, LOG_ALL, LOG_NETWORK, setLogLevel, setTesting} from "./projectTest/isTesting";
import AppList from "./src/presentationViews/CustomDataviews/AppList";
import {WIDTH, HEIGHT} from "./src/constants";
import AppSelector from "./src/presentationViews/Other/AppSelector";
import Spinner from "react-native-loading-spinner-overlay";
import * as CONSTANTS from "./src/constants";
import Svg from "react-native-svg/elements/Svg";
import Axis from "./src/presentationViews/Dataviews/Axis";
import {G} from "react-native-svg";
import LineChart from "./src/presentationViews/Dataviews/LineChart";

//TODO : We need to periodically sign back in and get a new refresh token
let serverTesting = function (dispatch) {
    console.log("Testing begin");
    Tester.loadToken("", "", "").then(() => {
        testGetApps();
        testCrashes();
        testUsersByRegion();
        testUsersByPlatform();
        // testActiveUsers();
        testGetSessions();
        testPerformance();
        testUsers();
        testGetAppSummary();
        testCompareSummary();
        testAppVersions();
    });
};
//TODO : Otherwise the data flow will not work some times
export default class App extends Component {


    constructor(props) {
        super(props);
    }

    render() {
        // test();

        console.disableYellowBox = true;


        // return (<Svg key={"sed"} height={HEIGHT} width={WIDTH}>
        //     <LineChart/>
        // </Svg>
        // )
        // )

        // setTesting(AUTO_LOGIN_INFO);
        // turn auto login off
        // setLogLevel(LOG_ALL);

        // if(getTest()){
        //     serverTesting();
        //     return (<View>
        //      </View>)
        // }

        // serverTesting();


        return (
            <Provider store={DataStore}>
                <LoadingScreen/>
            </Provider>

        );
    }
}
AppRegistry.registerComponent('MAAExec', () => App);
