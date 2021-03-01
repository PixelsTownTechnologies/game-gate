import { EntityServiceConfig } from "../lib/services/models/models";

export const ENTITIES = {
    HOME: 'HOME',
    USER: 'USER',
    GROUPS: 'GROUPS',
    ENUMS: 'ENUMS',
    INVOICE: 'INVOICE',
    GAME: 'GAME',
    GAME_CARD: 'GAME_CARD',
    ORDER: 'ORDER'
}

export const gameService: EntityServiceConfig = {
    storeName: 'games',
    name: ENTITIES.GAME,
    dataType: 'array',
    baseURL: '',
    loadToStore: true,
    actions: [
        {
            type: 'FIND',
            authenticate: true,
            url: 'admin/fc/game'
        }, {
            type: 'FIND_BY_ID',
            authenticate: true,
            url: 'admin/game/',
            formData: true
        }, {
            type: 'CREATE',
            authenticate: true,
            url: 'admin/fc/game',
            formData: true
        }, {
            type: 'UPDATE',
            authenticate: true,
            url: 'admin/game',
            formData: true
        }, {
            type: 'DELETE',
            authenticate: true,
            url: 'admin/game'
        }
    ]
};

export const systemGameService: EntityServiceConfig = {
    storeName: 'gamesSystem',
    name: ENTITIES.GAME,
    dataType: 'array',
    baseURL: '',
    loadToStore: false,
    actions: [
        {
            type: 'FIND',
            authenticate: false,
            url: 'system/games/fetch-all'
        }, {
            type: 'FIND_BY_ID',
            authenticate: false,
            url: 'system/games/fetch'
        }
    ]
};

export const countriesService: EntityServiceConfig = {
    name: '',
    storeName: 'countries',
    loadToStore: true,
    baseURL: '',
    dataType: 'array',
    actions: [
        {
            type: 'FIND',
            authenticate: false,
            url: 'system/countries'
        }
    ]
};

export const gameCardKeysService: EntityServiceConfig = {
    storeName: 'gameCards',
    name: ENTITIES.GAME_CARD,
    dataType: 'array',
    baseURL: '',
    loadToStore: false,
    actions: [
        {
            type: 'CREATE',
            authenticate: true,
            url: 'admin/game-card/add/keys'
        }
    ]
}

export const gameCardService: EntityServiceConfig = {
    storeName: 'gameCards',
    name: ENTITIES.GAME_CARD,
    dataType: 'array',
    baseURL: '',
    loadToStore: false,
    actions: [
        {
            type: 'FIND',
            authenticate: true,
            url: 'admin/fc/game-card'
        }, {
            type: 'CREATE',
            authenticate: true,
            url: 'admin/fc/game-card'
        }, {
            type: 'UPDATE',
            authenticate: true,
            url: 'admin/game-card'
        }, {
            type: 'DELETE',
            authenticate: true,
            url: 'admin/game-card'
        }
    ]
};

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

export const adminOrderService: EntityServiceConfig = {
    storeName: 'systemOrders',
    name: ENTITIES.ORDER,
    dataType: 'array',
    baseURL: '',
    loadToStore: true,
    actions: [
        {
            type: 'FIND',
            url: 'admin/orders',
            authenticate: true
        },
        {
            type: 'UPDATE',
            url: 'admin/order',
            authenticate: true
        },
        {
            type: 'FIND_BY_ID',
            url: 'admin/order',
            authenticate: true
        },
    ]
};

export const userOrderService: EntityServiceConfig = {
    storeName: 'userOrders',
    name: ENTITIES.ORDER,
    dataType: 'array',
    baseURL: '',
    loadToStore: true,
    actions: [
        {
            type: 'FIND',
            url: 'user/orders',
            authenticate: true
        },
        {
            type: 'CREATE',
            url: 'user/orders',
            authenticate: true
        },
        {
            type: 'UPDATE',
            url: 'user/order',
            authenticate: true
        },
        {
            type: 'FIND_BY_ID',
            url: 'user/order',
            authenticate: true
        },
    ]
};