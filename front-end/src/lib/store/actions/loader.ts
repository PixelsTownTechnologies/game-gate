import {ActionEntityStoreBase} from "../action-base";
import {ErrorDTO} from "../../models/error";
import { appDispatch, getStoreState } from "../../utils/application-helper";


export const LOADER_BASE_ACTIONS = {
    IS_LOADER: 'IS_LOADER',
    SET_LOADER: 'SET_LOADER',
    FLUSH_LOADER: 'FLUSH_LOADER',
    ACTIVE_LOADER: 'ACTIVE_LOADER'
};

export function isLoading(): boolean {
    return getStoreState().loader;
}

export function activeLoader(): boolean {
    return appDispatch({type: LOADER_BASE_ACTIONS.ACTIVE_LOADER});
}

export function setLoader(flag: boolean): boolean {
    return appDispatch({type: LOADER_BASE_ACTIONS.SET_LOADER, payload: flag});
}

export function flushLoader() {
    return appDispatch({type: LOADER_BASE_ACTIONS.FLUSH_LOADER} as ActionEntityStoreBase<ErrorDTO>);
}