import React from "react";
import { RouteComponentProps } from "react-router";
import { UserBaseDTO } from "./user";
import { ErrorDTO } from "./error";
import { LocalStoreConfig } from "../services/storage-service";

export interface MenuSetting {
    icon?: string;
    link?: string;
    text?: string;
    isButton?: boolean;
    direction?: 'left' | 'right';
    onClick?: () => void;
}

export interface RouteConfig {
    component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    path: string;
    permission?: string;
    /**
     * If authenticate is
     * <h2>undefined -> both</h2>
     * <h2>false -> un-Authenticate</h2>
     * <h2>true -> Authenticate</h2>
     */
    authenticate?: boolean;
    subRoutes?: RouteConfig[];
    /**
     * This used to don't load item in Routes
     * So only for menu
     * <h2>false -> will not render in route, will render only for menu</h2>
     * <h2>true | undefined -> will render in route</h2>
     */
    isRoute?: boolean;
    menuSetting?: MenuSetting;
}

export type onEventCallback = (config: ApplicationConfig) => void;
export type onCheckPermissionCallback = (permission: string, user: UserBaseDTO) => boolean;
export type onCheckAuthenticateCallback = (user: UserBaseDTO) => boolean;

export interface ApplicationConfig {
    checkPermissions?: onCheckPermissionCallback;
    checkAuthenticate?: onCheckAuthenticateCallback;
    routerConfig: RouteConfig[];
    storeConfig: StoreConfig;
    notFoundPage: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    onStart: onEventCallback;
    onEnd: onEventCallback;
    loaderComponent?: React.ComponentType<{show: boolean}>;
    skipUser?: boolean;
    defaultTheme: JSX.Element;
    devBackEndURL: string;
    localBackEndURL: string;
    localStoreConfig?: LocalStoreConfig;
    enableDevelopmentMode?: boolean;
    applicationLogger?: ApplicationLoggerConfig;
}

export interface ApplicationLoggerConfig{
    enableConfig?: boolean;
    log?: boolean;
    error?: boolean;
    info?: boolean;
    warring?: boolean;
}

export interface StoreConfig {
    middleware: { thunk: boolean, logger: boolean };
    reducer: any;
}

export interface ApplicationBaseState {
    user: UserBaseDTO;
    loader: boolean;
    theme: JSX.Element;
    flag: boolean;
    initialized: boolean;
}

export interface ApplicationBaseProps {
    config: ApplicationConfig;
}

export interface StoreState {
    loader: boolean;
    user: UserBaseDTO;
    error: ErrorDTO[];
    entity: any;
}