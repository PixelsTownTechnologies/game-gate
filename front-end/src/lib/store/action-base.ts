import {BaseEntity} from "../models/base";

export interface ActionEntityStoreBase<Entity extends BaseEntity>{
    type: string;
    payload?: Entity;
}