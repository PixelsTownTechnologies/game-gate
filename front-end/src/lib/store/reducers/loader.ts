import {LOADER_BASE_ACTIONS} from "../actions/loader";

const LOADER_REDUCER_INITIAL_STATE = false;

export const loaderReducer = (state: boolean = LOADER_REDUCER_INITIAL_STATE, action: { type: string; payload?: boolean }) => {
    switch (action.type) {
        case LOADER_BASE_ACTIONS.ACTIVE_LOADER:
            return true;
        case LOADER_BASE_ACTIONS.FLUSH_LOADER:
            return false;
        case LOADER_BASE_ACTIONS.IS_LOADER:
            return state;
        case LOADER_BASE_ACTIONS.SET_LOADER:
            return action.payload;
        default:
            return state;
    }
};