import { ActionEntityStoreBase } from "../store/action-base";
import { RouteConfig, StoreState } from "../models/application";
import Application from "../app/application";
import { Unsubscribe } from "redux";

export const appDispatch = (action: ActionEntityStoreBase<any>): any => {
    return Application.dispatch(action);
}

export const checkPermissions = (permission: string): boolean => {
    return Application.checkPermissions(permission);
}

export const isUserAuthenticate = (): boolean => {
    return Application.checkAuthenticate();
}

export const getRoutes = (): RouteConfig[] => {
    return Application.routerConfig;
}

export const getStoreState = (): StoreState => {
    return Application.store.getState() as any;
}

export const listenStateStore = (setStateCallback: (state: any) => void, entityName: string): Unsubscribe => {
    return Application.store.subscribe(() => {
        const storeValue = getStoreState() as any;
        if (storeValue && storeValue[entityName]) {
            setStateCallback({[entityName]: storeValue[entityName]});
        }
    })
}

export const loadThemeComponent = (componentTheme: any) => {
    Application.setTheme(componentTheme);
}

export const canAccessRoute = (route: RouteConfig, isAuthenticate: boolean): boolean => {
    if (( route.authenticate === undefined )) {
        return isAuthenticate && route.permission ? Application.checkPermissions(route.permission) : true;
    }
    if (isAuthenticate && route.authenticate) {
        return route.permission ? Application.checkPermissions(route.permission) : true;
    }
    return !isAuthenticate && !route.authenticate;
}

export const getFilterRouters = (routers: RouteConfig[]): RouteConfig[] => {
    const isAuthenticate = Application.checkAuthenticate();
    const newRoutesList = [] as RouteConfig[];
    routers.forEach(route => {
        if (!route.subRoutes || route.subRoutes.length < 1) {
            if (canAccessRoute(route, isAuthenticate)) {
                newRoutesList.push(route);
            }
        } else {
            const newSubRoutes = route.subRoutes.filter(subRoute => canAccessRoute(subRoute, isAuthenticate));
            if (newSubRoutes && newSubRoutes.length > 0) {
                newRoutesList.push({...route, subRoutes: newSubRoutes});
            }
        }
    });
    return newRoutesList;
}