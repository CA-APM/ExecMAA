import {InitialState} from "../ReduxUtil";

// This is what state.authentication will look like


// Reducer
const authentication = (state = InitialState("authentication"), action) => {
    switch (action.type) {
        case 'LOADING':
        case 'FETCHED_TOKEN':
        case 'FAILED_FETCH_TOKEN':
        case 'LOGIN':
        case  'LOGOUT' :

            // this only overides keys that are in both the state and action.payload
            // otherwise it will leave the keys as is
            let obj = Object.assign({}, state);
            Object.keys(action.payload).forEach((key)=>{
               obj[key] = action.payload[key];
            });
            return obj;
        default:
            return state;
    }
};


export {authentication}

