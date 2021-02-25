import { appDispatch, getStoreState } from "../../utils/application-helper";

export const ENTITY_BASE_ACTIONS = {
    ENTITY_FLUSH: 'ENTITY_FLUSH',
    ENTITY_GET: 'ENTITY_GET',
    ENTITY_LOAD: 'ENTITY_LOAD',
};

export function getEntityByName(name: string): any {
    const entityMap = getStoreState().entity;
    return entityMap && entityMap[name] ? entityMap[name] : null;
}

export function isEntityLoaded(name: string): boolean {
    const entityMap = getStoreState().entity;
    return !!entityMap && !!entityMap[name];
}

export function flushEntity(name: string): any {
    const entityMap = getStoreState().entity;
    return appDispatch({type: ENTITY_BASE_ACTIONS.ENTITY_LOAD, payload: {...entityMap, [name]: null}});
}

export function loadEntity(name: string, data: any): any {
    const entityMap = getStoreState().entity;
    return appDispatch({type: ENTITY_BASE_ACTIONS.ENTITY_LOAD, payload: {...entityMap, [name]: data}});
}

export function flushEntities(): any {
    return appDispatch({type: ENTITY_BASE_ACTIONS.ENTITY_LOAD, payload: {}});
}