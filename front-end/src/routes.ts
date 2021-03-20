import { RouteConfig } from "./lib/models/application";
import { ForgetPage, LoginPage, RegisterPage } from "./components/dashboard/user/auth";
import Profile from "./components/dashboard/user/profile/profile";
import ManageUsers from "./components/dashboard/admin/manage-users";
import PERMISSIONS from "./permissions";
import ManageEnums from "./components/dashboard/admin/manage-enums";
import ManageInvoices from "./components/dashboard/admin/manage-invoice";
import TokenService from "./lib/services/token-service";
import { flushUser } from "./lib/store/actions/user";
import ManageGames from "./components/dashboard/admin/manage-games";
import { flushEntities } from "./lib/store/actions/entity";
import { GameViewer } from "./components/dashboard/system/game-viewer/game-viewer";
import ManageOrders from "./components/dashboard/admin/manage-orders";
import { HomeWidget } from "./components/dashboard/system/home/home";
import ManageFiles from "./components/dashboard/admin/manage-files";
import OrderHistory from "./components/dashboard/user/history/order-history";
import SingleOrderHistory from "./components/dashboard/user/history/single-order-viewer";
import ManageAccessory from "./components/dashboard/admin/manage-accesory";
import ManageEmbedGame from "./components/dashboard/admin/manage-embed-games";
import { AccessoryViewer } from "./components/dashboard/system/accessory-viewer/accessory-viewer";
import ManageAds from "./components/dashboard/admin/manage-ads";
import { SearchOnItem } from "./components/dashboard/system/search/item-search";

export const URL_ROUTES = {
	HOME: '/',
	USER: {
		PROFILE: '/user/profile',
		ORDER_HISTORY: '/user/order-history',
		ORDER_HISTORY_VIEW: '/user/order-history/view',
		AUTH: {
			LOGIN: '/user/sing-in',
			REGISTER: '/user/sing-up',
			FORGET_PASSWORD: '/user/forget-password'
		},
		ADMIN: {
			MANAGE_USERS: '/admin/manage-users',
			MANAGE_ENUMS: '/admin/manage-configurations',
			MANAGE_INVOICE: '/admin/manage-invoices',
			MANAGE_GAMES: '/admin/manage-games',
			MANAGE_RESOURCES: '/admin/manage-resources',
			MANAGE_ORDERS: '/admin/manage-orders',
			MANAGE_EMBED_GAMES: '/admin/manage-embed-games',
			MANAGE_ACCESSORIES: '/admin/manage-accessories',
			MANAGE_ADS: '/admin/manage-ads',
		},
	},
	GAME_VIEWER: '/view/game',
	ACCESSORY_VIEWER: '/view/accessory',
	EMBED_GAME_VIEWER: '/view/embed-game',
	SEARCH: '/search'
}


