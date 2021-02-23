import { RouteConfig } from "./lib/models/application";
import ComponentPPXPage from "./testPage";
import { ForgetPage, LoginPage, RegisterPage } from "./components/dashboard/user/auth";
import { Profile } from "./components/dashboard/user/profile";
import ManageUsers from "./components/dashboard/admin/manage-users";
import PERMISSIONS from "./permissions";
import ManageEnums from "./components/dashboard/admin/manage-enums";
import ManageInvoices from "./components/dashboard/admin/manage-invoice";
import TokenService from "./lib/services/token-service";
import { flushUser } from "./lib/store/actions/user";

export const ROUTES_URL = {
    HOME: '/',
    TEST: '/',
    USER: {
        PROFILE: '/user/profile',
        AUTH: {
            LOGIN: '/user/sing-in',
            REGISTER: '/user/sing-up',
            FORGET_PASSWORD: '/user/forget-password'
        },
        ADMIN: {
            MANAGE_USERS: '/admin/manage-users',
            MANAGE_ENUMS: '/admin/manage-enums',
            MANAGE_INVOICE: '/admin/manage-invoice'
        }
    }
}


export default [
    {
        subRoutes: [
            {
                component: LoginPage,
                path: ROUTES_URL.USER.AUTH.LOGIN,
                authenticate: false
            },
            {
                component: RegisterPage,
                path: ROUTES_URL.USER.AUTH.REGISTER,
                authenticate: false
            },
            {
                component: ForgetPage,
                path: ROUTES_URL.USER.AUTH.FORGET_PASSWORD,
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
                path: ROUTES_URL.USER.ADMIN.MANAGE_USERS,
                authenticate: true,
                permission: PERMISSIONS.MANAGE_USERS,
                menuSetting: {
                    text: 'title.manageUsers',
                    icon: 'users'
                },
            },
            {
                component: ManageEnums,
                path: ROUTES_URL.USER.ADMIN.MANAGE_ENUMS,
                authenticate: true,
                permission: PERMISSIONS.MANAGE_ENUMS,
                menuSetting: {
                    text: 'title.manageEnums',
                    icon: 'list alternate'
                },
            },
            {
                component: ManageInvoices,
                path: ROUTES_URL.USER.ADMIN.MANAGE_INVOICE,
                authenticate: true,
                permission: PERMISSIONS.MANAGE_INVOICE,
                menuSetting: {
                    text: 'title.manageInvoice',
                    icon: 'paste'
                },
            }
        ]
    },
    {
        menuSetting: {
            direction: 'right'
        },
        subRoutes: [
            {
                component: Profile,
                path: ROUTES_URL.USER.PROFILE,
                authenticate: true,
                menuSetting: {
                    text: 'menu.profile',
                    icon: 'user'
                },
            },
            {
                isRoute: false,
                menuSetting: {
                    link: false,
                    text: 'authPages.logout',
                    icon: 'sign-out',
                    onClick: () => {
                        console.log('sss')
                        TokenService.clearToken();
                        flushUser();
                    }
                }
            }
        ]
    },
    {
        component: ComponentPPXPage,
        path: ROUTES_URL.HOME
    },
    {
        component: ComponentPPXPage,
        path: ROUTES_URL.TEST
    }
] as RouteConfig[];