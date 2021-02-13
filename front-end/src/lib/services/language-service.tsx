import React, { useState } from 'react';
import StorageService from "../../lib/services/storage-service";
import { Dropdown } from "semantic-ui-react";
import { generateId } from "../utils/utils";


export const LEFT = 'ltr';
export const RIGHT = 'rtl';

export type LEFT_DIR = 'ltr';
export type RIGHT_DIR = 'rtl';

export interface LanguageBaseWords {
    basic: {
        yes: string;
        no: string;
        save: string;
        delete: string;
        cancel: string;
        show: string;
        theme: string;
        dark: string;
        light: string;
        noDataToView: string;
        refresh: string;
        pageSize: string;
        link: string;
    },
    fields: {
        id: string;
        name: string;
    },
    userFields: {
        email: string;
        firstName: string;
        lastName: string;
        userName: string;
        fullName: string;
        dateJoined: string;
        isActive: string;
        isStaff: string;
        phone: string;
        city: string;
        addressOne: string;
        addressTwo: string;
        state: string;
        zip_code: string;
        verified: string;
        country: string;
        groups: string;
        permissions: string;
        password: string;
        confirmPassword: string;
        currentPassword: string;
        newPassword: string;
    },
    authPages: {
        register: string;
        login: string;
        log: string;
        forgetPassword: string;
        reset: string;
    }
}

export interface LanguageSetting {
    words: LanguageBaseWords;
    flag: string;
    direction: LEFT_DIR | RIGHT_DIR;
    name: string;
}

class LanguageServiceClass {

    private settings?: Map<string, LanguageSetting>;
    private loadedSettingFlag?: string;
    private callBacks: Map<number, ( (value: LanguageSetting) => void )>;

    constructor() {
        this.callBacks = new Map();
    }

    public setDefaultSettings = (settings: LanguageSetting): void => {
        const languageFlag = StorageService.load('language');
        if (!languageFlag) {
            StorageService.store('language', settings.flag);
            this.loadedSettingFlag = settings.flag;
        } else {
            this.loadedSettingFlag = languageFlag;
        }
    }

    public loadSettings = (settings: LanguageSetting[]): void => {
        this.settings = this.getLanguageSettingMap(settings);
    }

    public getSettings = (): LanguageSetting[] => {
        return this.settings ? [ ...this.settings.values() as any ] : [];
    }

    public loadSettingByFlag = (flag: string): void => {
        StorageService.store('language', flag);
        this.loadedSettingFlag = flag;
        this.callSubscribe();
    }

    public getLanguageSettings = (): LanguageSetting => {
        if (!this.settings || !this.loadedSettingFlag || !this.settings.has(this.loadedSettingFlag)) {
            throw Error('No Language loaded');
        }
        return this.settings.get(this.loadedSettingFlag) as LanguageSetting;
    }

    public getWords = (): any => {
        return this.getLanguageSettings().words;
    }

    public clearLoadedLanguage = (): void => {
        StorageService.clear('language');
    }

    public getComponent = (reloadPage?: boolean) => {
        function LanguageDropDown(props: any) {
            const [ selectedLanguage, setSelectedLanguage ] = useState(LanguageService.getLanguageSettings().flag);
            const options: any[] = LanguageService.getSettings().map((language) => ( {
                text: language.name,
                value: language.flag
            } ));
            return (
                <Dropdown
                    className='px-language-db'
                    options={ options }
                    placeholder='Choose Language'
                    selection
                    fluid
                    value={ selectedLanguage }
                    onChange={ (event, data) => {
                        LanguageService.loadSettingByFlag(data.value as string);
                        setSelectedLanguage(data.value as string);
                        if (reloadPage) {
                            setTimeout(() => {
                                window.open('/', '_self');
                            }, 100);
                        }
                    } }
                />
            );
        }

        return <LanguageDropDown/>;
    }

    public subscribe = (callBack: (value: LanguageSetting) => void) => {
        const newId = generateId();
        this.callBacks.set(newId, callBack);
        setTimeout(() => {
            callBack(this.getLanguageSettings());
        }, 20);
        return newId;
    }

    public unsubscribe = (callBackId: number) => {
        const newCallBacks = new Map();
        Array.from(this.callBacks.keys()).forEach(key => {
            if (callBackId !== Number(key)) {
                newCallBacks.set(key, this.callBacks.get(Number(key)));
            }
        });
        this.callBacks = newCallBacks;
    }

    private callSubscribe = () => {
        const language = this.getLanguageSettings();
        [ ...this.callBacks.values() as any ].forEach(callback => {
            if (callback) {
                callback(language);
            }
        });
    }

    private getLanguageSettingMap = (settings: LanguageSetting[]): Map<string, LanguageSetting> => {
        const map = new Map<string, LanguageSetting>();
        settings.forEach(l => map.set(l.flag, l));
        return map;
    }

}

const LanguageService = new LanguageServiceClass();
export default LanguageService;