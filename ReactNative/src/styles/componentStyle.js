import React from 'react'
import * as CONSTANTS from '../constants'
import {StyleSheet} from 'react-native'
import {WIDTH, HEIGHT} from "../constants"
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// check out http://fontawesome.io/icons/ for all of the icons you can use
/*

CA Sans-BoldItalic.otf</string>
                <string>CA Sans-Heavy.otf</string>
                <string>CA Sans-HeavyItalic.otf</string>
                <string>CA Sans-Italic.otf</string>
                <string>CA Sans-Light.otf</string>
                <string>CA Sans-LightItalic.otf</string>
                <string>CA Sans-Regular.otf</string>


 */
const ComponentStyle = StyleSheet.create({
    container: {
        flex: 1,
        // height : HEIGHT / 2,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: HEIGHT / 6

    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'FontAwesome'
    },
    drawerIcon: {
        width: 24,
        height: 24,
    },
    header: {
        color: "#FFFFFF",
        fontSize: CONSTANTS.scale(36),
        textAlign: 'center',
        fontFamily: 'Helvetica Neue'
    },
    title: {
        color: "#205796",
        fontSize: 30,
        textAlign: 'center',
        fontFamily: 'CA Sans'
    },
    body: {
        color: "#205796",
        fontSize: 30,
        fontWeight :'normal',
        textAlign: 'center',
        fontFamily: 'Helvetica Neue'
    },
    label: {
        color: "#205796",
        fontSize: 30,
        textAlign: 'center',
        fontFamily: 'Helvetica Neue'
    },
    smallLabel: {
        color: "#205796",
        fontSize: 22,
        textAlign: 'center',
        fontFamily: 'Helvetica Neue'
    },
    description:{
        color: "#205796",
        fontSize: 18,
        fontWeight:"400",
        textAlign: 'center',
        fontFamily: 'Helvetica Neue'
    },
    prettyLabel: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 25,
        alignSelf: "center",

    }


});

const GraphStyle = StyleSheet.create({
    header: {
        color: "#FFFFFF",
        fontSize: 40,
        textAlign: 'center',
        fontFamily: 'Helvetica Neue'
    },
    title: {
        color: "#205796",
        fontSize: 30,
        textAlign: 'center',
        fontFamily: 'CA Sans'
    },
    body: {
        color: "#205796",
        fontSize: 30,
        fontWeight :'normal',
        textAlign: 'center',
        fontFamily: 'Helvetica Neue'
    },
    label: {
        color: "#205796",
        fontSize: 30,
        textAlign: 'center',
        fontFamily: 'Helvetica Neue'
    },
    smallLabel: {
        color: "#205796",
        fontSize: 22,
        textAlign: 'center',
        fontFamily: 'Helvetica Neue'
    },
    description:{
        color: "#205796",
        fontSize: 18,
        fontWeight:"400",
        textAlign: 'center',
        fontFamily: 'Helvetica Neue'
    }


});


export {ComponentStyle,GraphStyle}