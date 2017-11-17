import React, {Component} from 'react'
import {Animated} from 'react-native'
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View
} from 'react-native'

/**
 * A very basic component that simply increases and decreases the opacity
 * of a view, can be called repeatedly
 *
 */
export class Blink extends Component {


    constructor(props) {
        super(props);
        // set state
        this.state = {
            finalOpacity: new Animated.Value(this.props.finalOpacity),

        };
        this.animate = this.animate.bind(this);
        this.completion = this.completion.bind(this);
    }

    componentDidMount() {
        this.animate();
    }
    completion(){
        console.log("completed blink calling back");
        if(this.props.completion){
            this.props.completion(this.animate);
        }
    }
    animate() {

        Animated.sequence([
            Animated.timing(this.state.finalOpacity,
                {
                    toValue: this.props.opacity,
                    duration: this.props.duration,
                    useNativeDriver: true
                }
            ),
            Animated.timing(this.state.finalOpacity,
                {
                    toValue: this.props.finalOpacity,
                    duration: this.props.duration,
                    useNativeDriver: true
                }
            )
        ]).start(this.completion);

    }
    render() {
        let {finalOpacity} = this.state;
        return (
            <Animated.View
                style={{
                    ...this.props.style,
                    opacity: finalOpacity
                }}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}

Blink.propTypes = {
    duration: PropTypes.number,
    opacity: PropTypes.number,
    finalOpacity: PropTypes.number,

};
Blink.defaultProps = {
    duration: 200,
    opacity: 0,
    finalOpacity: 1,
    completion: null
};