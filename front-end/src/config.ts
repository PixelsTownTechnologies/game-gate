import { LanguageSetting, LEFT, RIGHT } from "./lib/services/language-service";
import ARABIC_LANGUAGE from "./utils/languages/arabic-language";
import ENGLISH_LANGUAGE from "./utils/languages/english-language";
import routes from "./routes";

export const PERMISSIONS = {};

export const CONSTANTS = {};

export const LANGUAGES = {
    ARABIC: {words: ARABIC_LANGUAGE, flag: 'ar', direction: RIGHT, name: 'Arabic'} as LanguageSetting,
    ENGLISH: {words: ENGLISH_LANGUAGE, flag: 'en', direction: LEFT, name: 'English'} as LanguageSetting,
};

export default {
    BACK_END_END_POINT: 'http://192.168.1.194:8000/',
    DEFAULT_THEME: 'dark',
    STORE_CONFIG: {
        ENABLE_THUNK: true,
        ENABLE_LOGGER: true
    },
    ENABLE_LOCAL_LOGGER: false,
    LANGUAGES_SETTINGS: {
        LANGUAGES,
        DEFAULT_LANGUAGE: LANGUAGES.ENGLISH
    },
    ROUTES: routes,
    PERMISSIONS,
    CONSTANTS
} as const;