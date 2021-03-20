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

export interface ReviewDTO extends BaseEntity {
	id: number;
	owner: { id: number, username: string, address_one: string };
	review_date: Date;
	review_star: number;
	review_description: string;
}

export interface OrderDTO extends BaseEntity {
	owner: UserOrderOwner;
	game_card: { id: number, name: string, game: { id: number, type: 'K' | 'C', logo: string, name: string, card_name: string } };
	order_keys: GameKeyDTO[];
	accessory: {
		id: number;
		name: string;
		logo: string;
	};
	create: Date;
	compete_date: Date;
	review_date: Date;
	
	account_id: string;
	extra_info: string;
	review_description: string;
	ship_location: string;
	error_msg: string;
	
	state: 'I' | 'C' | 'E';
	
	review_star: number;
	quantity: number;
	cost: number;
	
}


export interface AccessoryDTO extends BaseEntity {
	
	name: string;
	type: string;
	details: string;
	short_description: string;
	
	discount: number;
	price: number;
	points: number;
	total_price: number;
	system_quantity: number;
	
	max: number;
	min: number;
	order_min: number;
	order_max: number;
	
	total_orders: number;
	review_stars: number;
	total_reviews: number;
	
	accessory_orders: ReviewDTO[];
	
	video?: string;
	
	show: boolean;
	sold_flag: boolean;
	is_sold: boolean;
	
	logo?: any;
	image1?: any;
	image2?: any;
	image3?: any;
	image4?: any;
	
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
	points: number;
	available_keys: number;
	order_min: number;
	order_max: number;
	max: number;
	min: number;
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
	
	game_orders: ReviewDTO[];
	
	total_orders: number;
	review_stars: number;
	total_reviews: number;
	
	video?: string;
	facebook?: string;
	website?: string;
	youtube?: string;
	
	show: boolean;
	
	bg_card?: any;
	bg_cover?: any;
	logo?: any;
}