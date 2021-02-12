import {BaseEntity} from "./base";

export interface CountryDTO extends BaseEntity {
    name: string;
    flag: string;
    band: boolean;
    zip_code: string;
}