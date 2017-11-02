import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Image,
    StyleSheet, Text,
    View
} from 'react-native'
import {componentStyle} from "../../styles/componentStyle";
import NavigatorBar from "../NavigationBar";


export default class Settings extends Component{

    static navigationOptions = {
        drawerLabel: 'Settings',
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
                    Settings
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
// Settings.propTypes = {
//     onPress: PropTypes.func,
//     text: PropTypes.string,
//     size: PropTypes.object
// };
// Settings.defaultProps = {
//     onPress: null,
//     text: "You need to set the property text=",
//     size: {
//         width: 200,
//         height: 350
//     }
// };