import  {InitialState,CopyAndOverrideKey} from "../ReduxUtil";
export const ACTION_TYPES = {
    CHANGE_PROFILE_META : "PROFILE_CHANGE_META",
    CHANGE_DATA : "CHANGE_DATA"
};
// This is what state.authentication will look like


// Reducer

const profile = (state = InitialState("profile"), action) => {
    switch (action.type) {

        case ACTION_TYPES.CHANGE_PROFILE_META:{
            //["metadata" ,action.payload.metadata]
            return CopyAndOverrideKey(state,action.payload,["metadata"]);
        }
        case ACTION_TYPES.CHANGE_DATA:{
            return CopyAndOverrideKey(state,action.payload,action.keyList);
        }
        case  'PROFILE_LOGOUT' : {
            return InitialState("profile");
        }
        default:
            return state;
    }
};


export {profile}

