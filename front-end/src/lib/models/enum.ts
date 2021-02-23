import { BaseEntity } from "./base";

export interface EnumDTO extends BaseEntity {
    name: string;
    data: any;
    values: string;
    max_value: number;
    type: 'text' | 'number';
    global_enum: boolean;
}