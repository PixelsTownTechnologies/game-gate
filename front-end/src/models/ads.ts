import { BaseEntity } from "../lib/models/base";

export const adsType = [
	'Game', 'Accessory', 'external'
]


export interface AdsDTO extends BaseEntity {
	name: string;
	show: boolean;
	cover: any;
	external_link: string;
	forward_id: string;
	type: 'Game' | 'Accessory' | 'external';
}