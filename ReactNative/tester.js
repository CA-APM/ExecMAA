import {UserLogin} from "./src/networking/UserLogin";
import {
    getActiveUsers, getAllAppVersions, getApps, getAppSummary, getAppVersions, getCompareRequest, getCrashData,
    getPerformance,
    getSessionStats, getUsers,
    getUsersByPlatform,
    getUsersByRegion
} from "./src/networking/GetProfile";
import * as Util from "./src/utils/Util";
import {getFilterParameters} from "./src/networking/NetworkUtil";
import {getBatchTimeFilter} from "./src/utils/Util";
import {AllApps} from "./src/redux/ReduxUtil";

let dateRange = Util.getBatchTimeFilter(new Date(), "month");
let global_token = "";
const DEFAULT_PROFILE = "Wicked Tuna";
const allID = AllApps;
export const loadToken = (username,tenant,password) => {
    return UserLogin(username,  password,tenant).then((token) => {
        if (global_token == "") {
            global_token = token.token;
        }
    });
}
export const testGetApps = () => {
    return getApps(global_token)
        .then((apps) => {
            console.log(apps);
            getAllAppVersions(global_token,apps).then((data)=>{
                console.log(`Success getting all app versions ${data}`);

            }).catch((err)=>{
                console.log(`Error getting all app versions ${err}`);
            })

        }).catch((err) => {
            console.log(`t1 failed with error ${err}`);
        });
};

export const testCompareSummary = (profile = DEFAULT_PROFILE,timeFilter = "week") => {
    let filter = getBatchTimeFilter(new Date(), timeFilter);
    let meta = {
        aggregation: timeFilter,
        timeFilter :filter,
        app_id: profile
    };
    getCompareRequest(getAppSummary,global_token,meta).then((data)=>{
        console.log(`Success getting summary compare data for ${profile} : ${data}`);
    }).catch((err)=>{
        console.log(`Failed getting summary compare data for ${profile}`);
        console.log(err);
    });
};


export const testCrashes = (profile = DEFAULT_PROFILE, timeFilter = "month") => {

    let filter = getBatchTimeFilter(new Date(), timeFilter);
    let meta = {
        aggregation: timeFilter,
        timeFilter :filter,
        app_id: profile
    };
    getCrashData(global_token, meta).
    then((result) => {
        console.log(`Success getting crash data for ${profile}`);
        console.log(result);
    }).catch((err) => {
        console.log("Error getting crash data " + err);
    });
     meta = {
        aggregation: timeFilter,
        timeFilter :filter,
        app_id: AllApps
    };
    getCrashData(global_token, meta).
    then((result) => {
        console.log(`Success getting crash data for ${AllApps}`);
        console.log(result);
    }).catch((err) => {
        console.log("Error getting crash data " + err);
    });
};

