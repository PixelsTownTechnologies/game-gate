import { EnumDTO } from "../lib/models/enum";
import { AccessoryDTO, GameCardDTO, GameDTO, ReviewDTO } from "./game";
import { EmbedGameDTO } from "./embed-game";
import { AdsDTO } from "./ads";
import { FileDTO } from "./files";

export interface HomeDetails {
	mainImages: any[];
	homeVideo: string;
	mainAds1?: number | AdsDTO;
	mainAds2?: number | AdsDTO;
	dialogAds?: number | AdsDTO;
	specialDeals: HomeGameSectionInfo;
	accessorySection: HomeAccessorySectionInfo;
	embedGameSection: HomeEmbedGameSectionInfo;
	sections: HomeGameSectionInfo[];
}

export interface HomeEmbedGameSectionInfo {
	title: TextObject;
	description: TextObject;
	embedGames: number[] | EmbedGameDTO[];
	id: number;
}

export interface HomeAccessorySectionInfo {
	title: TextObject;
	description: TextObject;
	accessories: number[] | AccessoryDTO[];
	id: number;
}

export interface HomeGameSectionInfo {
	title: TextObject;
	description: TextObject;
	gameCards?: number[] | GameCardDTO[];
	games?: number[] | GameDTO[];
	id: number;
}

export interface TextObject {
	ar: string;
	en: string;
}

export interface HomeDTO {
	enums: EnumDTO[];
	games: GameDTO[];
	gameCards: GameCardDTO[];
	reviews: ReviewDTO[];
	embedGames: EmbedGameDTO[];
	ads: AdsDTO[];
	accessory: AccessoryDTO[];
}


export interface SystemEntities {
	enums: EnumDTO[];
	accessory: AccessoryDTO[];
	games: GameDTO[];
	gameCards: GameCardDTO[];
	embedGames: EmbedGameDTO[];
	ads: AdsDTO[];
	resources: FileDTO[];
}