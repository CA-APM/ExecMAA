import react from 'react'
import {
    getFilterParameters, getPreviousTimeMeta, getFilterQueryString, getPreviousAggregation,
    getQueryString
} from "./NetworkUtil";
import {getLogLevel, LOG_NETWORK} from "../../projectTest/isTesting";
import {AllApps, DataStatus} from "../redux/ReduxUtil";
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
const getRequest = (nameOfCaller, authorization, url, meta) => {
    let verbose = false;
    // get apps returns a ton of data i do not use
    if (getLogLevel() & LOG_NETWORK && nameOfCaller !== "getApps") {
        verbose = true;
    }

    const finalURL = url + (meta !== null ? getQueryString(getFilterParameters(meta)) : "");
    if (verbose) {
        console.log(`${NETWORK_PREFIX} ${nameOfCaller} sending ${finalURL}`);
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
            if (res.status == 401) {
                let json = JSON.parse(res._bodyText);
                if (json.msg === "Invalid authentication token") {
                    console.log(`${NETWORK_PREFIX} Bad user token!!`);
                }
            }
            if (verbose) {
                console.log(`${NETWORK_PREFIX} ${nameOfCaller} FAILED receiving : ${JSON.stringify(res, null, 2)}`);
            }
            throw Error(` ${nameOfCaller} Got status : ${res.status} `);
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
 * @param meta
 * @returns {Promise.<TResult>}
 *
 *   [theFunction(currentMeta).json,theFunction(previousMeta).json]
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
 * @param authorization
 * @returns {Promise.<TResult>|*|Promise.<*>}
 */
export const getApps = (authorization) => {
    return getRequest("getApps", authorization, BASE_URL + APPS_URL, null).then((data) => {
        return data.map((item) => {
            return {
                app_id: item.appId,
                appLogo : item.appLogo
            }
        });
    });
};

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

export const getUsersByRegion = (authorization, meta) => {
    return getRequest("getUsersByRegion", authorization, BASE_URL + GEO_URL, meta).then((json) => {
        let toReturn = {usersByCountry: []};
        let {countries} = json;
        countries.shift();
        countries.forEach((data) => {
            toReturn.usersByCountry.push({label: data[0], value: data[1]});
        });
        return toReturn;
    });

};

// This only returns monthly active users
export const getActiveUsers = (authorization, meta) => {
    // Before you uncomment this function you must change the Data model to have a property
    // like maus... or whatever the returned object is
    // return getRequest("getActiveUsers", authorization, BASE_URL + ACTIVE_USERS_URL, meta).then((json) => {
    //     let toReturn = {maus: []};
    //     let {monthly_active_users} = json;
    //     // from this you can break down into daily and weekly active users
    //     monthly_active_users.forEach((data) => {
    //         if (data[0] != "time_unit") { // why this check? I am guessing the first item is platform 0 :D
    //             toReturn.maus.push({label: data[0], value: data[1]});
    //         }
    //     });
    //     return toReturn;
    // });
};
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
 * @param meta
 * @returns {Promise.<TResult>|*|Promise.<*>}
 *{
    "app_id" : 0,
    "http_request" : 0,
    "http_request_errors" : 0,
    "active_sessions" : 0,
    "active_users" : 0,
    "avg_load_time" : 0,
    "avg_spin" : 0,
    "avg_latency" : 0,
    "avg_data_in" : 0,
    "avg_data_out" : 0,
    "avg_disk" : 0,
    "avg_mem" : 0,
    "avg_cpu" : 0,
    "avg_frame_rate" : 0,
    "crashes" : 0,
    "errors" : 0,
    "exceptions" : 0,
    "session_length" : 0,
    "session_counter" : 0,
    "arr_session_counter" : 0,
    "avg_battery" : 0,
 },
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
 * TODO : Test
 *
 * @param authorization
 * @param meta
 * @returns {Promise.<Array.<String>|String>}
 */
export const getSessionList = (authorization, meta) => {
    return getRequest("getSessionList ", authorization, BASE_URL + SESSIONS_URL + "/list", meta).then((json) => {
        let toReturn = {sessionsList: []};
        let {result} = json;
        // from this you can break down into daily and weekly active users
        result.forEach((data) => {
            if (data[0] != "time_unit") { // why this check? I am guessing the first item is platform 0 :D
                toReturn.sessionsList.push({label: data[0], value: data[1]});
            }
        });
        return toReturn;
    });

};

