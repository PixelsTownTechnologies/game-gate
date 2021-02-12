import {ActionEntityStoreBase} from "../action-base";
import {ErrorDTO} from "../../models/error";
import {ERROR_BASE_ACTIONS} from "../actions/error";

const ERROR_REDUCER_INITIAL_STATE = [] as ErrorDTO[];

export const errorReducer = (state: ErrorDTO[] = ERROR_REDUCER_INITIAL_STATE, action: ActionEntityStoreBase<ErrorDTO>) => {
    switch (action.type) {
        case ERROR_BASE_ACTIONS.GET_ERROR:
            return state;
        case ERROR_BASE_ACTIONS.ADD_ERROR:
            return [...state, action.payload];
        case ERROR_BASE_ACTIONS.FLUSH_ERROR:
            return ERROR_REDUCER_INITIAL_STATE;
        default:
            return state;
    }
};