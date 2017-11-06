import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Image,
    StyleSheet, Text,
    View
} from 'react-native'
import {ComponentStyle} from "../../styles/componentStyle";
import NavigatorBar from "../NavigationBar";


export default class Usage extends Component {
    static navigationOptions = {
        drawerLabel: 'Usage',
        drawerIcon: ({ tintColor }) => (
            <View/>

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
                    Usage
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
// Usage.propTypes = {
//     onPress: PropTypes.func,
//     text: PropTypes.string,
//     size: PropTypes.object
// };
// Usage.defaultProps = {
//     onPress: null,
//     text: "You need to set the property text=",
//     size: {
//         width: 200,
//         height: 350
//     }
// };