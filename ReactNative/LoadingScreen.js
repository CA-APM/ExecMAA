import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator, Modal, ImageBackground
} from 'react-native';
import Login from "./src/containers/Login";
import {ComponentStyle} from "./src/styles/componentStyle";
import {connect} from 'react-redux'
import * as Auth from "./src/redux/Authentication/Action";
import {getLoginCredentials} from "./src/utils/InfoLogger";
import {DashNavigator} from "./src/containers/containerControllers/DashNavigator";
import {AUTO_LOGIN_INFO, getAutoLogin, getTest} from "./projectTest/isTesting";
import {LoadWholeProfile} from "./src/redux/Profile/Action";
import {HEIGHT, WIDTH} from "./src/constants";

class LoadingScreen extends Component {
    constructor(props) {
        super(props);
        this.tryDefaultLogin = this.tryDefaultLogin.bind(this);
        this.tryDefaultLogin();
    }


    tryDefaultLogin() {


        // it is loading and it is not the default login
        this.props.Loading(true, false);
        getLoginCredentials().then(([username, password, tenant]) => {

            if (getAutoLogin().length > 0) {
                let l1 = getAutoLogin();
                username = l1[0];
                password = l1[1];
                tenant = l1[2];
            }
            if (username === "" || username === null) {
                // not loading transition to default login
                this.props.Loading(false, true);
                return;
            }


            this.props.UserLoginAction(username, password, tenant).then((loginToken) => {
                this.props.LoadWholeProfile(loginToken, this.props.metadata);
            });

        }).catch((err) => {
            console.log(err);
            // not loading transition to default login
            this.props.Loading(false, true);
        });

    }




    /*


     */
    render() {




        if (this.props.auth.appToken ) {
            return DashNavigator();
        } else if (this.props.auth.isLoading && !this.props.auth.defaultLogin) {
            return (
                <View style={ComponentStyle.columnContainer}>

                    <ImageBackground style={{width: WIDTH, height: HEIGHT}}
                                     source={require('./res/splash.png')}
                    >
                        <View style={{flexDirection:'column',flex:1}}>
                            <View style={{flex: 2.5}}/>
                            <View >
                                <ActivityIndicator
                                    animating={true} size="large" color="white"/>
                                <Text style={[ComponentStyle.header, {backgroundColor: "#FFFFFF00"}]}>
                                    {"Loading..."}
                                </Text>
                            </View>

                            <View style={{flex: 1}}/>

                        </View>

                    </ImageBackground>


                </View>);
        } else {
            return (
                <Login/>
            );
        }
    }


}


const mapDispatchToActions = (dispatch) => ({
    UserLoginAction: (user, password, tenant) => {
        return Auth.userLoginAction(user, password, tenant, dispatch)
    }, // We are not dispatching this, let is control how it wants to be dispatched
    Loading: (status, defaultScreen,err=null) => {
        dispatch(Auth.loading(status, defaultScreen,err))
    },
    LoadWholeProfile: (auth, meta) => {
        LoadWholeProfile(auth, meta, dispatch);
    }
});
const mapStateToProps = (state) => {
    return {
        auth: state.authentication,
        metadata: state.profile.metadata
    }
}

export default connect(mapStateToProps, mapDispatchToActions)(LoadingScreen);