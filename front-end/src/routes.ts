import { RouteConfig } from "./lib/models/application";
import ComponentPPXPage from "./testPage";
import { ForgetPage, LoginPage, RegisterPage } from "./components/dashboard/user/auth";
import { Profile } from "./components/dashboard/user/profile";

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
      subRoutes: [
          {
              component: Profile,
              path: ROUTES_URL.USER.PROFILE,
              authenticate: true
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