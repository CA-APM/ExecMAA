export const AUTO_LOGIN_INFO = 1;
export const MOCK_DATA = 2;


export const LOG_ALL = 1 << 0 | 1 << 1 | 1 << 2;
export const LOG_SILENT = 0;
export const LOG_VERBOSE = 2;
export const LOG_NETWORK = 4;
export const LOG_NETWORK_REQUESTS = 8;



let profile = 0;
let testLevel= 0;
let logLevel = LOG_SILENT ;
let autoLogin = ["","",""];

export var getAutoLogin = () =>{
    if(testLevel & AUTO_LOGIN_INFO) {
        return autoLogin;
    }else{
        return [];
    }
}
export var getTestProfile = () => {return profile;}
export var getTest = () => {return testLevel};
export var setTesting  = (to) =>{testLevel |= to;};

export var setLogLevel = (to) =>{logLevel |= to;};

export const getLogLevel = ()=>{
    return logLevel;
}
