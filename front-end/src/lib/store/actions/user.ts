import { appDispatch, getStoreState } from "../../utils/application-helper";
import {UserBaseDTO} from "../../models/user";

export const USER_BASE_ACTIONS = {
    CHECK_EMAIL: 'CHECK_EMAIL',
    CHECK_TOKEN: 'CHECK_TOKEN',
    AUTH_USER: 'AUTH_USER_OPERATION',
    GET_USER: 'GET_USER',
    REGISTER_USER: 'REGISTER_USER',
    UPDATE_USER: 'UPDATE_USER',
    FLUSH_USER: 'FLUSH_USER'
};

export function getUser(): UserBaseDTO {
    return getStoreState().user;
}

export function updateUser(payload: UserBaseDTO): UserBaseDTO {
    return appDispatch({type: USER_BASE_ACTIONS.UPDATE_USER, payload: payload});
}

export function registerUser(payload: UserBaseDTO): UserBaseDTO {
    return appDispatch({type: USER_BASE_ACTIONS.REGISTER_USER, payload: payload});
}

export function flushUser(): any {
    return appDispatch({type: USER_BASE_ACTIONS.FLUSH_USER});
}