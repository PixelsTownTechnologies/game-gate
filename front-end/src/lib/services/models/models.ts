/**
 * url: undefined -> use baseURL
 * authenticate: undefined | false -> No Token
 * formData: undefined | false -> JSON Data
 */
export interface APIActionConfig {
    type: 'FIND_BY_ID' | 'FIND' | 'DELETE' | 'CREATE' | 'UPDATE';
    url?: string;
    authenticate?: boolean;
    formFields?: string[];
    formData?: boolean;
}

export const ACTIONS = {
    FIND: 'FIND',
    FIND_BY_ID: 'FIND_BY_ID',
    DELETE: 'DELETE',
    CREATE: 'CREATE',
    UPDATE: 'UPDATE'
}


/**
 * Default Options:-
 * baseURL: used only when API url is null
 * storeName: undefined -> Entity Name Will used
 */
export interface EntityServiceConfig {
    storeName: string;
    loadToStore?: boolean;
    baseURL: string;
    dataType: 'array' | 'object';
    actions: APIActionConfig[];
}