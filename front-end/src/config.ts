import { LanguageSetting, LEFT, RIGHT } from "./lib/services/language-service";
import ARABIC_LANGUAGE from "./utils/languages/arabic";
import ENGLISH_LANGUAGE from "./utils/languages/english";
import PERMISSIONS from './permissions';
import routes from "./routes";
import NotFound404Page from "./components/errors/not-found-404";
import React from "react";
import { endPoint } from './constant';

export const CONSTANTS = {};

export const LANGUAGES = {
    ARABIC: {words: ARABIC_LANGUAGE, flag: 'ar', direction: RIGHT, name: 'Arabic'} as LanguageSetting,
    ENGLISH: {words: ENGLISH_LANGUAGE, flag: 'en', direction: LEFT, name: 'English'} as LanguageSetting,
};


const THEMES = {
    dark: React.lazy(() => import('./utils/themes-wrapper/dark')),
    light: React.lazy(() => import('./utils/themes-wrapper/light'))
}

export default {
    DEV_BACKEND_POINT: endPoint.dev,
    LOCAL_BACKEND_POINT: endPoint.local,
    DEFAULT_THEME: 'dark',
    SKIP_AUTHENTICATION: false,
    ENABLE_DEVELOPMENT: true,
    STORE_CONFIG: {
        ENABLE_THUNK: true,
        ENABLE_LOGGER: false
    },
    ENABLE_LOCAL_LOGGER: false,
    LANGUAGES_SETTINGS: {
        LANGUAGES,
        DEFAULT_LANGUAGE: LANGUAGES.ENGLISH
    },
    NOT_FOUND_COMPONENT: NotFound404Page,
    ROUTES: routes,
    PERMISSIONS,
    CONSTANTS,
    THEMES,
    APPLICATION_LOGGER: {
        enableConfig: false,
        log: true,
        error: true,
        info: true,
        warring: true,
    }
} as const;