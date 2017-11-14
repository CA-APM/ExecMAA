import React, {Component} from 'react'

import {Image,View, StyleSheet, TouchableHighlight} from 'react-native'
import {Button, CheckBox, FormInput, FormLabel, FormValidationMessage} from 'react-native-elements'

import {connect} from "react-redux";
import * as Auth from "../redux/Authentication/Action";
import * as constants from "../constants";
import {LoadWholeProfile} from "../redux/Profile/Action";
import {HEIGHT} from "../constants";
import {ComponentStyle} from "../styles/componentStyle";
import {WIDTH} from "../constants";
import {logoutAndReset} from "../redux/Authentication/Action";
import {setCredentials} from "../utils/InfoLogger";
import {handledLoginError} from "../redux/Authentication/Action";
import Spinner from "react-native-loading-spinner-overlay";


/**
 * @description The Login container is responsible for the logic and presentation views
 * that go into making the Login responsible
 */
class Login extends Component {

    constructor(props) {
        super(props);
        this.inputs = [];
        let auth = props.auth;
        let authCopy = Object.assign({}, auth);
        this.state = {
            failedLoading: authCopy.error != null,
            auth: authCopy,
            rememberLogin: true
        };

        this.loginRequest = this.loginRequest.bind(this);
        this.didCheckBox = this.didCheckBox.bind(this);
        this.didChangeText = this.didChangeText.bind(this);
        this.checkFormsAndSubmit = this.checkFormsAndSubmit.bind(this);
        this.renderErrorView = this.renderErrorView.bind(this);
        this.resetFields = this.resetFields.bind(this);
        this.renderActivityIndicator = this.renderActivityIndicator.bind(this);
    }

    /**
     * @description creates a copy of the authentication object and computes
     * whether the a failed login occured or not
     *
     * @param props passed in from super view
     */
    componentWillReceiveProps(props) {
        let auth = props.auth;
        let authCopy = Object.assign({}, auth);
        let failed = true;
        this.setState({
            failedLoading: authCopy.error != null,
            auth: authCopy,
            rememberLogin: true
        })
    }


    loginRequest(login) {
        let saveLogin = this.state.rememberLogin;
        this.props.UserLoginAction(login.username, login.password, login.tenant,true).then((loginToken) => {
            this.props.LoadWholeProfile(loginToken, this.props.metadata,login.username,login.password,login.tenant);
            if (saveLogin) {
                // Save credentials to disk
                setCredentials(login.username, login.password, login.tenant);
            }else{
                // Do not save and remove old credentials if they were there
                setCredentials("", "", "");
            }
        }).catch((err) => {
            // catch error, don't report however
        });

    }

    /**
     * @description When a text field is changed it calls the function with
     * the corresponding key and value(text)
     *
     * @param {String} key
     * @param {String} text
     */
    didChangeText(key, text) {
        let {auth} = this.props;
        let copy = Object.assign({}, this.state.auth);
        copy[key] = text;

        this.setState({auth: copy});
    }

