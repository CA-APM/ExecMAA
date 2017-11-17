import React from 'react'
import {AsyncStorage} from 'react-native'

const USER_KEY = "USERNAME";
const PASSWORD_KEY = "PASSWORD";
var TENANT_KEY = "TENANT";
// todo : Some type of encryption

const errMessage = (errMessage) => {
    if (errMessage) {
        return {success: false, message: errMessage};
    } else {
        return {success: true};
    }
}

const setCredentials = function (username, password, tenant) {
    return new Promise((success, failure) => {

        Promise.all([
            AsyncStorage.setItem(USER_KEY, username),
            AsyncStorage.setItem(PASSWORD_KEY, password),
            AsyncStorage.setItem(TENANT_KEY, tenant)
        ]).then(()=>{
            success(errMessage());

        }).catch(()=>{
            AsyncStorage.setItem(USER_KEY, "");
            AsyncStorage.setItem(PASSWORD_KEY, "");
            AsyncStorage.setItem(TENANT_KEY, "");
            failure(errMessage("failed to set username and password"));
        })
    });
};

const getLoginCredentials = function () {
    return new Promise.all([
        AsyncStorage.getItem(USER_KEY),
        AsyncStorage.getItem(PASSWORD_KEY),
        AsyncStorage.getItem(TENANT_KEY)
    ]);
};


export {setCredentials, getLoginCredentials};