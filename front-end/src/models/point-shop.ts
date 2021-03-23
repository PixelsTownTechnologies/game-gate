import { BaseEntity } from "../lib/models/base";
import { GameCardDTO } from "./game";

export interface PointShopDTO extends BaseEntity {
	game_card: GameCardDTO;
	name: string;
	
	point_cost: number;
	money_reword: number;
	quantity: number;
	
	show: boolean;
}