    /**
     * @description Checks the validity of the 3 fields before sending a request
     * upond failing it will set the state with the appropriate error messages, for example
     * if you fail to type a password
     */
    checkFormsAndSubmit() {
        const descriptions = ["username", "password", "tenant"];
        const stateDescriptions = ["usernameError", "passwordError", "tenantError"];
        let strings = [this.state.auth.username, this.state.auth.password, this.state.auth.tenant];
        let emptyCheck = "";
        const emptyString = /^\s+$/i;

        let err = false;
        let login = Object.assign({}, this.state.auth);

        for (let i = 0; i < strings.length; i++) {
            if (strings[i] == null || strings[i] === "" || emptyString.test(strings[i])) {
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

    /**
     * @description Whether or not to save the login information
     * @param state
     */
    didCheckBox(state) {
        this.setState({
            rememberLogin: !this.state.rememberLogin
        });

    }

    /**
     * @description This is called after we have handled a login failure in order
     * to reset the redux state
     */
    resetFields() {
        this.props.handledError();
    }

    /**
     * @description Renders an error view if we failed to load  the login information
     * else returns undefined(no view)
     *
     * @returns {*}
     */
    renderErrorView() {
        if (this.state.failedLoading) {
            return <View style={{position: 'absolute', width: WIDTH, height: HEIGHT, backgroundColor: "#f0f0f0AA"}}>
                <View style={{flex: 1}}>
                    <View style={{flex: 1}}/>
                    <Button buttonStyle={{
                        borderRadius: 10,
                        backgroundColor: "#FFFFFF",
                        borderWidth: 3,
                        borderColor: "#205796"
                    }}
                            title="Failed logging in, please try again"
                            textStyle={[ComponentStyle.label, {fontSize: 18}]}
                            onPress={() => {
                                this.resetFields();
                            }}></Button>
                    <View style={{flex: 1}}/>
                </View>
                <TouchableHighlight underlayColor="#00000000"
                                    style={{position: 'absolute', width: WIDTH, height: HEIGHT}} onPress={() => {
                    this.resetFields()
                }}>
                    <View></View>
                </TouchableHighlight>
            </View>
        } else {
            return undefined;
        }

    }

    renderActivityIndicator() {
        if (this.props.auth.isLoading) {

            return (
                <Spinner visible={true} textContent={"Loading..."} textStyle={{color: '#FFF'}}/>
            );
        } else {
            return undefined;
        }

    }

    render() {

        return (


            <View style={{paddingTop: 30, flex: 1}}>


                <Image

                    resizeMode='contain'
                    style={{height: 150, marginTop: -25, alignSelf: 'center'}}
                    source={require("../../res/ca-technologies-logo.png")}/>
                <View style={{marginTop: -40}}>
                    {this.renderActivityIndicator()}

                    <FormLabel
                        labelStyle={[ComponentStyle.smallLabel, {fontSize: 20, textAlign: 'left'}]}>Username</FormLabel>
                    <FormInput
                        ref={input => this.inputs.push(input)}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        selectionColor={constants.PRIMARY_COLOR_900}
                        inputStyle={{color: constants.PRIMARY_COLOR_900}}
                        onChangeText={(text) => this.didChangeText("username", text)}/>
                    <FormValidationMessage>{this.state.auth.usernameError == "" ? undefined : this.state.auth.usernameError}</FormValidationMessage>
                    <FormLabel
                        labelStyle={[ComponentStyle.smallLabel, {fontSize: 20, textAlign: 'left'}]}>Password</FormLabel>
                    <FormInput
                        ref={input => this.inputs.push(input)}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        inputStyle={{color: constants.PRIMARY_COLOR_900}} secureTextEntry={true}
                        onChangeText={(text) => this.didChangeText("password", text)}/>
                    <FormValidationMessage>{this.state.auth.passwordError == "" ? undefined : this.state.auth.passwordError}</FormValidationMessage>
                    <FormLabel
                        labelStyle={[ComponentStyle.smallLabel, {fontSize: 20, textAlign: 'left'}]}>Tenant</FormLabel>
                    <FormInput
                        ref={input => this.inputs.push(input)}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        inputStyle={{color: constants.PRIMARY_COLOR_900}}
                        onChangeText={(text) => this.didChangeText("tenant", text)}/>
                    <FormValidationMessage>{this.state.auth.tenantError == "" ? undefined : this.state.auth.tenantError}</FormValidationMessage>

                    <CheckBox
                        checked={this.state.rememberLogin} title="Remember default login" iconRight
                        containerStyle={{alignItems: 'center', backgroundColor: "#FFFFFF"}}
                        uncheckedColor={constants.PRIMARY_COLOR_800}
                        onPress={() => this.didCheckBox()}
                        checkedColor={constants.PRIMARY_COLOR_800}/>
                    <Button raised large title="Login" backgroundColor={constants.PRIMARY_COLOR_800}
                            rightIcon={{name: 'check'}} onPress={() => this.checkFormsAndSubmit()}/>
                </View>


                {this.renderErrorView()}

            </View>


        );
    }


}


const mapDispatchToActions = (dispatch) => ({
    UserLoginAction: (user, password, tenant,defaultScreen) => {
        return Auth.userLoginAction(user, password, tenant, dispatch,defaultScreen)
    }, // We are not dispatching this, let is control how it wants to be dispatched
    LoadWholeProfile: (token, meta,uname,password,tenant) => {
        LoadWholeProfile(token, meta, dispatch,true,uname,password,tenant);
    },
    resetAuth: () => {
        dispatch(logoutAndReset());
    },
    handledError:()=>{
        dispatch(handledLoginError())
    }

});

export default connect((state) => ({
        auth: state.authentication,
        util: state.util,
        metadata: state.profile.metadata
    }),
    mapDispatchToActions)(Login);