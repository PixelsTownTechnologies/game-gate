import { RouteConfig } from "./lib/models/application";
import ComponentPPXPage from "./testPage";
import LoginPage from "./components/dashboard/user/login";

export const ROUTES_URL = {
    HOME: '/',
    TEST: '/test',
    USER: {
        AUTH: {
            LOGIN: '/user/sing-in',
            REGISTER: '/user/sing-up',
            RESET_PASSWORD: '/user/reset-password'
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