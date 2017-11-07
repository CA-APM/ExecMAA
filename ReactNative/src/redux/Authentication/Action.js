import {UserLogin} from "../../networking/UserLogin";


const setLoginDetails = (details) => {
    return {
        type: 'LOGIN',
        payload: details
    }

};

export const loading = (status = true, defaultScreen = false) => {

    return {
        type: 'LOADING',
        payload: {
            appToken: null,
            appTenant: null,
            error: null,
            defaultLogin: defaultScreen,
            isLoading: status,
        }
    }
};

export const resetAuthentication = () =>{
    return userLogoutAction();
}

const loginResultsReceieved = (success, isLoading, defaultLogin, token, tenant, error) => {
    return {
        type: success == false ? "FAILED_FETCH_TOKEN" : "FETCHED_TOKEN",
        payload: {
            appToken: token,
            appTenant: tenant,
            error: error,
            isLoading: isLoading,
            defaultLogin: defaultLogin,
            username: "",
            password: "",
            tenant: "",
            usernameError: "",
            passwordError: "",
            tenantError: "",
        }
    }
};

export const userLogoutAction = () => {
    return {
        type: 'LOGOUT',
        payload: {
            username: "",
            password: "",
            tenant: "",
            usernameError: "",
            passwordError: "",
            tenantError: "",
            appToken: null,
            appTenant: null,
            error: null,
            defaultLogin: false,
            isLoading: false
        }
    };
};
export const userLoginAction = async (user, password, tenant, dispatch) => {
    return UserLogin(user, password, tenant).then((res) => {
        let encoded = res.token;
        dispatch(loginResultsReceieved(true, true, false, encoded, tenant, null));
        return encoded;
    }).catch((err) => {
        dispatch(loginResultsReceieved(false, false, false, null, null, err));
        throw err;
    });
};
//endregion











