import {
    ApplicationConfig,
    onCheckAuthenticateCallback,
    onCheckPermissionCallback,
    onEventCallback,
    RouteConfig,
    StoreConfig
} from "../models/application";
import Application from "../app/application";
import ReactDOM from "react-dom";
import React from "react";
import { LocalStoreConfig } from "../services/storage-service";

export class ApplicationWidget {

    config: ApplicationConfig;

    constructor() {
        this.config = {} as any;
    }

    start() {
        ReactDOM.render(
            <Application config={ this.config }/>,
            document.getElementById('root')
        );
    }

    onStartCallback = (onStart: onEventCallback) => {
        this.config.onStart = onStart;
    }

    onEndCallback = (onEnd: onEventCallback) => {
        this.config.onEnd = onEnd;
    }

    onCheckPermissionCaller = (callback: onCheckPermissionCallback) => {
        this.config.checkPermissions = callback;
    }

    onCheckAuthenticateCaller = (callback: onCheckAuthenticateCallback) => {
        this.config.checkAuthenticate = callback;
    }

    skipUser = (flag: boolean) => {
        this.config.skipUser = flag;
    }

    setStoreConfig = (storeConfig: StoreConfig) => {
        this.config.storeConfig = storeConfig;
    }

    setLoaderComponent = (loaderComponent: any) => {
        this.config.loaderComponent = loaderComponent;
    }

    setRouterConfig = (routerConfig: RouteConfig[]) => {
        this.config.routerConfig = routerConfig;
    }

    setNotFoundComponent = (component: any) => {
        this.config.notFoundPage = component;
    }

    setDefaultTheme = (theme: any) => {
        this.config.defaultTheme = theme;
    }

    setDevBackendURL = (url: string) => {
        this.config.devBackEndURL = url;
    }

    setLocalBackendURL = (url: string) => {
        this.config.localBackEndURL = url;
    }

    enableDevelopmentMode = (val: boolean) => {
        this.config.enableDevelopmentMode = val;
    }

    setLocalStoreConfig = (config: LocalStoreConfig) => {
        this.config.localStoreConfig = config;
    }

    setApplicationLogger = (config: {
        log?: boolean;
        error?: boolean;
        info?: boolean;
        warring?: boolean;
    }) => {
        this.config.applicationLogger = config;
    }

}