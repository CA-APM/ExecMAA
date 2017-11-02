// https://github.com/reactjs/react-redux/blob/master/docs/api.md#api

import React from 'react'
import thunk from 'redux-thunk'
import {createStore,combineReducers,applyMiddleware} from 'redux'
import {authentication} from "./Authentication/Reducer";
import InitialState from "./ReduxUtil";
import {util} from "./Util/Reducer";
import {profile} from "./Profile/Reducer";
import {getLogLevel, LOG_VERBOSE} from "../../projectTest/isTesting";

// Middleware
const logger = store => next => action => {
    console.log('dispatching', action);
    console.log('with current state', store.getState());
    if(getLogLevel() & LOG_VERBOSE){
      if(action.debug !== undefined){
          console.log(``)
      }
    }
    let result = next(action);
    console.log('next state', store.getState());
    return result;
};
const crashReporter = store => next => action => {
    try {
        return next(action)
    } catch (err) {
        console.error(`Caught an exception! When Running action : ${JSON.stringify(action,3)} \nError : ${err}`);
        throw err;
    }
};


// Reducers = datastore
const reducer = combineReducers({authentication,util,profile});
const middleware = applyMiddleware(logger,crashReporter,thunk);
export default createStore(reducer,InitialState,middleware);