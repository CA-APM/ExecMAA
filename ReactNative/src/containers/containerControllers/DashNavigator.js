import React from 'react'
import Overview from '../Overview'
import {DrawerNavigator} from 'react-navigation'
import Crashes from "../toBeDrawerContainers/Crashes";
import Performance from "../toBeDrawerContainers/Performance";
import Sessions from "../toBeDrawerContainers/Sessions";
import Usage from "../toBeDrawerContainers/Usage";
import Settings from "../toBeDrawerContainers/Settings";
import Logout from "../Logout";


/**
 * @description This is the DrawerNavigator that facilitates navigation between all
 * of the current screens
 */
const DashNavigator = function () {
    const configuration = {
        drawerWidth: 200
    };
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