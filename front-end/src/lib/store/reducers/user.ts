import {UserBaseDTO} from "../../models/user";
import {ActionEntityStoreBase} from "../action-base";
import {USER_BASE_ACTIONS} from "../actions/user";

const USER_REDUCER_INITIAL_STATE = {} as UserBaseDTO;

export const userReducer = (state: UserBaseDTO = USER_REDUCER_INITIAL_STATE, action: ActionEntityStoreBase<UserBaseDTO>) => {
    switch (action.type) {
        case USER_BASE_ACTIONS.GET_USER:
            return state;
        case USER_BASE_ACTIONS.REGISTER_USER:
            return action.payload;
        case USER_BASE_ACTIONS.UPDATE_USER:
            return {...state, ...action.payload} as UserBaseDTO;
        case USER_BASE_ACTIONS.FLUSH_USER:
            return USER_REDUCER_INITIAL_STATE as UserBaseDTO;
        default:
            return state;
    }
};