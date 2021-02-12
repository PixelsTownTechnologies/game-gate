import {ActionEntityStoreBase} from "../action-base";
import {ErrorDTO} from "../../models/error";
import { appDispatch, getStoreState } from "../../utils/application-helper";

export const ERROR_BASE_ACTIONS = {
    ADD_ERROR: 'ADD_ERROR',
    GET_ERROR: 'GET_ERROR',
    FLUSH_ERROR: 'FLUSH_ERROR'
};

export function getErrors(): ErrorDTO[] {
    return getStoreState().error;
}

export function addError(payload: ErrorDTO): ErrorDTO[] {
    return appDispatch({type: ERROR_BASE_ACTIONS.ADD_ERROR, payload: payload});
}

export function flushError() {
    return appDispatch({type: ERROR_BASE_ACTIONS.FLUSH_ERROR} as ActionEntityStoreBase<ErrorDTO>);
}