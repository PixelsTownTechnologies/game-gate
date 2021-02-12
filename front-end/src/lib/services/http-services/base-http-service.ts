import axios, { AxiosRequestConfig } from "axios";
import { BaseEntity } from "../../models/base";
import { ServicesHTTPMethods } from "../facade-service/base-facade-service";
import { isNull } from "../../utils/utils";

export class BaseHTTPService {

    private static HOST_URL: string;
    private static HEADERS: any;
    private static TOKEN_CALLBACK: () => string;

    public baseURL: string;
    public endPoint?: string;

    constructor(baseURL: string, endPoint?: string) {
        this.baseURL = baseURL;
        this.endPoint = endPoint;
    }

    public static initialize(HOST_URL: string, TOKEN_CALLBACK: () => string, HEADERS?: any) {
        BaseHTTPService.HEADERS = HEADERS;
        BaseHTTPService.TOKEN_CALLBACK = TOKEN_CALLBACK;
        BaseHTTPService.HOST_URL = HOST_URL;
    }

    createAuthRequest = (hostUrl?: string, headers?: any, token?: string) => {
        const hostUrlParameter = hostUrl ? hostUrl : BaseHTTPService.HOST_URL;
        const headerParameter = headers ? {
            ...headers, Authorization:
                headers.Authorization ?
                    headers.Authorization :
                    `Token ${ token ? token : BaseHTTPService.TOKEN_CALLBACK() }`
        } : {
            ...BaseHTTPService.HEADERS,
            Authorization: ( BaseHTTPService.HEADERS && BaseHTTPService.HEADERS.Authorization
                ? BaseHTTPService.HEADERS.Authorization :
                `Token ${ token ? token : BaseHTTPService.TOKEN_CALLBACK() }` )
        };
        return axios.create({
            baseURL: hostUrlParameter,
            headers: headerParameter
        });
    }

    createRequest(hostUrl?: string, headers?: any) {
        return axios.create({
            baseURL: hostUrl ? hostUrl : BaseHTTPService.HOST_URL,
            headers: headers ? headers : BaseHTTPService.HEADERS
        });
    }

    getRequestURL(id?: any): string {
        return `${ this.baseURL }${ this.endPoint }${ !isNull(id) ? `/${ id }` : '' }`;
    }

    public postAuth(data: any, url?: string, config?: AxiosRequestConfig) {
        if (config) {
            return this.createAuthRequest().post(url ? url : this.getRequestURL(), data, config);
        }
        return this.createAuthRequest().post(url ? url : this.getRequestURL(), data);
    }

    public getAuth(url?: string, id?: any, config?: AxiosRequestConfig) {
        if (config) {
            return this.createAuthRequest().get(url ? url : this.getRequestURL(id), config);
        }
        return this.createAuthRequest().get(url ? url : this.getRequestURL(id));
    }

    public putAuth(id: any, data: any, url?: string, config?: AxiosRequestConfig) {
        if (config) {
            return this.createAuthRequest().put(url ? url : this.getRequestURL(id), data, config);
        }
        return this.createAuthRequest().put(url ? url : this.getRequestURL(id), data);
    }

    public deleteAuth(id: any, url?: string, config?: AxiosRequestConfig) {
        if (config) {
            return this.createAuthRequest().delete(url ? url : this.getRequestURL(id), config);
        }
        return this.createAuthRequest().delete(url ? url : this.getRequestURL(id));
    }

    public post(data: any, config?: AxiosRequestConfig) {
        if (config) {
            return this.createRequest().post(this.getRequestURL(), data, config);
        }
        return this.createRequest().post(this.getRequestURL(), data);
    }

    public get(id?: any, config?: AxiosRequestConfig) {
        if (config) {
            return this.createRequest().get(this.getRequestURL(id), config);
        }
        return this.createRequest().get(this.getRequestURL(id));
    }

    public delete(id: any, config?: AxiosRequestConfig) {
        if (config) {
            return this.createRequest().delete(this.getRequestURL(id), config);
        }
        return this.createRequest().delete(this.getRequestURL(id));
    }

    public put(id: any, data: any, config?: AxiosRequestConfig) {
        if (config) {
            return this.createRequest().put(this.getRequestURL(id), data, config);
        }
        return this.createRequest().put(this.getRequestURL(id), data);
    }

    public setBaseURL = (baseURL: string) => {
        this.baseURL = baseURL;
    }

}

export class BaseHTTPEntityService<Entity extends BaseEntity>
    extends BaseHTTPService implements ServicesHTTPMethods<Entity> {

    createEntity(entity: Entity): Promise<Entity> {
        return this.post(entity) as any;
    }

    deleteEntity(id: any): Promise<any> {
        return this.delete(id);
    }

    updateEntity(id: any): Promise<Entity> {
        return this.delete(id) as any;
    }

    find(): Promise<any> {
        return this.get();
    }

    findById(id: any): Promise<any> {
        return this.get(id);
    }

}