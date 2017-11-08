import {InitialState } from "../ReduxUtil";

// This is what state.authentication will look like
export const ACTIONS = {
    switchConfig : "SWITCH_CONFIG_PICKER",
    updateProfileList :"UPDATE_PROFILE_LIST",
    updateAppList : "UPDATE_APP_LIST",
    updateVersionList : "UPDATE_VERSION_LIST"


}
export const UTIL_ACTION_TYPES = {
    TURN_OFF_PROFILE_LOAD : "TURN_OFF"
};


// showConfigPicker
// Reducer
const util = (state = InitialState("util"), action) => {
    switch (action.type) {
        case ACTIONS.switchConfig:
            return Object.assign({}, state, {showConfigPicker: !state.showConfigPicker});
        case ACTIONS.updateAppList:
            return Object.assign({},state,{profileList : action.payload});
        case ACTIONS.updateVersionList:
            return Object.assign({},state,{appVersions : action.payload});
        case  'UTIL_LOGOUT' : {
            return InitialState("util");
        }
        default:
            return state;
    }


};
export {util}

