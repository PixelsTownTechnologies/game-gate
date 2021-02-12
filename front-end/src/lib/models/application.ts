import React from "react";
import {RouteComponentProps} from "react-router";
import {UserBaseDTO} from "./user";
import {ErrorDTO} from "./error";
import { LocalStoreConfig } from "../services/storage-service";

export interface MenuSetting {
    icon?: string;
    link?: string;
    text?: string;
}

export interface RouteConfig {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    path: string;
    permission?: string;
    authenticate?: boolean;
    subRoutes?: RouteConfig[];
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
    env?: any;
    onStart: onEventCallback;
    onEnd: onEventCallback;
    loaderComponent?: any;
    skipUser?: boolean;
    defaultTheme: JSX.Element;
    backEndURL: string;
    localStoreConfig?: LocalStoreConfig;
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