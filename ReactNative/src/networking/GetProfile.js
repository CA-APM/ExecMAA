import react from 'react'
import {
    getFilterParameters,
    getQueryString
} from "./NetworkUtil";
import {getLogLevel, LOG_NETWORK, LOG_NETWORK_REQUESTS} from "../../projectTest/isTesting";
import {getTimeFilter} from "../utils/Util";

export const BASE_URL = 'https://cloud.ca.com';

const APPS_URL = '/mdo/v3/apps';
const CRASHES_URL = '/mdo/v3/crashes/crash_summary';
const USAGE_BY_PLATFORM_URL = '/mdo/v3/usage/users/platform';
const GEO_URL = '/mdo/v3/usage/geo';
const ACTIVE_USERS_URL = '/mdo/v3/usage/active_users';
const SESSIONS_URL = '/mdo/v3/usage/sessions';
const PERF_URL = '/mdo/v3/performance/apps';
const USERS_URL = '/mdo/v3/usage/users';
const APP_SUMMARY = '/mdo/v3/performance/apps_summary';
const APP_VERSIONS = '/mdo/v3/master_data/versionsByPlatform';

const NETWORK_PREFIX = "<--NETWORKING-->";


/**
 * @fileOverview GetProfile makes the majority of the network data fetch calls
 * and does minor transformations on the data
 */

/**
 *
 * @param {String} nameOfCaller - name of calling function, used for debugging purposes
 * @param {String} authorization - authorization bearer token
 * @param {String} url - the url we are going to fetch
 * @param {Object} meta                 - the current metadata
 * @param {String} meta.aggregation     - the aggregation of the time
 * @param {Object} meta.timeFilter      - the current timeFilter
 * @param {Object} meta.app_id          - the current app
 * @param {Object} meta.version         - the current app version
 * @returns {Promise.<TResult>|*|Promise.<*>}
 */
const getRequest = (nameOfCaller, authorization, url, meta) => {
    let verbose = false;
    let logLevel = getLogLevel();
    // get apps returns a ton of data and image data which is pretty useless when debugging
    // it also drastically slows down the application
    if (logLevel & LOG_NETWORK && nameOfCaller !== "getApps") {
        verbose = true;
    }

    const finalURL = url + (meta !== null ? getQueryString(getFilterParameters(meta)) : "");
    if (verbose || logLevel & LOG_NETWORK_REQUESTS) {
        console.log(`${NETWORK_PREFIX} ${nameOfCaller} sending ${finalURL} meta was ${JSON.stringify(meta)}`);
    }
    return fetch(finalURL, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': authorization,
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    }).then((res) => {
        if (res.status <= 300) {
            if (verbose) {
                return res.json().then((json) => {
                    console.log(`${NETWORK_PREFIX} ${nameOfCaller} got back : ${JSON.stringify(json, null, 2)}`);
                    return json;
                })
            } else {
                return res.json();
            }
        } else {
            let authTokenError = false;
            if (res.status == 401) {
                let json = JSON.parse(res._bodyText);
                if (json.msg === "Request has missing or invalid authorization header" ||
                    json.msg === "Invalid authentication token"||
                    json.msg === "Access denied, inactivity time out.") {
                    authTokenError = true;
                    console.log(`${NETWORK_PREFIX} Authentication timed out resending auth request`);

                }
            }
            // always log network exceptions
            console.log(`${NETWORK_PREFIX} ${nameOfCaller} FAILED receiving : ${JSON.stringify(res, null, 2)}`);

            throw {authTokenError:authTokenError,status:res.status};
        }
    });
}

/**
 * Sends two GET requests to get both the current selected profile data
 * and the previous aggregation of data. EX
 *
 * GET /performance/apps_summary/?start_data=yesterday&end_date=today
 * GET /performance/apps_summary/?start_data=theDayBefore&end_date=yesterday
 *
 *
 * @param theFunction
 * @param authorization
 * @param {Object} meta                 - the current metadata
 * @param {String} meta.aggregation     - the aggregation of the time
 * @param {Object} meta.timeFilter      - the current timeFilter
 * @param {Object} meta.app_id          - the current app
 * @param {Object} meta.version         - the current app version
 * @returns {Promise.<TResult>}
 */
