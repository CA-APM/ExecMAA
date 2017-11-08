import {UserLogin} from "../../networking/UserLogin";
import {InitialState} from "../ReduxUtil";
import {setCredentials} from "../../utils/InfoLogger";


const setLoginDetails = (details) => {
    return {
        type: 'LOGIN',
        payload: details
    }

};

export const loading = (status = true, defaultScreen = false,error=null) => {

    return {
        type: 'LOADING',
        payload: {
            appToken: null,
            appTenant: null,
            error: error,
            defaultLogin: defaultScreen,
            isLoading: status,
        }
    }
};

export const handledLoginError = () =>{
    return {
        type: 'FAILED_LOGIN_HANDLED',
        payload: {
            error: null,
            isLoading: false
        }
    }
}

export const logoutAndReset = (dispatch) =>{
    setCredentials("","","").then(()=>{

    }).then(()=>{
        dispatch({type:"AUTH_LOGOUT",payload:null});
        dispatch({type:"PROFILE_LOGOUT",payload:null});
        dispatch({type:"UTIL_LOGOUT",payload:null});

    });


}

const loginResultsReceieved = (success, isLoading, defaultLogin, token, appTenant, error,user,password,tenant) => {
    return {
        type: success == false ? "FAILED_FETCH_TOKEN" : "FETCHED_TOKEN",
        payload: {
            appToken: token,
            appTenant: appTenant,
            error: error,
            isLoading: isLoading,
            defaultLogin: defaultLogin,
            username: user,
            password: password,
            tenant: tenant,
            usernameError: "",
            passwordError: "",
            tenantError: "",
        }
    }
};

export const userLoginAction = async (user, password, tenant, dispatch,defaultScreen = false) => {
    dispatch(loading(true,defaultScreen,null));
    return UserLogin(user, password, tenant).then((res) => {
        let encoded = res.token;
        dispatch(loginResultsReceieved(true, false, false, encoded, tenant, null,user,password,tenant));
        return encoded;
    }).catch((err) => {
        dispatch(loginResultsReceieved(false, false, false, null, null, err,user,password,tenant));
        throw err;
    });
};
//endregion











