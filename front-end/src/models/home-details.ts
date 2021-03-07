import { EnumDTO } from "../lib/models/enum";
import { GameCardDTO, GameDTO } from "./game";

export interface HomeDetails {
    mainText: TextObject;
    specialDeals: HomeSectionInfo;
    sections: HomeSectionInfo[];
}

export interface HomeSectionInfo {
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
}