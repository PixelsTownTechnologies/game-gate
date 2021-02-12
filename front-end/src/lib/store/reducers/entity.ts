import {ENTITY_BASE_ACTIONS} from "../actions/entity";

const ENTITY_REDUCER_INITIAL_STATE = {};

export const entityReducer = (state: any = ENTITY_REDUCER_INITIAL_STATE, action: { type: string; payload?: any }) => {
    switch (action.type) {
        case ENTITY_BASE_ACTIONS.ENTITY_FLUSH:
            return ENTITY_REDUCER_INITIAL_STATE;
        case ENTITY_BASE_ACTIONS.ENTITY_GET:
            return state;
        case ENTITY_BASE_ACTIONS.ENTITY_LOAD:
            return {...state, ...action.payload};
        default:
            return state;
    }
};