import * as Util from "../utils/Util";
import {ACTION_TYPES} from "./Profile/Reducer";
import {getCompareRequest} from "../networking/GetProfile";

export const DataStatus = {
    notFetching: "NOT_FETCHING",
    fetching: "FETCHING",
    failed: "FAILED",
    success: "SUCCESS"
};
export const AllApps = "All";
export const Aggregation = {
    hour: "hour",
    day: "day",
    week: "week",
    month: "month"
};
const state = {
    util: {
        shouldRemember: true,
        showConfigPicker: false,
        // We keep a copy of the profile metadata here,
        // because this metadata drives our navigation bar which
        // will eventually drive the profile meta data
        // Users might constantly pick new dates,apps and we do not
        // want to fetch everytime they do so, only upon dismissing the nav bar
        // this is why I have a copy of the metadata
        loadInitialProfile: true,
        profileList: {
            metadata: {status: DataStatus.notFetching},
            data: [
                {
                    app_id: "",
                    image: ""
                }
            ]
        },
        appVersions: {
            metadata: {status: DataStatus.notFetching},
            app_id: {"iOS": ["version1"], "Android": ["version2"]},
            other_app: []
        }


    },
    // I can get rid of everything except for the token
    // need to clean it up
    authentication: {
        username: "",
        password: "",
        tenant: "",
        usernameError: "",
        passwordError: "",
        tenantError: "",
        appToken: null,
        appTenant: null,
        error: null,
        defaultLogin: true, // todo put defaultLogin, error, isloading outside of authentication
        isLoading: true
    },
    profile: {

        metadata: {
            metaChanged: false,
            errorMessage: "",
            aggregation: "month",
            app_id: "All",
            timeFilter: Util.getBatchTimeFilter(new Date(), "month"),
            version : ""

            // this is what the time filter object actually looks like!! :D
            // timeFilter:
            //     starDate: null,
            //     endDate: null,
            //     jsStartDate : null,
            //     jsEndDate : null
            // },
        },


        // data & live data metadata is different than profile and util metadata :{
        data: {
            versions: {
                metadata: {status: DataStatus.notFetching},
                versions: []
            },
            userVisits: {
                metadata: {status: DataStatus.notFetching},
                newUsers: [],
                repeatUsers: [],
                totalUsers: [],
            },
            usersByPlatform: {data: [], metadata: {status: DataStatus.notFetching}},

            usersByCountry: {data: [], metadata: {status: DataStatus.notFetching}},

            crashes: {
                metadata: {status: DataStatus.notFetching},
                crashesByPlatform: [],
                crashesByDevice: [],
                crashesByCarrier: [],
            },

            sessionsStatistics: {
                metadata: {},
                sessionsByLength: [],
                sessionsByCount: [],
            },
            average: {
                metadata: {status: DataStatus.notFetching},
                averageRequests: 0,
                averageHTTPErrors: 0,
                averageLatency: 0,
                averageBattery: 0,
                averageCPU: 0,
                averageDisk: 0,
                averageMem: 0,
            }

        },
        // this will be data that is constantly updated
        compareData: {
            compareSummary: {
                metadata: {status: DataStatus.notFetching},
                data: [
                    // current data
                    {
                        "app_id": 0,
                        "http_request": 0,
                        "http_request_errors": 0,
                        "active_sessions": 0,
                        "active_users": 0,
                        "avg_load_time": 0,
                        "avg_spin": 0,
                        "avg_latency": 0,
                        "avg_data_in": 0,
                        "avg_data_out": 0,
                        "avg_disk": 0,
                        "avg_mem": 0,
                        "avg_cpu": 0,
                        "avg_frame_rate": 0,
                        "crashes": 0,
                        "errors": 0,
                        "exceptions": 0,
                        "session_length": 0,
                        "session_counter": 0,
                        "arr_session_counter": 0,
                        "avg_battery": 0,
                    },
                    // previous
                    {
                        "app_id": 0,
                        "http_request": 0,
                        "http_request_errors": 0,
                        "active_sessions": 0,
                        "active_users": 0,
                        "avg_load_time": 0,
                        "avg_spin": 0,
                        "avg_latency": 0,
                        "avg_data_in": 0,
                        "avg_data_out": 0,
                        "avg_disk": 0,
                        "avg_mem": 0,
                        "avg_cpu": 0,
                        "avg_frame_rate": 0,
                        "crashes": 0,
                        "errors": 0,
                        "exceptions": 0,
                        "session_length": 0,
                        "session_counter": 0,
                        "arr_session_counter": 0,
                        "avg_battery": 0,
                    },

                ]

            }

        }
    }

}
export let InitialState = (key) => {
    return state[key]
};


