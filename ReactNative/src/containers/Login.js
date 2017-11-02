import React, {Component} from 'react'

import {ActivityIndicator, Image, View, StyleSheet} from 'react-native'
import {Button, CheckBox, FormInput, FormLabel, FormValidationMessage} from 'react-native-elements'

import {connect} from "react-redux";
import * as Auth from "../redux/Authentication/Action";
import * as constants from "../constants";
import {shouldRememberLogin} from "../redux/Util/Action";
import {LoadWholeProfile} from "../redux/Profile/Action";


/**
 Login : description
 **/
class Login extends Component {

    constructor(props) {
        super(props);
        let auth = this.props.auth;
        let authCopy = Object.assign({}, auth);
        this.state = {
            auth: authCopy
        };
        this.loginRequest = this.loginRequest.bind(this);
        this.didCheckBox = this.didCheckBox.bind(this);
        this.didChangeText = this.didChangeText.bind(this);
        this.checkFormsAndSubmit = this.checkFormsAndSubmit.bind(this);
    }


    loginRequest(login) {
        this.props.Loading(true, false);
        this.props.UserLoginAction(login.username, login.password, login.tenant).then((loginToken) => {
            this.props.LoadWholeProfile(loginToken, this.props.metadata);
            login["isLoading"] = false;
            this.setState({auth: login});

        }).catch((err)=>{
            login["isLoading"] = false;
            this.setState({auth: login});

        });
        this.setState({auth: login});
    }

    didChangeText(key, text) {
        let {auth} = this.props;
        let copy = Object.assign({}, this.state.auth);
        copy[key] = text;

        this.setState({auth: copy});
    }

    checkFormsAndSubmit() {


        const descriptions = ["username", "password", "tenant"];
        const stateDescriptions = ["usernameError", "passwordError", "tenantError"];
        let strings = [this.state.auth.username, this.state.auth.password, this.state.auth.tenant];
        let emptyCheck = "";
        const emptyString = /^\s+$/i;

        let err = false;
        let login = Object.assign({}, this.state.auth);

        for (let i = 0; i < strings.length; i++) {
            if (strings[i] === "" || emptyString.test(strings[i])) {
                let errorMessage = `Please enter a ${descriptions[i]}`;
                login[stateDescriptions[i]] = errorMessage;
                err = true;
            } else {
                login[stateDescriptions[i]] = "";
            }
        }
        // TODO : more checks


        if (!err) {
            login["isLoading"] = true;
            this.loginRequest(login);
        } else {
            login["isLoading"] = false;
            this.setState({auth: login});
        }


    }

    didCheckBox(state) {
        console.log("Did check box with state " + state);
        this.props.ShouldRememberLogin(state);

    }

    render() {

        return (


            <View style={{paddingTop: 30}}>
                <Image source={require("../../res/ca-technologies-logo.png")}/>
                <View>
                    <ActivityIndicator animating={this.state.auth.isLoading} size={'large'}/>
                    <FormLabel labelStyle={{color: constants.PRIMARY_COLOR_900}}>Username</FormLabel>
                    <FormInput
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        selectionColor={constants.PRIMARY_COLOR_900}
                        inputStyle={{color: constants.PRIMARY_COLOR_900}}
                        onChangeText={(text) => this.didChangeText("username", text)}/>
                    <FormValidationMessage>{this.state.auth.usernameError == "" ? undefined : this.state.auth.usernameError}</FormValidationMessage>
                    <FormLabel labelStyle={{color: constants.PRIMARY_COLOR_900}}>Password</FormLabel>
                    <FormInput
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        inputStyle={{color: constants.PRIMARY_COLOR_900}} secureTextEntry={true}
                        onChangeText={(text) => this.didChangeText("password", text)}/>
                    <FormValidationMessage>{this.state.auth.passwordError == "" ? undefined : this.state.auth.passwordError}</FormValidationMessage>
                    <FormLabel labelStyle={{color: constants.PRIMARY_COLOR_900}}>Tenant</FormLabel>
                    <FormInput
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        inputStyle={{color: constants.PRIMARY_COLOR_900}}
                        onChangeText={(text) => this.didChangeText("tenant", text)}/>
                    <FormValidationMessage>{this.state.auth.tenantError == "" ? undefined : this.state.auth.tenantError}</FormValidationMessage>

                    <CheckBox checked={this.props.util.shouldRemember} title="Remember default login" iconRight
                              containerStyle={{alignItems: 'center', backgroundColor: "#FFFFFF"}}
                              uncheckedColor={constants.PRIMARY_COLOR_800}
                              onPress={() => this.didCheckBox(!this.props.util.shouldRemember)}
                              checkedColor={constants.PRIMARY_COLOR_800}/>
                    <Button raised large title="Login" backgroundColor={constants.PRIMARY_COLOR_800}
                            rightIcon={{name: 'check'}} onPress={() => this.checkFormsAndSubmit()}/>
                    <FormValidationMessage>{this.state.auth.error == null ? undefined : "Failed logging in please try again"}</FormValidationMessage>
                </View>
            </View>


        );
    }


}


const mapDispatchToActions = (dispatch) => ({
    UserLoginAction: (user, password, tenant) => {
        return Auth.userLoginAction(user, password, tenant, dispatch)
    }, // We are not dispatching this, let is control how it wants to be dispatched
    Loading: (status, defaultScreen) => {
        dispatch(Auth.loading(status, defaultScreen))
    },
    LoadWholeProfile :(token,meta) =>{
        LoadWholeProfile(token,meta,dispatch);
    },
    ShouldRememberLogin: (should) => {
        dispatch(shouldRememberLogin(should));
    },

});

export default connect((state) => ({
        auth: state.authentication,
        util: state.util,
        metadata: state.profile.metadata
    }),
    mapDispatchToActions)(Login);