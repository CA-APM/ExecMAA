import {UserLogin} from "../../networking/UserLogin";
import {
    Aggregation, DataStatus, failedFetchingDataFor, fetchingDataFor, succeededFetchingDataFor, updateCompareData,
    updateData
} from "../ReduxUtil";
import {ACTION_TYPES} from "./Reducer";
import * as GET  from "../../networking/GetProfile";
import * as Util from "../Util/Action";
import {LoadAllVersions} from "../Util/Action";
import * as Auth from "../Authentication/Action";

export const AllProfile = "All";

const FakeProfileData = (type) => {
    return fakeData[type];
};
const FakeFetchUserData = (type, timeFilter, profileName) => {
    return new Promise((success, failure) => {
        setTimeout(() => {
            if (Math.random() < 0.1) {
                failure("Failed to fetch user data");
            } else {
                success(FakeProfileData(type))
            }
        }, 800)
    });
};


// Helper functions
export const changeMeta = (meta) => {
    return {
        type: ACTION_TYPES.CHANGE_PROFILE_META,
        payload: meta
    }
};


let maxProfileReloads = 2;
export const LoadWholeProfile = (auth,metaObject,dispatch,loadProfileVersions=true,username="",password="",tenant="") =>{

    // I do not think its possible for the metaObject to change but perfect the object is a week
    // ref in which case we want to make a copy
    const meta  = Object.assign({},metaObject);
    dispatch(changeMeta(metaObject));

    let promises = [
        ProfileFetcher.userVisits(auth,meta,dispatch),
        ProfileFetcher.usersByPlatform(auth,meta,dispatch),
        ProfileFetcher.usersByCountry(auth,meta,dispatch),
        ProfileFetcher.crashes(auth,meta,dispatch),
        ProfileFetcher.sessionsStatistics(auth,meta,dispatch),
        ProfileFetcher.average(auth,meta,dispatch),
        ProfileFetcher.compareSummary(auth,metaObject,dispatch),
    ];
    if(loadProfileVersions){
        promises.unshift(Util.LoadAppList(auth,dispatch).then((data)=>{
            if(loadProfileVersions){
                LoadAllVersions(data.map((item)=>item.app_id),auth,dispatch);
            }
        }));
    }
    Promise.all(promises).then(()=>{
        console.log("PROMISES SUCCEEDED");
        maxProfileReloads = 2;

    }).catch((err)=>{
        if(err.authTokenError && maxProfileReloads > 0){
            Auth.reloadToken(username,password,tenant,dispatch).then((token)=>{
                maxProfileReloads--;
                LoadWholeProfile(token,metaObject,dispatch,loadProfileVersions,username,password,tenant,);
            }).catch((err)=>{
                maxProfileReloads--;
                LoadWholeProfile(auth,metaObject,dispatch,loadProfileVersions,username,password,tenant,);
            })
            // reload auth  than clal LoadWholeProfile again
            // if it failed reduces maxProfileReloads by 1, if succeeded put back to 2
        }else {
            dispatch(Auth.loading(false, true, err));
        }
    });



}

export const ProfileFetcher ={
    // I realize the promise is ignore but i need to label the function async in order
    // for the reducer to accept it, or at least i think i do.
    userVisits : (auth,meta,dispatch) =>{return updateData(["data","userVisits"],auth,meta,GET.getUsers,dispatch)},
    usersByPlatform : (auth,meta,dispatch) =>{return updateData(["data","usersByPlatform"],auth,meta,GET.getUsersByPlatform,dispatch)},
    usersByCountry : (auth,meta,dispatch) =>{return updateData(["data","usersByCountry"],auth,meta,GET.getUsersByRegion,dispatch)},
    crashes : (auth,meta,dispatch) =>{return updateData(["data","crashes"],auth,meta,GET.getCrashData,dispatch)},
    sessionsStatistics : (auth,meta,dispatch) =>{return updateData(["data","sessionsStatistics"],auth,meta,GET.getSessionStats,dispatch)},
    average : (auth,meta,dispatch) =>{return updateData(["data","average"],auth,meta,GET.getPerformance,dispatch)},

    //compareData
    compareSummary: (auth,meta,dispatch) =>{updateCompareData(["compareData","compareSummary"],auth,meta,GET.getAppSummary,dispatch)},


};