import 'semantic-ui-css/semantic.min.css';
import './assets/global.css';
import './assets/scroll.css';
import { ApplicationWidget } from "./lib/widgets/application";
import { ApplicationConfig } from "./lib/models/application";
import { UserBaseDTO } from "./lib/models/user";
import ThemeService from "./lib/services/theme-service";
import LanguageService from "./lib/services/language-service";
import config from './config';
import TokenService from "./lib/services/token-service";
import UserFacadeService from "./lib/services/facade-service/user-facade-service";
import { activeLoader, flushLoader } from "./lib/store/actions/loader";
import { Loader } from "./components/shared/base";

ThemeService.loadThemes({...config.THEMES as any});
ThemeService.loadDefaultTheme(config.DEFAULT_THEME);

LanguageService.setDefaultSettings(config.LANGUAGES_SETTINGS.DEFAULT_LANGUAGE);
LanguageService.loadSettings(Object.values(config.LANGUAGES_SETTINGS.LANGUAGES));


const storeConfig = {
    middleware: {
        thunk: config.STORE_CONFIG.ENABLE_THUNK && config.ENABLE_DEVELOPMENT,
        logger: config.STORE_CONFIG.ENABLE_LOGGER && config.ENABLE_DEVELOPMENT
    },
    reducer: {}
};

const onEndCallback = (config: ApplicationConfig) => {
    console.log('End');
};

const onStartCallback = (config: ApplicationConfig) => {
    console.log('Application Start');
    //TokenService.clearToken();
    const token = TokenService.getToken();
    if (token) {
        activeLoader();
        UserFacadeService.checkToken(token).then(d =>{
            flushLoader();
        });
    }
};

const onCheckAuthenticateCaller = (user: UserBaseDTO) => {
    return !!user && !!user.id;
};

const onCheckPermissionCaller = (permission: string, user: UserBaseDTO) => {
    return true;
    /*
    if (!(!!user && !!user.id)) {
        return false;
    }
    let userPermissions: string[] = [];
    user.groups?.forEach(group => {
        userPermissions = [...userPermissions, ...group.permissions.map(p => p.codename)];
    })
    return userPermissions.filter(p => p === permission).length > 0;*/
}


const application = new ApplicationWidget();

// Setting up application config
application.onEndCallback(onEndCallback);
application.onStartCallback(onStartCallback);
application.onCheckAuthenticateCaller(onCheckAuthenticateCaller);
application.onCheckPermissionCaller(onCheckPermissionCaller);

application.setRouterConfig(config.ROUTES);
application.setStoreConfig(storeConfig);

application.setNotFoundComponent(config.NOT_FOUND_COMPONENT);
application.setDefaultTheme(ThemeService.getLoadedTheme());

application.setLocalBackendURL(config.LOCAL_BACKEND_POINT);
application.setDevBackendURL(config.DEV_BACKEND_POINT);

application.enableDevelopmentMode(config.ENABLE_DEVELOPMENT);

application.skipUser(config.SKIP_AUTHENTICATION);
application.setLocalStoreConfig({
    enableLogger: config.ENABLE_LOCAL_LOGGER && config.ENABLE_DEVELOPMENT
});

application.setApplicationLogger(config.APPLICATION_LOGGER);

application.setLoaderComponent(Loader);

// Start Application
application.start();
