import {BaseEntity} from "./base";

export interface ErrorDTO extends BaseEntity{
    code: 500 | 401 | 402 | 403 | 404;
    message: string;
    data: any[];
}