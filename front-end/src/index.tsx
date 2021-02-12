import 'semantic-ui-css/semantic.min.css';
import { ApplicationWidget } from "./lib/widgets/application";
import { ApplicationConfig } from "./lib/models/application";
import { UserBaseDTO } from "./lib/models/user";
import React from "react";
import ThemeService from "./lib/services/theme-service";
import LanguageService from "./lib/services/language-service";
import { LocalStoreConfig } from "./lib/services/storage-service";
import config from './config';

const themes = {
    dark: React.lazy(() => import('./utils/themes-warpper/dark-theme')),
    light: React.lazy(() => import('./utils/themes-warpper/light-theme'))
}

ThemeService.loadThemes({...themes as any});
ThemeService.loadDefaultTheme(config.DEFAULT_THEME);

LanguageService.setDefaultSettings(config.LANGUAGES_SETTINGS.DEFAULT_LANGUAGE);
LanguageService.loadSettings(Object.values(config.LANGUAGES_SETTINGS.LANGUAGES));


const storeConfig = {
    middleware: {
        thunk: config.STORE_CONFIG.ENABLE_THUNK,
        logger: config.STORE_CONFIG.ENABLE_LOGGER
    },
    reducer: {}
};

const onEndCallback = (config: ApplicationConfig) => {
    console.log('End');
};

const onStartCallback = (config: ApplicationConfig) => {
    console.log('Start');
};

const onCheckAuthenticateCaller = (user: UserBaseDTO) => {
    return true
};

const onCheckPermissionCaller = (permission: string, user: UserBaseDTO) => {
    return true;
}


const application = new ApplicationWidget();
// Setting up application config
application.onEndCallback(onEndCallback);
application.onStartCallback(onStartCallback);
application.onCheckAuthenticateCaller(onCheckAuthenticateCaller);
application.onCheckPermissionCaller(onCheckPermissionCaller);
application.setRouterConfig(config.ROUTES);
application.skipUser(true);
application.setStoreConfig(storeConfig);
application.setNotFoundComponent(null);
application.setDefaultTheme(ThemeService.getLoadedTheme());
application.setBackendURL(config.BACK_END_END_POINT);
application.setLocalStoreConfig({
    enableLogger: config.ENABLE_LOCAL_LOGGER
} as LocalStoreConfig);
// Start Application
application.start();
