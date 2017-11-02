import React, {Component} from 'react'
import {Animated} from 'react-native'
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View
} from 'react-native'


export default class Fade extends Component {


    constructor(props) {
        super(props);
        // set state
        this.state = {
            duration: this.props.duration,
            opacity: new Animated.Value(this.props.opacity),
        };

    }
    componentDidMount() {
        Animated.timing(this.state.opacity,
            {
            toValue: this.props.finalOpacity,
            duration: this.state.duration
            }
        ).start()
    }

    render() {
        let { opacity } = this.state;
        return (
            <Animated.View
                style={{
                    ...this.props.style,
                    opacity: opacity
                }}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}
Fade.propTypes = {
    duration: PropTypes.number,
    opacity: PropTypes.number,
    finalOpacity: PropTypes.number

};
Fade.defaultProps = {
    duration: 1000,
    opacity: 0,
    finalOpacity: 1
};