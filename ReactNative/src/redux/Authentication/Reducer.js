import {InitialState} from "../ReduxUtil";

// This is what state.authentication will look like


// Reducer
const authentication = (state = InitialState("authentication"), action) => {
    switch (action.type) {
        case 'LOADING':
        case 'FETCHED_TOKEN':
        case 'FAILED_FETCH_TOKEN':
        case 'LOGIN':
        case  'FAILED_LOGIN_HANDLED' :


                // this only overides keys that are in both the state and action.payload
            // otherwise it will leave the keys as is
            let obj = Object.assign({}, state);
            Object.keys(action.payload).forEach((key)=>{
               obj[key] = action.payload[key];
            });
            return obj;

        case  'AUTH_LOGOUT' :
            return {
                authentication: {
                    username: "",
                    password: "",
                    tenant: "",
                    usernameError: "",
                    passwordError: "",
                    tenantError: "",
                    appToken: null,
                    appTenant: null,
                    error: null,
                    defaultLogin: true, // todo put defaultLogin, error, isloading outside of authentication
                    isLoading: false
                }
            }
        default:
            return state;
    }
};


/*
        payload: InitialState("authentication")

 */

export {authentication}

