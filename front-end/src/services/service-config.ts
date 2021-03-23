import { EntityServiceConfig } from "../lib/services/models/models";

export const gameService: EntityServiceConfig = {
	storeName: 'games',
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
			url: 'admin/game',
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

export const accessoryService: EntityServiceConfig = {
	storeName: 'accessory',
	dataType: 'array',
	baseURL: '',
	loadToStore: true,
	actions: [
		{
			type: 'FIND',
			authenticate: true,
			url: 'admin/fc/accessory'
		}, {
			type: 'FIND_BY_ID',
			authenticate: true,
			url: 'admin/accessory',
			formData: true
		}, {
			type: 'CREATE',
			authenticate: true,
			url: 'admin/fc/accessory',
			formData: true
		}, {
			type: 'UPDATE',
			authenticate: true,
			url: 'admin/accessory',
			formData: true
		}, {
			type: 'DELETE',
			authenticate: true,
			url: 'admin/accessory'
		}
	]
};

export const adsService: EntityServiceConfig = {
	storeName: 'ads',
	dataType: 'array',
	baseURL: '',
	loadToStore: true,
	actions: [
		{
			type: 'FIND',
			authenticate: true,
			url: 'admin/fc/ads'
		}, {
			type: 'FIND_BY_ID',
			authenticate: true,
			url: 'admin/ads',
			formData: true
		}, {
			type: 'CREATE',
			authenticate: true,
			url: 'admin/fc/ads',
			formData: true
		}, {
			type: 'UPDATE',
			authenticate: true,
			url: 'admin/ads',
			formData: true
		}, {
			type: 'DELETE',
			authenticate: true,
			url: 'admin/ads'
		}
	]
};

export const systemAccessoryService: EntityServiceConfig = {
	storeName: 'accessorySystem',
	dataType: 'array',
	baseURL: '',
	loadToStore: false,
	actions: [
		{
			type: 'FIND',
			authenticate: false,
			url: 'system/accessory/fetch-all'
		}, {
			type: 'FIND_BY_ID',
			authenticate: false,
			url: 'system/accessory/fetch'
		}
	]
};

export const embedGamesService: EntityServiceConfig = {
	storeName: 'embedGames',
	dataType: 'array',
	baseURL: '',
	loadToStore: true,
	actions: [
		{
			type: 'FIND',
			authenticate: true,
			url: 'admin/fc/embed-games'
		}, {
			type: 'FIND_BY_ID',
			authenticate: true,
			url: 'admin/embed-games',
			formData: true
		}, {
			type: 'CREATE',
			authenticate: true,
			url: 'admin/fc/embed-games',
			formData: true
		}, {
			type: 'UPDATE',
			authenticate: true,
			url: 'admin/embed-games',
			formData: true
		}, {
			type: 'DELETE',
			authenticate: true,
			url: 'admin/embed-games'
		}
	]
};

export const systemEmbedGamesService: EntityServiceConfig = {
	storeName: 'embedGamesSystem',
	dataType: 'array',
	baseURL: '',
	loadToStore: false,
	actions: [
		{
			type: 'FIND',
			authenticate: false,
			url: 'system/embed-games/fetch-all'
		}, {
			type: 'FIND_BY_ID',
			authenticate: false,
			url: 'system/embed-games/fetch'
		}
	]
};

export const countriesService: EntityServiceConfig = {
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
};

export const gameCardService: EntityServiceConfig = {
	storeName: 'gameCards',
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
			formFields: [ 'username', 'email', 'password', 'address_one' ]
		}
	]
};

export const groupsService: EntityServiceConfig = {
	storeName: 'groups',
	dataType: 'array',
	loadToStore: true,
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
};

export const enumsService: EntityServiceConfig = {
	storeName: 'enums',
	baseURL: 'system/enums',
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
};

export const adminInvoiceService: EntityServiceConfig = {
	dataType: 'array',
	loadToStore: true,
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
};

export const homeService: EntityServiceConfig = {
	storeName: 'home',
	baseURL: 'home',
	dataType: 'object',
	loadToStore: true,
	actions: [
		{
			type: 'FIND',
			authenticate: false
		},
		{
			type: 'FIND_BY_ID',
			authenticate: true,
			url: 'system/entities/'
		}
	]
};

export const adminOrderService: EntityServiceConfig = {
	storeName: 'systemOrders',
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

export const filesService: EntityServiceConfig = {
	storeName: 'files',
	dataType: 'array',
	baseURL: '',
	loadToStore: true,
	actions: [
		{
			type: 'FIND',
			url: 'files',
			authenticate: true
		},
		{
			type: 'CREATE',
			url: 'files',
			authenticate: true,
			formData: true
		},
		{
			type: 'UPDATE',
			url: 'files',
			authenticate: true,
			formData: true
		},
		{
			type: 'FIND_BY_ID',
			url: 'files',
			authenticate: true
		},
		{
			type: 'DELETE',
			url: 'files',
			authenticate: true
		},
	]
};

export const pointShopService: EntityServiceConfig = {
	storeName: 'pointShop',
	dataType: 'array',
	baseURL: '',
	loadToStore: true,
	actions: [
		{
			type: 'FIND',
			authenticate: true,
			url: 'admin/fc/point-shop'
		}, {
			type: 'FIND_BY_ID',
			authenticate: true,
			url: 'admin/point-shop',
			formData: true
		}, {
			type: 'CREATE',
			authenticate: true,
			url: 'admin/fc/point-shop',
			formData: true
		}, {
			type: 'UPDATE',
			authenticate: true,
			url: 'admin/point-shop',
			formData: true
		}, {
			type: 'DELETE',
			authenticate: true,
			url: 'admin/point-shop'
		}
	]
};

export const systemPointShopService: EntityServiceConfig = {
	storeName: 'pointShopSystem',
	dataType: 'array',
	baseURL: '',
	loadToStore: false,
	actions: [
		{
			type: 'FIND',
			authenticate: false,
			url: 'system/point-shop/fetch-all'
		}, {
			type: 'FIND_BY_ID',
			authenticate: false,
			url: 'system/point-shop/fetch'
		}
	]
};
