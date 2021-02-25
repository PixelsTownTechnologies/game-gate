import { BaseEntity } from "../lib/models/base";

export const gameStateTypeToTypes = {
    K: 'Keys',
    C: 'Charging'
}
export const platformTypeStateToPlatform = {
    C: 'Computer',
    M: 'Mobile',
    P: 'PlayStation',
    X: 'XBox'
}

export const gameTypes = {
    Keys: 'K',
    Charging: 'C'
}

export const platformTypes = {
    Computer: 'C',
    Mobile: 'M',
    PlayStation: 'P',
    XBox: 'X'
}

export interface GameCardDTO extends BaseEntity {
    game: number | GameDTO;
    name: string;

    sold_flag: boolean;
    available: boolean;
    is_sold: boolean;
    show: boolean;

    total_price: number;
    price: number;
    discount: number;
    max: number;
    min: number;
    points: number;
    available_keys: number;
    order_min: number;
    order_max: number;
}

export interface GameDTO extends BaseEntity {
    game_cards: GameCardDTO[];

    name: string;
    game_type: string;
    type: string;
    platform: string;

    notes: string;
    about: string;
    details: string;

    video?: string;
    facebook?: string;
    website?: string;
    youtube?: string;

    show: boolean;

    bg_card?: any;
    bg_cover?: any;
    logo?: any;
}