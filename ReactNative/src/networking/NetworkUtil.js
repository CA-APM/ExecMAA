// check https://cloud.ca.com/admin/swagger/#!/custom
// with https://cloud.ca.com/mdo/v2/api-docs
// export const APP_ID          = 'Sugsh04_test';
// export const TENANT_ID       = '029DF253-B671-40F3-BAF0-D7AEB0A9E5FD';

import {UserLogin} from "./UserLogin";
import {getBatchTimeFilter, getTimeFilter} from "../utils/Util";

export const BASE_URL        = 'https://cloud.ca.com';

export const AUTH_URL        = 'https://cloud.ca.com';
export const APPS_URL        = '/mdo/v3/apps';
export const CRASHES_URL     = '/mdo/v3/crashes/crash_summary';
export const USAGE_URL       = '/mdo/v3/usage/users/platform';
export const GEO_URL         = '/mdo/v3/usage/geo';
export const MAUS_URL        = '/mdo/v3/usage/active_users';
export const SESSIONS_URL    = '/mdo/v3/usage/sessions';
export const PERF_URL        = '/mdo/v3/performance/apps';
export const TRANSACTION_URL = '/mdo/v3/transactions';



const HOURS = 60 * 60 * 1000;
const DAYS = 24 * HOURS;
const WEEKS = 7 * DAYS;
const MONTHS = 30 * DAYS;



export const getPreviousAggregation = (agg)=>{

    switch (agg){

        case "hour":{
            return "hour"
        }
        case "day":{
            return "hour"
        }
        case "week":{
            return "day";
        }
        case "month":{
            return "week";
        }
    }
};
export const getFilterParameters =  (meta)=>{
    let toReturn = {
        "aggregation":meta.aggregation,
        "start_date" :meta.timeFilter.jsStartDate.toISOString(),
        "end_date" :meta.timeFilter.jsEndDate.toISOString()
    };
    if(meta.app_id && meta.app_id !== "All" && meta.app_id !== "all apps"){
        toReturn["app_id"] = meta.app_id;
    }
    if(meta.version && meta.version !== "default"){
        toReturn["app_version"] = meta.version;
    }

    return toReturn;
};



export const getQueryString= (obj)=>{
    let start = "/?";
    let initialize = true;
    return Object.keys(obj).reduce((builder,key)=>{
        if(initialize){
            initialize = false;
            return builder + `${key}=${obj[key]}`;
        }else{
            return builder + `&${key}=${obj[key]}`;
        }

    },start);
};

export const getFilterQueryString = (filterParams)=>{
    if(filterParams.app_id){
        return `/?aggregation=${filterParams.aggregation}&start_date=${filterParams.start_date}&end_date=${filterParams.end_date}&app_id=${filterParams.app_id}`;
    }else {
        return `/?aggregation=${filterParams.aggregation}&start_date=${filterParams.start_date}&end_date=${filterParams.end_date}`;
    }
};


