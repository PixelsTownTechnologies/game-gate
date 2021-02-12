import { BaseEntity } from "../../models/base";
import { generateId } from "../../utils/utils";
import { addError, flushError } from "../../store/actions/error";

export interface ServicesFacadeMethods<Entity extends BaseEntity> {
    findAll: () => Entity[];
    findById: (id: any) => Entity;
    findSelf?: () => Entity;
    filter: (...args: any) => Entity[];
    delete: (id: any) => boolean;
    create: (entity: Entity) => Entity;
    update: (id: any) => Entity;
}

export interface ServicesHTTPMethods<Entity extends BaseEntity> {
    find: () => Promise<Entity[] | undefined>;
    findById: (id: any) => Promise<Entity | undefined>;
    createEntity: (entity: any) => Promise<Entity | undefined>;
    deleteEntity: (id: any) => Promise<any>;
    updateEntity: (id: any, form: any) => Promise<Entity | undefined>;
}

export type ERROR_CALLBACK = (error: any) => void;
export type LOADER_CALLBACK = (error: any) => void;
type ERROR_CALLBACK_MAP = { id: number, callBack: ERROR_CALLBACK, entityNames: string[] };
type LOADER_CALLBACK_MAP = { id: number, callBack: LOADER_CALLBACK, entityNames: string[] };


export class BaseFacadeServices {

    public errorCallBackMap: ERROR_CALLBACK_MAP[];
    public loadingCallBackMap: LOADER_CALLBACK_MAP[];

    constructor() {
        this.errorCallBackMap = [] as ERROR_CALLBACK_MAP[];
        this.loadingCallBackMap = [] as LOADER_CALLBACK_MAP[];
    }

    public errorSubscribe(entityNames: string[], callBack: ERROR_CALLBACK): number {
        const id = generateId();
        this.errorCallBackMap.push({id, callBack, entityNames});
        return id;
    }

    public errorUnSubscribe(id?: number, callBack?: ERROR_CALLBACK): void {
        if (callBack) {
            this.errorCallBackMap = this.errorCallBackMap.filter(row => row.callBack !== callBack);
        } else {
            this.errorCallBackMap = this.errorCallBackMap.filter(row => row.id !== id);
        }
    }

    public throwError = (entityName: string, error: any) => {
        if (error.message === 'Network Error') {
            flushError();
            addError({id: 1, code: 500, data: [ 'Server Error' ], message: 'Server Error'} as any);
        }
        if (error.response) {
            this.errorCallBackMap.filter(row => row.entityNames.includes(entityName)).forEach(row => {
                if (row.callBack) {
                    row.callBack(error.response.data);
                }
            });
        }
    }

    public loaderSubscribe(entityNames: string[], callBack: LOADER_CALLBACK): number {
        const id = generateId();
        this.loadingCallBackMap.push({id, callBack, entityNames});
        return id;
    }

    public loaderUnSubscribe(id?: number, callBack?: ERROR_CALLBACK): void {
        if (callBack) {
            this.loadingCallBackMap = this.loadingCallBackMap.filter(row => row.callBack !== callBack);
        } else {
            this.loadingCallBackMap = this.loadingCallBackMap.filter(row => row.id !== id);
        }
    }

    public setLoader(entityName: string, isLoading: boolean) {
        this.loadingCallBackMap.filter(row => row.entityNames.includes(entityName)).forEach(row => {
            if (row.callBack) {
                row.callBack(isLoading);
            }
        });
    }
}
