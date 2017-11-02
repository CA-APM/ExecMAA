import {UserLogin} from "./src/networking/UserLogin";
import {
    getActiveUsers, getApps, getAppSummary, getCompareRequest, getCrashData, getPerformance, getSessionStats, getUsers,
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
    return UserLogin(username, tenant, password).then((token) => {
        if (global_token == "") {
            global_token = token.token;
        }
    });
}
export const testGetApps = () => {
    return getApps(global_token)
        .then((apps) => {
            console.log(apps);
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


export const fakeLiveData = {
    day: {

        current: {
            users: 2212 + Math.random() * 140,
            sessions: 554 + Math.random() * 55,
            crashes: 54 + Math.random() * 6,
            requests: 4431 + Math.random() * 700
        },
        past: {
            users: 1992 + Math.random() * 140,
            sessions: 662+ Math.random() * 55,
            crashes: 54 + Math.random() * 6,
            requests: 4431 + Math.random() * 700
        }
    },
    week: {
        current: {
            users: 22212 + Math.random() * 1440,
            sessions: 5534 + Math.random() * 553,
            crashes: 544 + Math.random() * 62,
            requests: 44131 + Math.random() * 7010
        },
        past: {
            users: 22252 + Math.random() * 1440,
            sessions: 5634 + Math.random() * 553,
            crashes: 594 + Math.random() * 62,
            requests: 41131 + Math.random() * 7010
        }
    },
    month: {
        current: {
            users: 52212 + Math.random() * 14401,
            sessions: 415534 + Math.random() * 53253,
            crashes: 1544 + Math.random() * 432,
            requests: 123443+ Math.random() * 7010
        },
        past: {
            users: 52212 + Math.random() * 14401,
            sessions: 415534 + Math.random() * 53253,
            crashes: 1544 + Math.random() * 432,
            requests: 123443+ Math.random() * 7010
        }
    },
    year: {
        current: {
            users: 152212 + Math.random() * 144301,
            sessions: 5415534 + Math.random() * 532531,
            crashes: 11544 + Math.random() * 4322,
            requests: 98123443+ Math.random() * 424322
        },
        past: {
            users: 152212 + Math.random() * 144301,
            sessions: 5415534 + Math.random() * 532531,
            crashes: 11544 + Math.random() * 4322,
            requests: 98123443+ Math.random() * 424322
        }
    }
};
export const fakeData= {
    day: {
        usersByTime: [
            {value: 37, label: 'Sunday'},
            {value: 41, label: 'Monday'},
            {value: 38, label: 'Tuesday'},
            {value: 47, label: 'Wednesday'},
            {value: 59, label: 'Thursday'},
            {value: 70, label: 'Friday'},
            {value: 49, label: 'Saturday'},

        ],

        crashesByPlatform: [
            {value: 15, label: "Android"},
            {value: 16, label: "OS X"},

        ],
        usersByPlatform: [
            {value: 233, label: "iOS"},
        ],
        usersByCarrier: [
            {value: 222, label: "WI-FI"},
            {value: 23, label: "AT&T"},
        ]
    },
    week: {
        usersByTime: [
            {value: 141, label: 'Feb-14'},
            {value: 341, label: 'Feb-21'},
            {value: 241, label: 'Feb-28'},
            {value: 341, label: 'March-05'}

        ],

        crashesByPlatform: [
            {value: 26, label: "iOS"},
            {value: 15, label: "Android"},
            {value: 16, label: "OS X"},

        ],
        usersByPlatform: [
            {value: 233, label: "iOS"},
            {value: 321, label: "Android"}
        ],
        usersByCarrier: [
            {value: 222, label: "WI-FI"},
            {value: 23, label: "AT&T"},
        ]

    },
    month: {
        usersByTime: [
            {value: 1402, label: 'January'},
            {value: 1221, label: 'February'},
            {value: 1111, label: 'March'},
            {value: 1422, label: 'April'},
            {value: 1452, label: 'May'},
            {value: 1232, label: 'June'},
            {value: 2122, label: 'July'},
            {value: 2311, label: 'Auguest'},
            {value: 2442, label: 'September'},
            {value: 2552, label: 'October'},
            {value: 2612, label: 'November'},
            {value: 3112, label: 'December'}

        ],

        crashesByPlatform: [
            {value: 26, label: "iOS"},
            {value: 15, label: "Android"},
            {value: 16, label: "OS X"},

        ],
        usersByPlatform: [
            {value: 233, label: "iOS"},
            {value: 321, label: "Android"}
        ],
        usersByCarrier: [
            {value: 222, label: "WI-FI"},
            {value: 323, label: "Verizon"},
            {value: 23, label: "AT&T"},
        ]


    },
    year: {
        usersByTime: [
            {value: 4137, label: '2012'},
            {value: 3237, label: '2013'},
            {value: 3337, label: '2014'},
            {value: 2237, label: '2015'},
            {value: 5127, label: '2016'},
            {value: 6137, label: '2017'}

        ],

        crashesByPlatform: [
            {value: 26, label: "iOS"},
            {value: 15, label: "Android"},
            {value: 16, label: "OS X"},

        ],
        usersByPlatform: [
            {value: 2303, label: "iOS"},
            {value: 5321, label: "Android"}
        ],
        usersByCarrier: [
            {value: 2422, label: "WI-FI"},
            {value: 1323, label: "Verizon"},
            {value: 423, label: "AT&T"},
            {value: 23, label: "Offline"},
        ]


    }


};