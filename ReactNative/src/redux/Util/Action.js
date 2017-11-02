import {ACTIONS, UTIL_ACTION_TYPES} from "./Reducer";
import {getApps} from "../../networking/GetProfile";
import {DataStatus, failedFetchingDataFor, fetchingDataFor, succeededFetchingDataFor} from "../ReduxUtil";


export const switchConfigPicker = (details) => {
    return {
        type: ACTIONS.switchConfig,
        payload: null
    };

};
export const shouldRememberLogin = (shouldRemember) => {
    return {
        type: ACTIONS.rememberLogin,
        shouldRemember: shouldRemember
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

export const LoadAppList = (token,dispatch) => {
    dispatch(loadingAppList());
    getApps(token).then((success) => {
        dispatch(createNewAppList(success));
    }).catch((err) => {
        dispatch(failedCreateNewAppList());
    });
}
//endregion



