import { EntityServiceConfig } from "../lib/services/models/models";

export const ENTITIES = {
    HOME: 'HOME',
    USER: 'USER',
    GROUPS: 'GROUPS',
    ENUMS: 'ENUMS',
    INVOICE: 'INVOICE'
}

export const adminUserService: EntityServiceConfig = {
    name: ENTITIES.USER,
    storeName: 'users',
    dataType: 'array',
    baseURL: 'admin/users',
    loadToStore: true,
    actions: [
        {
            type: 'FIND',
            authenticate: true,
            url: 'admin/cg-users'
        },
        {
            type: 'UPDATE',
            authenticate: true,
            url: 'admin/users'
        },
        {
            type: 'CREATE',
            authenticate: true,
            url: 'admin/cg-users',
            formFields: [ 'username', 'email', 'password' ]
        }
    ]
}

export const groupsService: EntityServiceConfig = {
    storeName: 'groups',
    dataType: 'array',
    loadToStore: true,
    name: ENTITIES.GROUPS,
    baseURL: 'user/groups',
    actions: [
        {
            type: 'FIND',
            url: 'user/groups',
            authenticate: true
        }, {
            type: 'UPDATE',
            url: 'user/admin/change-groups',
            authenticate: true
        }
    ]
}

export const enumsService: EntityServiceConfig = {
    storeName: 'enums',
    baseURL: 'system/enums',
    name: ENTITIES.ENUMS,
    loadToStore: true,
    dataType: 'array',
    actions: [
        {
            type: 'FIND',
            url: 'enums',
            authenticate: false
        },
        {
            type: 'UPDATE',
            url: 'enums',
            authenticate: true
        }
    ]
}

export const adminInvoiceService: EntityServiceConfig = {
    dataType: 'array',
    loadToStore: true,
    name: ENTITIES.INVOICE,
    baseURL: '',
    storeName: 'invoices',
    actions: [
        {
            type: 'FIND',
            url: 'admin/invoice',
            authenticate: true
        },
        {
            type: 'CREATE',
            url: 'admin/invoice',
            authenticate: true
        }
    ]
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