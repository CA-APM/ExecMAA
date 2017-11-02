import React from 'react'
import * as CONSTANTS from '../constants'
import {StyleSheet} from 'react-native'

const style = StyleSheet.create({
    container: {
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center'
    },
    viewButton: {
        borderStyle: 'solid',
        borderRadius: 2,
        borderColor: '#333333',
        borderWidth: 2,
        backgroundColor: CONSTANTS.AQUA_BLUE,
        // alignContent: 'center'

    },
    textInput : {
        bottom : 20,
        height : 40,
        width : 200,
        borderColor: CONSTANTS.AQUA_BLUE,
        borderWidth:2
    }

});



export {style}