export const testUsersByPlatform = (profile = DEFAULT_PROFILE, timeFilter = "month") => {

    let filter = getBatchTimeFilter(new Date(), timeFilter);
    let meta = {
        aggregation: timeFilter,
        timeFilter :filter,
        app_id: profile
    };
    getUsersByPlatform(global_token, meta).
    then((result) => {
        console.log(`Success getting platform data for ${profile}`);
        console.log(result);
    }).catch((err) => {
        console.log("Error getting platform data " + err);
    });

     meta = {
        aggregation: timeFilter,
        timeFilter :filter,
        app_id: AllApps
    };
    getUsersByPlatform(global_token, meta).
    then((result) => {
        console.log(`Success getting platform data`);
        console.log(result);
    }).catch((err) => {
        console.log("Error getting platform data + " + AllApps + err);
    });
};
export const testUsersByRegion= (profile = DEFAULT_PROFILE, timeFilter = "month") => {

    let filter = getBatchTimeFilter(new Date(), timeFilter);
    let meta = {
        aggregation: timeFilter,
        timeFilter :filter,
        app_id: profile
    };
    getUsersByRegion(global_token, meta).
    then((result) => {
        console.log(`Success getting Users by region for ${profile}`);
        console.log(result);
    }).catch((err) => {
        console.log("Error getting users by region" + err);
    });

     meta = {
        aggregation: timeFilter,
        timeFilter :filter,
        app_id: AllApps
    };
    getUsersByRegion(global_token, meta).
    then((result) => {
        console.log(`Success getting Users by region for ${AllApps}`);
        console.log(result);
    }).catch((err) => {
        console.log("Error getting users by region" + err);
    });
};
// export const testActiveUsers = (profile = DEFAULT_PROFILE, timeFilter = "month") => {
//
//     let filter = getBatchTimeFilter(new Date(), timeFilter);
//     let meta = {
//         aggregation: timeFilter,
//         timeFilter :filter,
//         app_id: profile
//     };
//     getActiveUsers(global_token, meta).
//     then((result) => {
//         console.log(`Success getting getActiveUsers`);
//         console.log(result);
//     }).catch((err) => {
//         console.log("Error getting getActiveUsers " + err);
//     });
// };
export const testUsers = (profile = DEFAULT_PROFILE) => {

    let times = ["hour","day","week","month"];
    for(let time of times){
        let filter = getBatchTimeFilter(new Date(), time);
        let meta = {
            aggregation: time,
            timeFilter :filter,
            app_id: profile
        };
        getUsers(global_token, meta).
        then((result) => {
            console.log(`Success getting ${time} users for ${profile}`);
            console.log(result);
        }).catch((err) => {
            console.log(`Error getting ${time} users : ${err}`);
        });
         meta = {
            aggregation: time,
            timeFilter :filter,
            app_id: AllApps
        };
        getUsers(global_token, meta).
        then((result) => {
            console.log(`Success getting ${time} users for ${AllApps}`);
            console.log(result);
        }).catch((err) => {
            console.log(`Error getting ${time} users : ${err}`);
        });

    }


};
export const testGetSessions= (profile = DEFAULT_PROFILE, timeFilter = "month") => {

    let filter = getBatchTimeFilter(new Date(), timeFilter);
    let meta = {
        aggregation: timeFilter,
        timeFilter :filter,
        app_id: profile
    };
    getSessionStats(global_token, meta).
    then((result) => {
        console.log(`Success getting sessions for ${profile}`);
        console.log(result);
    }).catch((err) => {
        console.log("Error getting sessions" + err);
    });
     meta = {
        aggregation: timeFilter,
        timeFilter :filter,
        app_id: AllApps
    };
    getSessionStats(global_token, meta).
    then((result) => {
        console.log(`Success getting sessions for ${AllApps}`);
        console.log(result);
    }).catch((err) => {
        console.log("Error getting sessions" + err);
    });
};
export const testPerformance = (profile = DEFAULT_PROFILE, timeFilter = "month") =>{
    let filter = getBatchTimeFilter(new Date(), timeFilter);
    let meta = {
        aggregation: timeFilter,
        timeFilter :filter,
        app_id: profile
    };
    getPerformance(global_token, meta).
    then((result) => {
        console.log(`Success getting performance for ${profile}`);
        console.log(result);
    }).catch((err) => {
        console.log("Error getting performance" + err);
    });

    meta = {
        aggregation: timeFilter,
        timeFilter :filter,
        app_id: AllApps
    };
    getPerformance(global_token, meta).
    then((result) => {
        console.log(`Success getting performance for ${AllApps}`);
        console.log(result);
    }).catch((err) => {
        console.log("Error getting performance" + err);
    });


};
export const testGetAppSummary = (profile = DEFAULT_PROFILE, timeFilter = "month") =>{
    let filter = getBatchTimeFilter(new Date(), timeFilter);
    let meta = {
        aggregation: timeFilter,
        timeFilter :filter,
        app_id: profile
    };
    getAppSummary(global_token, meta).
    then((result) => {
        console.log(`Success getting ${profile} summary`);
        console.log(result);
    }).catch((err) => {
        console.log(`Error getting ${profile} performance ${err}`);
    });

    meta = {
        aggregation: timeFilter,
        timeFilter :filter,
        app_id: AllApps
    };
    getAppSummary(global_token, meta).
    then((result) => {
        console.log(`Success getting all summary for ${AllApps}`);
        console.log(result);
    }).catch((err) => {
        console.log("Error getting performance" + err);
    });

};

export const testAppVersions = () =>{
    getAppVersions(global_token,"1ravi_aug26").then((info)=>{
        console.log(`Success getting ${info} summary`);
    });
    getAppVersions(global_token,"1MANOJ_SEP25").then((info)=>{
        console.log(`Success getting ${info} summary`);
    });

}


export const test = () => {


    testTransactions().then((data) => {
        data.forEach((d, index) => {
            if (d.status != 200) {
                console.log(`Error getting transaction at index : ${index}`);
            } else {
                d.json().then((theJson) => {
                    console.log(theJson);
                });
            }
        });
    });
    getAll().then((data) => {

        console.log("Success : " + data);
        data.forEach((d) => {
            console.log(d);
            if (d.status != 200) {
                console.log("failed");
            } else {
                d.json().then((data) => {
                    console.log(data);
                })
            }
        });
    }).catch((error) => {
        console.log("Error: " + error);
    });
}


