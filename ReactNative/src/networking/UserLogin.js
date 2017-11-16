import react from 'react'
import Base64 from "../utils/Base64";
const TOKEN_URL = '/ess/security/v1/token';
const BASE_URL = 'https://cloud.ca.com';

/**
 * @description sends the login request and fetches and returns a token on success
 *
 * @param {string} user
 * @param {string} pass
 * @param {string} tenant
 * @returns {Promise.<TResult>}
 */
const UserLogin = function (user, pass, tenant) {
    var url1 = BASE_URL;
    var tenantbase64 = "Basic " + Base64.btoa(tenant);
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
            var appToken = "Bearer " + Base64.btoa("{\"tkn\":\"" + json.tkn + "\",\"all\":true}");
            return {"Success": true, token: appToken};
        }).catch((error) => {
            console.log("Error " + error);
            throw new Error({"Success": false});
        });


};


export {UserLogin}