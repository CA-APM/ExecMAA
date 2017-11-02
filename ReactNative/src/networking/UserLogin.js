//https://facebook.github.io/react-native/docs/network.html
import react from 'react'
import {getTest} from "../../projectTest/isTesting";

import * as TestData from '../../projectTest/data'


const URL = 'http://google.com/';


const TOKEN_URL = '/ess/security/v1/token';
const AUTH_URL = 'https://cloud.ca.com';

const BASE_URL = 'https://cloud.ca.com';

const APPS_URL = '/mdo/v3/apps';
const CRASHES_URL = '/mdo/v3/crashes/crash_summary';
const USAGE_URL = '/mdo/v3/usage/users/platform';
const GEO_URL = '/mdo/v3/usage/geo';
const MAUS_URL = '/mdo/v3/usage/active_users';
const SESSIONS_URL = '/mdo/v3/usage/sessions';
const PERF_URL = '/mdo/v3/performance/apps';


// DELETE THIS ON PRODUCTION
// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;


var appToken = null;
var appTenant = null;

const getAuthTokenObject = function () {
    assert(appToken, "Must fetch app token before");
    assert(appTenant, "Must fetch app token before and provide appTenant");
    return {"tkn": appToken, "t": appTenant}
};
const UserLogin = function (user, pass, tenant) {

    if (getTest()) {
        user = TestData.USERNAME;
        pass = TestData.PASSWORD;
        tenant = TestData.TENANT;
    }

    appTenant = tenant;
    var url1 = BASE_URL;
    var tenantbase64 = "Basic " + btoa(tenant);
    var queryString = `grant_type=PASSWORD&username=${user}&password=${pass}`;

    return fetch(url1 + TOKEN_URL, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            "Authorization": tenantbase64
        },
        body: queryString
    })
        .then((response) => {
            if (response.status != 200) {
                return response.json().then((err) => {
                    throw new Error(err.msg);
                }).catch((err) => {
                    throw  err;
                });
            } else {
                return response.json();
            }
        }).then((json) => {
            console.log(json);
            // convert to base64
            appToken = "Bearer " + btoa("{\"tkn\":\"" + json.tkn + "\",\"all\":true}");
            return {"Success": true, token: appToken};
        }).catch((error) => {
            console.log("Error " + error);
            throw new Error({"Success": false});
        });


};


export {UserLogin, getAuthTokenObject}