export const CopyAndOverrideKey = (oldObj, toObject, keyList) => {
    let obj = Object.assign({}, oldObj);
    let currValue = obj;
    for (let i = 0; i < keyList.length - 1; i++) {
        currValue = currValue[keyList[i]];
    }
    currValue[keyList[keyList.length - 1]] = toObject;
    return obj;
};

/**
 * @description Indicates this data is being fetched
 *
 * @param keyList Array<String> : specifies the keys in which to update ex Object.key0.key1.key2.key3 and so on
 * @param data the data in which Object.key0.key1... will be set to
 * @param type The type will help indicate which reducer should recieve this action
 * @returns {{type: string, payload: *, keyList: *, debug: string}}
 */
export const fetchingDataFor = (keyList, type = ACTION_TYPES.CHANGE_DATA) => {
    return {
        type: type,
        payload: {metadata: {status: DataStatus.fetching}},
        keyList: keyList,
        debug: `${keyList[keyList.length - 1]} is going to fetch data`
    }

};
/**
 * @description Indicates a failured in attempt to change Object.key0.key1....
 *
 * @param keyList Array<String> : specifies the keys in which to update ex Object.key0.key1.key2.key3 and so on
 * @param data the data in which Object.key0.key1... will be set to
 * @param type The type will help indicate which reducer should recieve this action
 * @returns {{type: string, payload: *, keyList: *, debug: string}}
 */
export const failedFetchingDataFor = (keyList, error, type = ACTION_TYPES.CHANGE_DATA) => {
    return {
        type: type,
        payload: {metadata: {status: DataStatus.failed, error: error}},
        keyList: keyList,
        debug: `${keyList[keyList.length - 1]} failed fetching the data`
    }

};
/**
 * @description Indicates a successful change of data
 *
 * @param keyList Array<String> : specifies the keys in which to update ex Object.key0.key1.key2.key3 and so on
 * @param data the data in which Object.key0.key1... will be set to
 * @param type The type will help indicate which reducer should recieve this action
 * @returns {{type: string, payload: *, keyList: *, debug: string}}
 */
export const succeededFetchingDataFor = (keyList, data, type = ACTION_TYPES.CHANGE_DATA) => {

    data["metadata"] = {status: DataStatus.success};
    return {
        type: type,
        payload: data,
        keyList: keyList,
        debug: `${keyList[keyList.length - 1]} succeeded fetching data`
    }

};
/**
 * Makes a network request and updates the data store
 * States : not loading, loading, success,failure
 *
 * @param keyList Array<String> : specifies the keys in which to update ex profile.key0.key1.key2.key3 and so on
 * @param auth The authorization token
 * @param meta The metadata which will have aggregation and time info
 * @param request the actual request to be called
 * @param dispatch
 */
export const updateData = (keyList, auth, meta, request, dispatch) => {
    dispatch(fetchingDataFor(keyList));
    return request(auth, meta).then((data) => {
        dispatch(succeededFetchingDataFor(keyList, data));
        return data;
    }).catch((err) => {
        dispatch(failedFetchingDataFor(keyList, err));
        return err;
    });

};
/**
 * Makes a network request and updates the data store
 * States : not loading, loading, success,failure
 *
 * @note This is different than above as it calls getCompareRequest() which combines two network calls into one operation
 *
 * @param keyList Array<String> : specifies the keys in which to update ex profile.key0.key1.key2.key3 and so on
 * @param auth The authorization token
 * @param meta The metadata which will have aggregation and time info
 * @param request the actual request to be called
 * @param dispatch
 */
export const updateCompareData = (keyList, auth, meta, request, dispatch) => {
    dispatch(fetchingDataFor(keyList));

    return getCompareRequest(request, auth, meta)
        .then((data) => {
            dispatch(succeededFetchingDataFor(keyList, {data: data}));
            return data;
        }).catch((err) => {
            dispatch(failedFetchingDataFor(keyList, err));
            return err;
        });

};



