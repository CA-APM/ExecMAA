/**
 * @description
 *
 * @param meta
 * @returns {{aggregation, start_date: string, end_date: string}}
 */
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


/**
 * @description will return a string that is placed in form of ?key=value&key2=value2...
 *
 * @param obj - an object with key : value pairs
 * @returns {*}
 */
export const getQueryString= (obj)=>{
    let start = "/?";
    let initialize = true;
    let keys = Object.keys(obj);
    if(keys.length == 0){return "";}
    return keys.reduce((builder,key)=>{
        if(initialize){
            initialize = false;
            return builder + `${key}=${obj[key]}`;
        }else{
            return builder + `&${key}=${obj[key]}`;
        }

    },start);
};


