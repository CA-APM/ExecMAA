// This is a file full of useful utility stateless components among other things
import React, {Component} from 'react'
import {View, ActivityIndicator, Text} from 'react-native'
import {DataStatus} from "../../redux/ReduxUtil";
import {Button} from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";



/**
 * This view displays an activity indicator while we are fetching
 * it will reveal the contents of its children upon the meta data being successfully
 * fetched
 */
export class LoadRestView extends Component {

    render() {
        let {metadata,height,width,children,callback} = this.props;
        let err = metadata.err ? metadata.err : metadata.error;
        let status = metadata.status;
        if (status === DataStatus.notFetching) {
            return (
                <View style={{width: width, height: height, alignItems: "center", alignContent: "center"}}>
                    <View style={{flex: 1}}/>
                    <Text>{"Unable to load, please refresh"}</Text>
                    <View style={{flex: 1}}/>
                </View>
            )
        } else if (status === DataStatus.fetching) {
            return (
                <View style={{width: width, height: height, alignItems: "center", alignContent: "center"}}>
                    <View style={{flex: 1}}/>
                    <Spinner visible={true} textContent={"Loading..."} textStyle={{color: '#FFF'}}/>
                    <View style={{flex: 1}}/>
                </View>
            )
        } else if (status === DataStatus.failed) {
            return (
                <View style={{width: width, height: height, alignItems: "center", alignContent: "center"}}>
                    <View style={{flex: 1}}/>
                    <Text style={{textAlign:'center'}}>
                        {`There was an error loading this data`}
                    </Text>
                    <View style={{flex: 1}}/>
                </View>
            )
        } else {
            // success!
            return children;
        }

    }
}