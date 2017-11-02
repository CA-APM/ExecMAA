import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator, Modal
} from 'react-native';
import Login from "./src/containers/Login";
import {componentStyle} from "./src/styles/componentStyle";
import {connect} from 'react-redux'
import * as Auth from "./src/redux/Authentication/Action";
import {getLoginCredentials} from "./src/utils/InfoLogger";
import {DashNavigator} from "./src/containers/containerControllers/DashNavigator";
import {AUTO_LOGIN_INFO, getTest} from "./projectTest/isTesting";
import {LoadWholeProfile} from "./src/redux/Profile/Action";

class LoadingScreen extends Component {
    constructor(props) {
        super(props);
        this.tryDefaultLogin = this.tryDefaultLogin.bind(this);
        this.tryDefaultLogin();
    }

    tryDefaultLogin() {
        if(getTest() & AUTO_LOGIN_INFO){
            const username = "set this to a username";
            const password = "set this to a password";
            const tenant = "set this to a tenant";

            this.props.UserLoginAction(username, password, tenant).then((loginToken) => {
                // load alll
                this.props.LoadWholeProfile(loginToken,this.props.metadata);
            })

        }else {
            getLoginCredentials().then(([username, password, tenant]) => {
                if (username === "" || username === null) {
                    this.props.Loading(false, false);
                    return;
                }
                this.props.UserLoginAction(username, password, tenant).then((loginToken) => {
                    this.props.LoadWholeProfile(loginToken,this.props.metadata);
                });

            }).catch((err) => {
                console.log(err);
                this.props.Loading(false, false);
            });
        }
    }
    renderContent() {
        if (this.props.auth.isLoading && this.props.auth.defaultLogin) {
            return (
                <View style={componentStyle.columnContainer}>
                    <ActivityIndicator animating={true} size="large" color="blue"/>
                    <Text>
                        Loading
                    </Text>
                </View>);
        } else if (this.props.auth.appToken && this.props.auth.appTenant) {
            return DashNavigator();
        }else {
            return (
                <Login/>
            );
        }
    }

    render() {
        return (this.renderContent());
    }
}


const mapDispatchToActions = (dispatch) => ({
    UserLoginAction: (user, password, tenant) => {
        return Auth.userLoginAction(user, password, tenant, dispatch)
    }, // We are not dispatching this, let is control how it wants to be dispatched
    Loading: (status, defaultScreen) => {
        dispatch(Auth.loading(status, defaultScreen))
    },
    LoadWholeProfile :(auth,meta) =>{
        LoadWholeProfile(auth,meta,dispatch);
    }
});
const mapStateToProps = (state) => {
    return {
        auth : state.authentication,
        metadata : state.profile.metadata
    }
}

export default connect(mapStateToProps, mapDispatchToActions)(LoadingScreen);