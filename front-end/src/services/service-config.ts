import { EntityServiceConfig } from "../lib/services/models/models";

export const ENTITIES = {
    HOME: 'HOME'
}

export const homeService: EntityServiceConfig = {
    name: ENTITIES.HOME,
    storeName: 'zaid',
    baseURL: 'home',
    dataType: 'object',
    loadToStore: true,
    actions: [
        {
            type: 'FIND',
            authenticate: false
        }
    ]
}