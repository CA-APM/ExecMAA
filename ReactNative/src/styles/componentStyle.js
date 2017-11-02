import React from 'react'
import * as CONSTANTS from '../constants'
import {StyleSheet} from 'react-native'
import {WIDTH,HEIGHT} from "../constants"
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// check out http://fontawesome.io/icons/ for all of the icons you can use
/**
 * Interesting ones I have found
 * area-graph
 */
const componentStyle = StyleSheet.create({
    container: {
        flex: 1,
        // height : HEIGHT / 2,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',
        paddingBottom:HEIGHT / 6

    },
    center:{
        alignItems:'center',
        justifyContent: 'center',
        flexDirection : 'row'
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily:'FontAwesome'
    },
    drawerIcon:{
        width: 24,
        height: 24,
    },
    prettyLabel :{
        justifyContent:'center',
        alignItems:'center',
        fontSize:25,
        alignSelf:"center",

    }


});



export {componentStyle}