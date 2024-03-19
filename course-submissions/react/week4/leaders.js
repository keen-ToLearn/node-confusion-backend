import * as ActionTypes from './ActionTypes';

export const Leaders = (state = {
        isLoading: true,
        errMes: null,
        leaders: []
    }, action) => {
    switch(action.type){
        case ActionTypes.LEADERS_LOADING:
            return {...state, isLoading: true, errMes: null, leaders: []}
        case ActionTypes.LEADERS_FAILED:
            return {...state, isLoading: false, errMes: action.payload, leaders: []}
        case ActionTypes.ADD_LEADERS:
            return {...state, isLoading: false, errMes: null, leaders: action.payload}
        default:
            return state;
    }
}