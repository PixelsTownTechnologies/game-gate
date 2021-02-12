export const USER_ACTIONS = {
    AUTH_USER: 'AUTH_USER',
    CHECK_EMAIL: 'CHECK_EMAIL',
    CHECK_TOKEN: 'CHECK_TOKEN',
    ADMIN_GET_USERS: 'ADMIN_GET_USERS',
    ADMIN_CREATE_USER: 'ADMIN_CREATE_USER',
    ADMIN_UPDATE_USER: 'ADMIN_UPDATE_USER',
    ADMIN_DELETE_USER: 'ADMIN_DELETE_USER',
    GET_GROUPS: 'GET_GROUPS',
    GET_COUNTRIES: 'GET_COUNTRIES',
    RESET_PASSWORD: 'RESET_PASSWORD',
    UPDATE_USER_DATA: 'UPDATE_USER_DATA'
}


export type EntityActionType = 'FIND_BY_ID' | 'FIND' | 'DELETE' | 'CREATE' | 'UPDATE';

export const ENTITY_ACTIONS = {
    FIND_BY_ID: 'FIND_BY_ID',
    FIND: 'FIND',
    DELETE: 'DELETE',
    CREATE: 'CREATE',
    UPDATE: 'UPDATE'
}
