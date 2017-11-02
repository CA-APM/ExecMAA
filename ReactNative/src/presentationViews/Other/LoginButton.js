import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
} from 'react-native'
import {style} from '../../styles/loginStyle'
import PropTypes from 'prop-types'
import Login from "../../containers/Login";


/**
 LoginButton : description
 **/
export default class LoginButton extends Component {

    constructor(props) {
        super(props);

    }
    render() {
        return (
            <TouchableHighlight underlayColor={'#101BDB'}
                                style={[this.props.style,this.props.size, style.columnContainer]}
                                onPress={this.props.onPress}>
                <View style={[this.props.size, style.viewButton]}>
                    <Text style={style.buttonText}>
                        {this.props.text}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }
}
LoginButton.propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string,
    size: PropTypes.object
};
LoginButton.defaultProps = {
    onPress: null,
    text: "You need to set the property username=",
    size: {
        width: 200,
        height: 350
    }
};