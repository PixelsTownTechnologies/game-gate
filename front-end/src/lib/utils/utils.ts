//import CryptoJS, {AES} from 'crypto-js';

import { DFormField, ListOption } from "../components/form/models";
import { VALIDATOR_CODES } from "../models/validators";
import { LanguageBaseWords } from "../services/language-service";
import { EnumDTO } from "../models/enum";

export function encrypt(data: any, key: string): string {
    return data;//AES.encrypt(data, key) + '';
}

export function decrypt(hash: any, key: string): string {
    return hash;//AES.decrypt(hash, key).toString(CryptoJS.enc.Utf8);
}

export function generateId() {
    return Math.floor(Math.random() * 99999999999999);
}

export function timeSince(date: any): string {
    // @ts-ignore
    let seconds = Math.floor(( new Date() - date ) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
    }
    return seconds ? Math.floor(seconds) + " seconds ago" : 'now';
}

export function deepCopy(data: any): any {
    if (typeof data === 'function') {
        return data;
    } else if (!( data instanceof Object )) {
        return data;
    } else {
        if (Array.isArray(data)) {
            return Object.assign([], data.map(obj => {
                return deepCopy(obj);
            }))
        } else {
            const imageCopy = Object.assign({}, data);
            Object.keys(imageCopy).forEach(key => {
                imageCopy[key] = deepCopy(imageCopy[key]);
            })
            return imageCopy;
        }
    }
}

export function formattedFloatNumber(value: number): number {
    return parseFloat(( value * 100 / 100 ).toFixed(2));
}

export function saveOperations(callback: any, args?: any) {
    if (typeof ( callback ) === 'function') {
        try {
            if (args) {
                callback(...args);
            } else {
                callback();
            }
        } catch (error) {

        }
    }
}

export function checkAndCall(object: any, functionName: string, args?: any) {
    if (object[functionName]) {
        if (args) {
            object[functionName](...args);
        } else {
            object[functionName]();
        }
    }
}

export function getField(object: any, fieldName: string) {
    return object && fieldName ? object[fieldName] : null;
}

export function copyEntity(src: any, target: any) {
    const targetCopy = deepCopy(target);
    Object.keys(src).forEach(key => {
        if (targetCopy[key] !== null && targetCopy[key] !== undefined
            && src[key] !== null && src[key] !== undefined) {
            targetCopy[key] = src[key];
        }
    });
    return targetCopy;
}

export const removeEmpty = (form: any) => {
    const newForm = {} as any;
    Object.keys(form).forEach(key => {
        if (!!getField(form, key) || getField(form, key) === false || getField(form, key) === 0) {
            newForm[key] = getField(form, key);
        }
    });
    return newForm;
}

export const formattedNumber = (value: number) => {
    return parseFloat(( value * 100 / 100 ).toFixed(2));
}

export const costFormat = (value: number) => {
    if (!value) {
        return 0.0;
    }
    return formattedNumber(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const sortDate = (list: any[], fieldName: string) => {
    return list.sort((a, b) => {
            return ( new Date(b[fieldName]).getTime() - new Date(a[fieldName]).getTime() );
        }
    )
}

export function buildCN(...values: any[]): string {
    return values.filter(val => !!val).join(' ');
}

/**
 *
 * @param flag: Can be any value (Array, Object, boolean, Number) -> (empty, empty, false, 0, undefined, null)
 * @param value
 * @param defaultValue: default is undefined
 */
export function pxIf<T>(flag: any, value: T, defaultValue?: any): T {
    if (!flag) {
        return defaultValue;
    }
    if (typeof ( flag ) === 'object') {
        if (Array.isArray(flag) && flag.length < 1) {
            return defaultValue;
        }
        if (Object.keys(flag).length < 1) {
            return defaultValue;
        }
    }
    return value;
}

export function pxIfSelf<T>(value: T, defaultValue?: any): T {
    return pxIf(value, value, defaultValue);
}

export function getListOptions(list: any[], textFiledName?: string, valueFiledName?: string): ListOption[] {
    if (list && list.length > 0) {
        if (typeof ( list[0] ) === 'object') {
            const textFN = textFiledName ? textFiledName : ( valueFiledName ? valueFiledName : null );
            const valueFN = valueFiledName ? valueFiledName : ( textFiledName ? textFiledName : null );
            if (!textFN || !valueFN) {
                throw Error('Text key or value key not implement');
            }
            return list.map(row => {
                return {value: row[valueFN], text: row[textFN]} as ListOption;
            });
        }
        return list.map(row => {
            return {value: row, text: row} as ListOption;
        });
    }
    return [] as ListOption[];
}

export const isEmpty = (value: any): boolean => {
    if (!value) {
        return true;
    }
    if (typeof ( value ) === 'string') {
        return !value;
    } else if (value && typeof ( value ) === 'object') {
        if (Array.isArray(value)) {
            const array = value as any[];
            return ( array.length < 1 );
        } else {
            return Object.keys(value).length < 1;
        }
    }
    return !value;
}

export const isNull = (value: any): boolean => {
    return value === null;
}

export const isUndefined = (value: any): boolean => {
    return value === undefined;
}

export const isTrue = (value: any): boolean => {
    return value === true;
}

export const isFalse = (value: any): boolean => {
    return value === false;
}

export const isArray = (value: any): boolean => {
    return value && typeof ( value ) === 'object' && Array.isArray(value);
}

export const isTrueOrUndefined = (value: any): boolean => {
    return isUndefined(value) || isTrue(value);
}

export const isTrueOrFalse = (value: any): boolean => {
    return isFalse(value) || isTrue(value);
}

export const isEqual = (value1: any, value2: any): boolean => {
    return value1 === value2;
}

/**
 * @param object
 * @param field example <h4>user.userName.firstName</h4>
 */
export const getFieldValueFromRow = (object: any, field: string) => {
    const fieldList = field.split('.');
    if (!fieldList || !object) {
        return null;
    }
    let value = object;
    fieldList.forEach(key => {
        value = value ? value[key] : value;
    });
    return value;
}

export function clamp(min: number, value: number, max: number) {
    if (min <= value && value <= max) {
        return value;
    }
    if (value < min) {
        return min;
    }
    return max;
}

export function getDefaultValidMsg(words: LanguageBaseWords) {
    return [
        {code: VALIDATOR_CODES.REQUIRED_FIELD, msg: words.validatorMessages.required},
        {code: VALIDATOR_CODES.EMAIL, msg: words.validatorMessages.email}
    ];
}

export function getEmptyForm(action: string, formSetting: DFormField[][]) {
    const showField = (config: DFormField) => {
        return !( ( action && config.hideOnAction && config.hideOnAction.includes(action) )
            || ( !config.type || !config.fieldName || !config.fieldTitle ) );
    }
    const map = {} as any;
    formSetting.forEach(list => {
        list.forEach(settingField => {
            if (showField(settingField)) {
                map[settingField.fieldName] = settingField.defaultValue ? settingField.defaultValue : (
                    [ 'multiSelect' ].includes(settingField.type) ? [] : (
                        [ 'boolean' ].includes(settingField.type) ? false : (
                            [ 'range', 'number' ].includes(settingField.type) ? 0 : ''
                        )
                    )
                );
            }
        });
    });
    map.is_editable = true;
    map.is_deletable = true;
    return map;
}


export const getEnumFromList = (enumList: EnumDTO[], enumName: string): EnumDTO | null => {
    const enumFilter = enumList ? enumList.filter(e => e.name === enumName) : [];
    return enumFilter && enumFilter.length > 0 ? enumFilter[0] : null;
}
