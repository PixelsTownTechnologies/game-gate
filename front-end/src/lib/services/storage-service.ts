import { decrypt, encrypt } from "../utils/utils";

const LOCAL_STORAGE = window.localStorage;

export interface LocalStoreConfig {
    enableLogger?: boolean;
    key?: string;
}

class StorageServiceClass {
    private static STORAGE_KEY = '4$45%as@dd';
    private static ENABLE_LOGGER = false;

    public setStorageKey(key: string) {
        StorageServiceClass.STORAGE_KEY = key;
    }

    public enableLocalStoreLogger = (flag: boolean) => {
        StorageServiceClass.ENABLE_LOGGER = flag;
    }

    public load(name: string): any {
        const Key = StorageServiceClass.STORAGE_KEY;
        const encryptedName = encrypt(name, Key);
        const data = LOCAL_STORAGE.getItem(encryptedName);
        if (StorageServiceClass.ENABLE_LOGGER) {
            console.log('load', {name, encryptedName, decrypt: data ? decrypt(data, Key) : data, data});
        }
        return data ? decrypt(data, Key) : data;
    }

    public store(name: string, data: any): void {
        const Key = StorageServiceClass.STORAGE_KEY;
        const encryptedName = encrypt(name, Key);
        if (StorageServiceClass.ENABLE_LOGGER) {
            console.log('store', {name, encryptedName, encrypt: encrypt(data, Key)});
        }
        LOCAL_STORAGE.setItem(encryptedName, encrypt(data, Key));
    }

    public clear(name: string) {
        const Key = StorageServiceClass.STORAGE_KEY;
        LOCAL_STORAGE.removeItem(encrypt(name, Key));
    }

}

const StorageService = new StorageServiceClass();
export default StorageService;