import { BaseEntity } from "../../models/base";
import { BaseFacadeServices } from "../facade-service/base-facade-service";
import { APIActionConfig, EntityServiceConfig } from "../models/models";
import { BaseHTTPEntityService } from "../http-services/base-http-service";
import { ENTITY_ACTIONS } from "../models/actions";
import { AxiosInstance, AxiosResponse } from "axios";
import { flushEntity, getEntityByName, isEntityLoaded, loadEntity } from "../../store/actions/entity";

export class EntityService<Entity extends BaseEntity> extends BaseFacadeServices {

    entityConfig: EntityServiceConfig;
    httpService: BaseHTTPEntityService<Entity>;

    constructor(entityConfig: EntityServiceConfig) {
        super();
        this.entityConfig = entityConfig;
        this.httpService = new BaseHTTPEntityService<Entity>(entityConfig && entityConfig.baseURL ? entityConfig.baseURL : '');
    }

    private setLoading(flag: boolean, action: APIActionConfig) {
        this.setLoader(action && action.type ? action.type : 'NONE', flag);
    }

    private getSetting = (functionName: string): APIActionConfig | null => {
        const list = this.entityConfig && this.entityConfig.actions ? this.entityConfig.actions.filter(action => action.type === functionName) : [];
        if (list.length > 0) {
            return list[0];
        }
        return null;
    }

    private getAxiosInstance = (isAuthenticate: boolean): AxiosInstance => {
        return isAuthenticate ? this.httpService.createAuthRequest() : this.httpService.createRequest();
    }

    private getURL = (action: APIActionConfig): string => {
        return action.url ? action.url : this.entityConfig.baseURL;
    }

    createEntity = async (entity: any): Promise<Entity | undefined> => {
        const actionAPI = this.getSetting(ENTITY_ACTIONS.CREATE);
        if (!actionAPI) {
            return Promise.resolve(undefined);
        }
        this.setLoading(true, actionAPI);
        try {
            const response: AxiosResponse<Entity> = await this.getAxiosInstance(!!actionAPI.authenticate).post(this.getURL(actionAPI), entity);
            if (this.entityConfig.loadToStore) {
                const storeName = this.entityConfig.storeName ? this.entityConfig.storeName : this.entityConfig.name;
                if (isEntityLoaded(storeName)) {
                    if (this.entityConfig.dataType === 'array') {
                        loadEntity(storeName, [ ...getEntityByName(storeName), response.data ]);
                    } else {
                        loadEntity(storeName, {...getEntityByName(storeName), ...response.data});
                    }
                } else {
                    if (this.entityConfig.dataType === 'array') {
                        loadEntity(storeName, [ response.data ]);
                    } else {
                        loadEntity(storeName, response.data);
                    }
                }
            }
            return Promise.resolve(response.data);
        } catch (error) {
            this.throwError(actionAPI.type, error);
        } finally {
            this.setLoading(false, actionAPI);
        }
        return Promise.resolve(undefined);
    }

    deleteEntity = async (id: any): Promise<any> => {
        const actionAPI = this.getSetting(ENTITY_ACTIONS.DELETE);
        if (!actionAPI) {
            return Promise.resolve(undefined);
        }
        try {
            const response: AxiosResponse<any> = await this.getAxiosInstance(!!actionAPI.authenticate).delete(this.getURL(actionAPI) + '/' + id);
            if (this.entityConfig.loadToStore) {
                const storeName = this.entityConfig.storeName ? this.entityConfig.storeName : this.entityConfig.name;
                if (isEntityLoaded(storeName)) {
                    if (this.entityConfig.dataType === 'array') {
                        loadEntity(storeName, ( getEntityByName(storeName) as Entity[] ).filter(row => row.id !== id));
                    } else {
                        flushEntity(storeName);
                    }
                }
            }
            return Promise.resolve(response.data);
        } catch (error) {
            this.throwError(actionAPI.type, error);
        } finally {
            this.setLoading(false, actionAPI);
        }
        return Promise.resolve(undefined);
    }

