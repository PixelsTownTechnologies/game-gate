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
import { EntityService } from "./lib/services/entity-service/entity-service";
import { homeService } from "./services/service-config";
import { getStoreState } from "./lib/utils/application-helper";
import { HomeDTO } from "./models/home-details";
import { getEnumFromList } from "./lib/utils/utils";
import WindowService from "./lib/services/window.service";

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
	WindowService.clearIntervals();
};

const onStartCallback = (config: ApplicationConfig) => {
	const loadApplication = async () => {
		const token = TokenService.getToken();
		activeLoader();
		if (token) {
			await UserFacadeService.checkToken(token);
		}
		await new EntityService(homeService).find();
		const home = ( getStoreState().entity?.['home'] as HomeDTO );
		const refreshTimeout = home?.enums ? getEnumFromList(home?.enums, 'System Refresh Timer')?.data : '';
		WindowService.setTimeoutValue(( refreshTimeout && !isNaN(Number(refreshTimeout))
		&& Number(refreshTimeout) > 30 ? Number(refreshTimeout) : 30 ) * 1000);
		WindowService.addInterval(setInterval(() => {
			const token = TokenService.getToken();
			if (token) {
				UserFacadeService.checkTokenCycle(token).then();
			}
		}, ( refreshTimeout && !isNaN(Number(refreshTimeout)) && Number(refreshTimeout) > 180 ? Number(refreshTimeout) : 180 ) * 1000));
		flushLoader();
	}
	loadApplication().then();
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