export default [
	{
		subRoutes: [
			{
				component: LoginPage,
				path: URL_ROUTES.USER.AUTH.LOGIN,
				authenticate: false
			},
			{
				component: RegisterPage,
				path: URL_ROUTES.USER.AUTH.REGISTER,
				authenticate: false
			},
			{
				component: ForgetPage,
				path: URL_ROUTES.USER.AUTH.FORGET_PASSWORD,
				authenticate: false
			}
		]
	},
	{
		menuSetting: {
			text: 'title.dashboard',
		},
		subRoutes: [
			{
				component: ManageUsers,
				path: URL_ROUTES.USER.ADMIN.MANAGE_USERS,
				authenticate: true,
				permission: PERMISSIONS.MANAGE_USERS,
				menuSetting: {
					text: 'title.manageUsers',
					//icon: 'users'
				},
			},
			{
				component: ManageOrders,
				path: URL_ROUTES.USER.ADMIN.MANAGE_ORDERS,
				authenticate: true,
				permission: PERMISSIONS.MANAGE_ORDERS,
				menuSetting: {
					text: 'title.manageOrders',
					//icon: 'list alternate'
				},
			},
			{
				component: ManageGames,
				path: URL_ROUTES.USER.ADMIN.MANAGE_GAMES,
				authenticate: true,
				permission: PERMISSIONS.MANAGE_GAMES,
				menuSetting: {
					text: 'title.manageGames',
					//  icon: 'game'
				},
			},
			{
				component: ManageAccessory,
				path: URL_ROUTES.USER.ADMIN.MANAGE_ACCESSORIES,
				authenticate: true,
				permission: PERMISSIONS.MANAGE_RESOURCES,
				menuSetting: {
					text: 'entities.accessory.title',
					//icon: 'life ring'
				},
			},
			{
				component: ManageEmbedGame,
				path: URL_ROUTES.USER.ADMIN.MANAGE_EMBED_GAMES,
				authenticate: true,
				permission: PERMISSIONS.MANAGE_EMBED_GAMES,
				menuSetting: {
					text: 'entities.embedGames.title',
					//icon: 'rocket'
				},
			},
			{
				component: ManageAds,
				path: URL_ROUTES.USER.ADMIN.MANAGE_ADS,
				authenticate: true,
				permission: PERMISSIONS.MANAGE_ADS,
				menuSetting: {
					text: 'entities.ads.title',
					//icon: 'bullhorn'
				},
			},
			{
				component: ManageInvoices,
				path: URL_ROUTES.USER.ADMIN.MANAGE_INVOICE,
				authenticate: true,
				permission: PERMISSIONS.MANAGE_INVOICE,
				menuSetting: {
					text: 'title.manageInvoice',
					// icon: 'paste'
				},
			},
			{
				component: ManageEnums,
				path: URL_ROUTES.USER.ADMIN.MANAGE_ENUMS,
				authenticate: true,
				permission: PERMISSIONS.MANAGE_ENUMS,
				menuSetting: {
					text: 'title.manageEnums',
					//icon: 'list alternate'
				},
			},
			{
				component: ManageFiles,
				path: URL_ROUTES.USER.ADMIN.MANAGE_RESOURCES,
				authenticate: true,
				permission: PERMISSIONS.MANAGE_RESOURCES,
				menuSetting: {
					text: 'entities.files.title',
					//icon: 'list alternate'
				},
			},
		]
	},
	{
		menuSetting: {
			direction: 'right'
		},
		subRoutes: [
			{
				component: Profile,
				path: URL_ROUTES.USER.PROFILE,
				authenticate: true,
				menuSetting: {
					text: 'menu.profile',
					icon: 'user'
				},
			},
			{
				component: OrderHistory,
				path: URL_ROUTES.USER.ORDER_HISTORY,
				authenticate: true,
				permission: PERMISSIONS.USER_HISTORY,
				menuSetting: {
					text: 'entities.order.orderHistory',
					icon: 'clipboard'
				},
			},
			{
				component: SingleOrderHistory,
				path: URL_ROUTES.USER.ORDER_HISTORY_VIEW + '/:orderId',
				authenticate: true,
				permission: PERMISSIONS.USER_HISTORY,
			},
			{
				isRoute: false,
				menuSetting: {
					link: false,
					text: 'authPages.logout',
					icon: 'sign-out',
					onClick: () => {
						TokenService.clearToken();
						flushEntities();
						flushUser();
					}
				}
			}
		]
	},
	{
		component: HomeWidget,
		path: URL_ROUTES.HOME
	},
	{
		component: GameViewer,
		path: URL_ROUTES.GAME_VIEWER + '/:gameId?/:gameCardId?'
	},
	{
		component: AccessoryViewer,
		path: URL_ROUTES.ACCESSORY_VIEWER + '/:accessoryId'
	},
	{
		component: SearchOnItem,
		path: URL_ROUTES.SEARCH + '/:type?'
	}
] as RouteConfig[];