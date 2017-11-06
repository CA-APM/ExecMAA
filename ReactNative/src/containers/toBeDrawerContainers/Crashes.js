

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Image,
    StyleSheet, Text,
    View
} from 'react-native'
import {ComponentStyle} from "../../styles/componentStyle";
import NavigatorBar from "../NavigationBar";


var today = new Date();

export default class Crashes extends Component {
    static navigationOptions = {
        drawerLabel: 'Crashses',
        drawerIcon: ({ tintColor }) => (
            <View/>
        ),
    };

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View>
                <NavigatorBar {...this.props}/>



            </View>
        );
    }


}