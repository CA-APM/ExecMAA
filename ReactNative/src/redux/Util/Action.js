import {ACTIONS, UTIL_ACTION_TYPES} from "./Reducer";
import {getAllAppVersions, getApps} from "../../networking/GetProfile";
import {DataStatus, failedFetchingDataFor, fetchingDataFor, succeededFetchingDataFor} from "../ReduxUtil";


export const switchConfigPicker = (details) => {
    return {
        type: ACTIONS.switchConfig,
        payload: null
    };

};

//region App List loading actions
const loadingAppList = () => {
    return {
        type: ACTIONS.updateAppList,
        payload: {
            metadata: {status : DataStatus.fetching},
            data: null
        }

    }
};
const createNewAppList = (data) => {
    return {
        type: ACTIONS.updateAppList,
        payload: {
            metadata:{status :  DataStatus.success},
            data: data
        }

    }
};
const failedCreateNewAppList = () => {

    return {
        type: ACTIONS.updateAppList,
        payload: {
            metadata: {status : DataStatus.failed},
            data: null
        }

    }
};
const updateVersionList = (status,data) =>{
    return {
        type : ACTIONS.updateVersionList,
        payload :{
            metadata : {status : status},
            data : data
        }
    };
}
export const LoadAllVersions= (appList,token,dispatch) => {
    dispatch(updateVersionList(DataStatus.loading,null));
    getAllAppVersions(token,appList).then((data) => {
        dispatch(updateVersionList(DataStatus.success,data));
    }).catch((err) => {
        dispatch(updateVersionList(DataStatus.failed,null));
    });
}
export const LoadAppList = (token,dispatch) => {
    dispatch(loadingAppList());
    return getApps(token).then((success) => {
        dispatch(createNewAppList(success));
        return success;
    }).catch((err) => {
        dispatch(failedCreateNewAppList());
        return [];
    });
}
//endregion



