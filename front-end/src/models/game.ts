import { BaseEntity } from "../lib/models/base";

export const gameStateTypeToTypes = {
    K: 'Keys',
    C: 'Charging'
}
export const platformTypeStateToPlatform = {
    C: 'Computer',
    M: 'Mobile',
    P: 'PlayStation',
    X: 'XBox',
    G: 'Global'
} as any;

export const gameTypes = {
    Keys: 'K',
    Charging: 'C'
}

export const platformTypes = {
    Computer: 'C',
    Mobile: 'M',
    PlayStation: 'P',
    XBox: 'X',
    Global: 'G',
}

export const orderState = {
    InProgress: 'I',
    Complete: 'C',
    Error: 'E'
}

export const orderStateToWord = {
    I: 'InProgress',
    C: 'Complete',
    E: 'Error'
}

export interface UserOrderOwner {
    id: number;
    username: string;
}

export interface OrderDTO extends BaseEntity {
    owner: UserOrderOwner;
    game_card: GameCardDTO;
    order_keys: GameKeyDTO[];
    create: Date;
    compete_date: Date;
    review_date: Date;

    account_id: string;
    extra_info: string;
    review_description: string;
    error_msg: string;

    state: 'I' | 'C' | 'E';

    review_star: number;
    quantity: number;

}

export interface GameKeyDTO extends BaseEntity {
    game_card: number | GameCardDTO;
    order: number;
    description: string;
    available: boolean;
}

export interface GameCardDTO extends BaseEntity {
    game: GameDTO | number;
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
    card_name: string;
    country: string;
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