    find = async (): Promise<Entity[] | Entity | undefined> => {
        const actionAPI = this.getSetting(ENTITY_ACTIONS.FIND);
        if (!actionAPI) {
            return Promise.resolve(undefined);
        }
        try {
            if (this.entityConfig.loadToStore) {
                const storeName = this.entityConfig.storeName ? this.entityConfig.storeName : this.entityConfig.name;
                if (isEntityLoaded(storeName)) {
                    return Promise.resolve(getEntityByName(storeName) as Entity[]);
                }
            }
            const response: AxiosResponse<Entity[] | Entity> = await this.getAxiosInstance(!!actionAPI.authenticate).get(this.getURL(actionAPI));
            if (this.entityConfig.loadToStore) {
                const storeName = this.entityConfig.storeName ? this.entityConfig.storeName : this.entityConfig.name;
                loadEntity(storeName, response.data);
            }
            return Promise.resolve(response.data);
        } catch (error) {
            this.throwError(actionAPI.type, error);
        } finally {
            this.setLoading(false, actionAPI);
        }
        return Promise.resolve(undefined);
    }

    findById = async (id: any): Promise<Entity | undefined> => {
        const actionAPI = this.getSetting(ENTITY_ACTIONS.FIND_BY_ID);
        if (!actionAPI) {
            return Promise.resolve(undefined);
        }
        try {
            if (this.entityConfig.loadToStore) {
                const storeName = this.entityConfig.storeName ? this.entityConfig.storeName : this.entityConfig.name;
                if (isEntityLoaded(storeName)) {
                    if (this.entityConfig.dataType === 'array') {
                        const list = ( getEntityByName(storeName) as Entity[] );
                        if (list && list.length > 0) {
                            const filterList = list.filter(row => row.id === id);
                            if (filterList && filterList.length > 0) {
                                return Promise.resolve(filterList[0]);
                            }
                        }
                    } else {
                        return Promise.resolve(getEntityByName(storeName));
                    }
                }
            }
            const response: AxiosResponse<Entity> = await this.getAxiosInstance(!!actionAPI.authenticate).get(this.getURL(actionAPI) + '/' + id);
            if (this.entityConfig.loadToStore) {
                const storeName = this.entityConfig.storeName ? this.entityConfig.storeName : this.entityConfig.name;
                if (isEntityLoaded(storeName)) {
                    if (this.entityConfig.dataType === 'array') {
                        loadEntity(storeName, [ ...getEntityByName(storeName), response.data ]);
                        return getEntityByName(storeName);
                    } else {
                        loadEntity(storeName, {...getEntityByName(storeName), ...response.data});
                    }
                } else {
                    if (this.entityConfig.dataType === 'array') {
                        loadEntity(storeName, [ response.data ]);
                    } else {
                        loadEntity(storeName, response.data);
                    }
                }
            }
            return Promise.resolve(response.data);
        } catch (error) {
            this.throwError(actionAPI.type, error);
        } finally {
            this.setLoading(false, actionAPI);
        }
        return Promise.resolve(undefined);
    }

    updateEntity = async (id: any, form: any): Promise<Entity | undefined> => {
        const actionAPI = this.getSetting(ENTITY_ACTIONS.UPDATE);
        if (!actionAPI) {
            return Promise.resolve(undefined);
        }
        try {
            const response: AxiosResponse<Entity> = await this.getAxiosInstance(!!actionAPI.authenticate).put(this.getURL(actionAPI) + '/' + id, form);
            if (this.entityConfig.loadToStore) {
                const storeName = this.entityConfig.storeName ? this.entityConfig.storeName : this.entityConfig.name;
                if (isEntityLoaded(storeName)) {
                    if (this.entityConfig.dataType === 'array') {
                        const itemList = ( getEntityByName(storeName) as Entity[] ).filter(row => row.id === id);
                        const otherItemsList = ( getEntityByName(storeName) as Entity[] ).filter(row => row.id !== id);
                        let item = response.data;
                        if (itemList && itemList.length > 0) {
                            item = {...itemList[0], ...item};
                        }
                        loadEntity(storeName, [ ...otherItemsList, item ]);
                    } else {
                        loadEntity(storeName, {...getEntityByName(storeName), ...response.data});
                    }
                } else {
                    if (this.entityConfig.dataType === 'array') {
                        loadEntity(storeName, [ response.data ]);
                    } else {
                        loadEntity(storeName, response.data);
                    }
                }
            }
            return Promise.resolve(response.data);
        } catch (error) {
            this.throwError(actionAPI.type, error);
        } finally {
            this.setLoading(false, actionAPI);
        }
        return Promise.resolve(undefined);
    }

    flushStore = () => {
        if (this.entityConfig.loadToStore) {
            const storeName = this.entityConfig.storeName ? this.entityConfig.storeName : this.entityConfig.name;
            loadEntity(storeName, undefined);
        }
    }

    reload = async () => {
        this.flushStore();
        return await this.find();
    }

}