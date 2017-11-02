import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Image,
    StyleSheet, Text,
    View
} from 'react-native'
import {componentStyle} from "../../styles/componentStyle";
import NavigatorBar from "../NavigationBar";


export default class Performance extends Component {
    static navigationOptions = {
        drawerLabel: 'Performance',
        drawerIcon: ({ tintColor }) => (
            <Image
                source={require('../../../res/chats-icon.jpg')}
                style={[componentStyle.drawerIcon, {tintColor: tintColor}]}
            />
        ),
    };

    constructor(props) {
        super(props);
        // set state

        this.state = {};

    }
    componentWillMount(){}
    componentDidMount(){}
    render() {
        return (
            <View>
                <NavigatorBar {...this.props}/>
                <Text>
                    Performance
                </Text>
            </View>
        );
    }
    /** UPDATING **/
    /** The following are called when there are changed to the props**/
    componentWillReceiveProps(){}
    shouldComponentUpdate(){}
    componentWillUpdate(){}
    // render()
    componentDidUpdate(){}

    /** UNMOUNTING **/
     componentWillUnmount(){}

    /** Other API's **/
    // setState()
    // forceUpdate()
}
