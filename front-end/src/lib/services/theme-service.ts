import { loadThemeComponent } from "../utils/application-helper";
import StorageService from "./storage-service";
import WindowService from "./window.service";

const THEME_STORAGE = 'THEME_STORAGE';

class ThemeServiceClass {
    private themes: Map<string, any>;
    private loadedTheme: string | null;

    constructor() {
        this.themes = {} as any;
        this.loadedTheme = null;
    }

    loadDefaultTheme = (themeName: string): void => {
        if (StorageService.load(THEME_STORAGE)) {
            this.loadedTheme = StorageService.load(THEME_STORAGE);
        } else {
            StorageService.store(THEME_STORAGE, themeName);
            this.loadedTheme = themeName;
        }
    }

    loadThemes = (themes: Map<string, any>): void => {
        this.themes = themes;
    }

    loadTheme = (themeName: string): void => {
        const themes = this.themes as any;
        if (themes[themeName] && this.loadedTheme !== themeName) {
            loadThemeComponent(themes[themeName]);
            this.loadedTheme = themeName;
            StorageService.store(THEME_STORAGE, themeName);
            WindowService.reload();
        }
    }

    getLoadedTheme = (): any => {
        const themes = this.themes as any;
        return themes[this.loadedTheme ? this.loadedTheme : ''];
    }

    getLoadedThemeName = (): string | null => {
        return this.loadedTheme;
    }

}

const ThemeService = new ThemeServiceClass();
export default ThemeService;