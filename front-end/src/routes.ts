import { RouteConfig } from "./lib/models/application";
import ComponentPPXPage from "./testPage";
import { ForgetPage, LoginPage, RegisterPage } from "./components/dashboard/user/auth";

export const ROUTES_URL = {
    HOME: '/',
    TEST: '/test',
    USER: {
        AUTH: {
            LOGIN: '/user/sing-in',
            REGISTER: '/user/sing-up',
            FORGET_PASSWORD: '/user/forget-password'
        },
        GENERAL: {
            PROFILE: '/user/profile'
        },
        ADMIN: {}
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
        component: ComponentPPXPage,
        path: ROUTES_URL.HOME
    },
    {
        component: ComponentPPXPage,
        path: ROUTES_URL.TEST
    }
] as RouteConfig[];