export const getCompareRequest = (theFunction, authorization, meta) => {
    let currentMeta = Object.assign({}, meta);
    currentMeta.timeFilter = getTimeFilter(meta.timeFilter.jsEndDate, meta.aggregation);
    let previousMeta = Object.assign({}, meta);
    previousMeta.timeFilter = getTimeFilter(currentMeta.timeFilter.jsStartDate, meta.aggregation);
    return Promise.all([
        theFunction(authorization, currentMeta),
        theFunction(authorization, previousMeta),
    ]).then((data) => {
        return data;
    });
};

/**
 *
 * @param authorization - the auth token
 * @returns {Promise.<TResult>|*|Promise.<*>}
 */
export const getApps = (authorization) => {
    return getRequest("getApps", authorization, BASE_URL + APPS_URL, null).then((data) => {
        return data.map((item) => {
            return {
                app_id: item.appId,
                appLogo: item.appLogo
            }
        });
    });
};
/**
 * @description Note this will make 1 request per application passed in the authorization
 *
 * @param {String} authorization - auth token
 * @param {[String]} appIDList - the string names of the applications you want to fetch
 * @returns {Promise.<TResult>}
 */
export const getAllAppVersions = (authorization, appIDList) => {
    let promiseList = appIDList.map((app) => {
        return getRequest("getAppVersions", authorization, BASE_URL + APP_VERSIONS + `?app_id=${app}`, null).then((data) => {
            let toReturn =
                {
                    key: app,
                    value: {
                        "iOS": data.iOS ? data.iOS : [],
                        "Android": data.Android ? data.Android : []
                    }
                };
            return toReturn;
        });
    });

    return Promise.all(promiseList).then((data) => {
        let toReturn = {};
        for (let obj of data) {
            toReturn[obj.key] = obj.value;
        }
        return toReturn;
    });


};
/**
 * @description Gets the crash data for a given profile and authorization
 *
 * @param authorization
 * @param {Object} meta                 - the current metadata
 * @param {String} meta.aggregation     - the aggregation of the time
 * @param {Object} meta.timeFilter      - the current timeFilter
 * @param {Object} meta.app_id          - the current app
 * @param {Object} meta.version         - the current app version
 * @returns {Promise.<TResult>}
 */
export const getCrashData = (authorization, meta) => {

    return getRequest("getCrashData", authorization, BASE_URL + CRASHES_URL, meta).then((json) => {
        let toReturn = {crashesByPlatform: [], crashesByDevice: [], crashesByCarrier: []};
        let {platform, device, carrier} = json;
        platform.shift(), device.shift(), carrier.shift();
        platform.forEach((data) => {
            toReturn.crashesByPlatform.push({label: data[0], value: data[1]});
        });
        device.forEach((data) => {
            toReturn.crashesByDevice.push({label: data[0], value: data[1]});
        });
        carrier.forEach((data) => {
            toReturn.crashesByCarrier.push({label: data[0], value: data[1]});
        });
        return toReturn;
    });
};

/**
 *
 * @param authorization
 * @param {Object} meta                 - the current metadata
 * @param {String} meta.aggregation     - the aggregation of the time
 * @param {Object} meta.timeFilter      - the current timeFilter
 * @param {Object} meta.app_id          - the current app
 * @param {Object} meta.version         - the current app version
 * @returns {Promise.<TResult>}
 */
export const getUsersByPlatform = (authorization, meta) => {

    return getRequest("usersByPlatform", authorization, BASE_URL + USAGE_BY_PLATFORM_URL, meta).then((json) => {
        let toReturn = {usersByPlatform: []};
        let {result} = json;
        result.shift();
        result.forEach((data) => {
            toReturn.usersByPlatform.push({label: data[0], value: data[1]});
        });
        return toReturn;
    });

};
/**
 * @description
 *
 * @param authorization
 * @param {Object} meta                 - the current metadata
 * @param {String} meta.aggregation     - the aggregation of the time
 * @param {Object} meta.timeFilter      - the current timeFilter
 * @param {Object} meta.app_id          - the current app
 * @param {Object} meta.version         - the current app version
 * @returns {Promise.<TResult>}
 */
export const getUsersByRegion = (authorization, meta) => {
    return getRequest("getUsersByRegion", authorization, BASE_URL + GEO_URL, meta).then((json) => {
        let toReturn = {data: []};
        let {countries} = json;
        countries.shift();
        countries.forEach((data) => {
            toReturn.data.push({label: data[0], value: data[1]});
        });
        return toReturn;
    });

};
/**
 * @description Will return an object composed of 3 arrays which will contain
 * basic user information.
 *
 * @param authorization
 * @param {Object} meta                 - the current metadata
 * @param {String} meta.aggregation     - the aggregation of the time
 * @param {Object} meta.timeFilter      - the current timeFilter
 * @param {Object} meta.app_id          - the current app
 * @param {Object} meta.version         - the current app version
 * @returns {Promise.<TResult>}
 */
