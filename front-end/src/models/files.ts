import { BaseEntity } from "../lib/models/base";

export interface FileDTO extends BaseEntity {
    file: any;
    name: string;
}