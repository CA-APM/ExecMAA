// This is a file full of useful utility stateless components among other things
import React, {Component} from 'react'
import {View, ActivityIndicator, Text} from 'react-native'
import {DataStatus} from "../../redux/ReduxUtil";
import {Button} from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";

export const LoadView = (props) => {
    return (
        <View style={{width: props.width, height: props.height, alignItems: "center", alignContent: "center"}}>
            <View style={{flex: 1}}/>
            <ActivityIndicator isLoading={true}/>
            <View style={{flex: 1}}/>
        </View>
    )
};

// For some reason I am not getting the children, could this be bcause it is technically not a component?
// and thus wont have children passed?!?!!??!?!
export class LoadRestView extends Component {


    /*

    {metadata, callback,width,height ,props}
     */
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
                <View style={{textAlign:'center',width: width, height: height, alignItems: "center", alignContent: "center"}}>
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