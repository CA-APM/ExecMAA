import React, {Component} from 'react'
import Overview from '../Overview'
import {View, Text, Dimensions,StyleSheet,Image} from 'react-native'
import {DrawerNavigator} from 'react-navigation'
import {ComponentStyle} from "../../styles/componentStyle";
import Crashes from "../toBeDrawerContainers/Crashes";
import Performance from "../toBeDrawerContainers/Performance";
import Sessions from "../toBeDrawerContainers/Sessions";
import Usage from "../toBeDrawerContainers/Usage";
import Settings from "../toBeDrawerContainers/Settings";
import {userLogoutAction} from "../../redux/Authentication/Action";
import {connect} from "react-redux";
import Logout from "../Logout";
// import AppPicker from "../AppPicker";




const DashNavigator = function () {
    const configuration = {
        drawerWidth: Dimensions.get('window').width - 200
    };
    DrawerNavigator.DrawerNavigatorConfig
    const TheNav = DrawerNavigator({
        Overview: {screen: Overview},
        // Crashes: {screen: Crashes},
        // Performance: {screen: Performance},
        // Sessions: {screen: Sessions},
        // Usage: {screen: Usage},
        // Settings: {screen: Settings},
        UserLogout       : {screen:Logout}

    }, configuration);

    return (
        <TheNav></TheNav>
    );

};

export {DashNavigator}