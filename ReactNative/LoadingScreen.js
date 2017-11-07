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

        this.props.Loading(false, false);

        getLoginCredentials().then(([username, password, tenant]) => {

            if (getAutoLogin().length > 0) {
                let l1 = getAutoLogin();
                username = l1[0];
                password = l1[1];
                tenant = l1[2];
            }
            if (username === "" || username === null) {
                this.props.Loading(false, false);
                return;
            }


            this.props.Loading(true, true);
            this.props.UserLoginAction(username, password, tenant).then((loginToken) => {
                this.props.LoadWholeProfile(loginToken, this.props.metadata);
            });

        }).catch((err) => {
            console.log(err);
            this.props.Loading(false, false);
        });

    }

    /*


     */
    render() {





        if (this.props.auth.isLoading && this.props.auth.defaultLogin) {
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
        } else if (this.props.auth.appToken && this.props.auth.appTenant) {
            return DashNavigator();
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
    Loading: (status, defaultScreen) => {
        dispatch(Auth.loading(status, defaultScreen))
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