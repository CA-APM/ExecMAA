export const AUTO_LOGIN_INFO = 1;
export const MOCK_DATA = 2;


export const LOG_ALL = 1 << 1 + 1 << 2 + 1 << 3;
export const LOG_SILENCT = 0;
export const LOG_VERBOSE = 1;
export const LOG_NETWORK = 2;



let testLevel= AUTO_LOGIN_INFO & MOCK_DATA;
let logLevel = LOG_ALL;
export var getTest = () => {return testLevel};
export var setTesting  = (to) =>{testLevel = to;};

export var setLogLevel = (to) =>{logLevel= to;};

export const getLogLevel = ()=>{
    return logLevel;
}