import { LanguageSetting, LEFT, RIGHT } from "./lib/services/language-service";
import ARABIC_LANGUAGE from "./utils/languages/arabic-language";
import ENGLISH_LANGUAGE from "./utils/languages/english-language";
import routes from "./routes";
import NotFound404Page from "./components/errors/not-found-404";

export const PERMISSIONS = {};

export const CONSTANTS = {};

export const LANGUAGES = {
    ARABIC: {words: ARABIC_LANGUAGE, flag: 'ar', direction: RIGHT, name: 'Arabic'} as LanguageSetting,
    ENGLISH: {words: ENGLISH_LANGUAGE, flag: 'en', direction: LEFT, name: 'English'} as LanguageSetting,
};

export default {
    DEV_BACKEND_POINT: 'http://192.168.1.194:8000/',
    LOCAL_BACKEND_POINT: 'http://192.168.1.194:8000/',
    DEFAULT_THEME: 'dark',
    SKIP_AUTHENTICATION: false,
    ENABLE_DEVELOPMENT: true,
    STORE_CONFIG: {
        ENABLE_THUNK: true,
        ENABLE_LOGGER: true
    },
    ENABLE_LOCAL_LOGGER: true,
    LANGUAGES_SETTINGS: {
        LANGUAGES,
        DEFAULT_LANGUAGE: LANGUAGES.ENGLISH
    },
    NOT_FOUND_COMPONENT: NotFound404Page,
    ROUTES: routes,
    PERMISSIONS,
    CONSTANTS,
    APPLICATION_LOGGER: {
        enableConfig: false,
        log: true,
        error: true,
        info: true,
        warring: true,
    }
} as const;