export const getUsers = (authorization, meta) => {
    return getRequest(`getUsers ${meta.aggregation}`, authorization, BASE_URL + USERS_URL, meta).then((json) => {
        let toReturn = {newUsers: [], totalUsers: [], repeatUsers: [], users: 0};
        let {result} = json;
        // from this you can break down into daily and weekly active users
        result.shift();
        result.forEach((data) => {
            toReturn.totalUsers.push({label: data[0], value: data[1]});
            toReturn.newUsers.push({label: data[0], value: data[2]});
            toReturn.repeatUsers.push({label: data[0], value: data[3]});
            toReturn.users += data[1];
        });
        return toReturn;
    });

};

/**
 * @description gets the basic session information such as the sessions by length and by count
 *
 * @param authorization
 * @param meta
 * @returns {Promise.<TResult>}
 */
export const getSessionStats = (authorization, meta) => {
    return getRequest("getSessionStats", authorization, BASE_URL + SESSIONS_URL, meta).then((json) => {
        let toReturn = {sessionsByLength: [], sessionsByCount: []};
        let {result} = json;
        result.shift();
        // from this you can break down into daily and weekly active users
        result.forEach((data) => {
            toReturn.sessionsByLength.push({label: data[0], value: data[1]});
            toReturn.sessionsByCount.push({label: data[0], value: data[2]});
        });
        return toReturn;
    });

};

/**
 * @description returns important performance metrics
 *
 * @param authorization
 * @param {Object} meta                 - the current metadata
 * @param {String} meta.aggregation     - the aggregation of the time
 * @param {Object} meta.timeFilter      - the current timeFilter
 * @param {Object} meta.app_id          - the current app
 * @param {Object} meta.version         - the current app version
 * @returns {Promise.<TResult>}
 */
export const getPerformance = (authorization, meta) => {
    return getRequest("getPerformance", authorization, BASE_URL + PERF_URL, meta).then((json) => {
        let toReturn = {};
        let {averages} = json;
        // from this you can break down into daily and weekly active users
        toReturn.averageRequests = averages.http_request;
        toReturn.averageHTTPErrors = averages.http_request_errors;
        toReturn.averageLatency = averages.avg_latency / 1000;
        toReturn.averageBattery = averages.avg_battery;
        toReturn.averageCPU = averages.avg_cpu;
        toReturn.averageDisk = averages.avg_disk;
        toReturn.averageMem = averages.avg_mem;
        return toReturn;
    });

};

/**
 *
 * @param authorization
 * @param {Object} meta                 - the current metadata
 * @param {String} meta.aggregation     - the aggregation of the time
 * @param {Object} meta.timeFilter      - the current timeFilter
 * @param {Object} meta.app_id          - the current app
 * @param {Object} meta.version         - the current app version
 * @returns {Promise.<TResult>|*|Promise.<*>}
 */
export const getAppSummary = (authorization, meta) => {
    return getRequest("getAppSummary", authorization, BASE_URL + APP_SUMMARY, meta).then((json) => {

        let toReturn = {};
        let {result} = json;
        let keys = result.shift();
        keys.shift();
        for (let key of keys) {
            toReturn[key] = 0;
        }

        for (let info of result) {
            info.shift();
            let curr = 0;
            for (let key of keys) {
                toReturn[key] += info[curr++];
            }
        }
        return toReturn;
    });

};


/**
 *
 * @param authorization
 * @param {Object} meta                 - the current metadata
 * @param {String} meta.aggregation     - the aggregation of the time
 * @param {Object} meta.timeFilter      - the current timeFilter
 * @param {Object} meta.app_id          - the current app
 * @param {Object} meta.version         - the current app version
 * @returns {Promise.<Array.<String>|String>}
 */
export const getSessionList = (authorization, meta) => {
    return getRequest("getSessionList ", authorization, BASE_URL + SESSIONS_URL + "/list", meta).then((json) => {
        let toReturn = {sessionsList: []};
        let {result} = json;
        result.forEach((data) => {
            if (data[0] != "time_unit") {
                toReturn.sessionsList.push({label: data[0], value: data[1]});
            }
        });
        return toReturn;
    });

};

