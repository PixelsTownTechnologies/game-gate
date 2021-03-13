import { BaseEntity } from "../lib/models/base";

export const embedGameTypes = [
    'Action', 'Action-adventure', 'Role-playing', 'Hard', 'Word',
    'Simulation', 'Strategy', 'Sports', 'Puzzle', 'Two-Player', 'Racing',
    'Idle', 'Adventure', 'Artillery', 'High Scores', 'Brain', 'Others'
];


export interface EmbedGameDTO extends BaseEntity {
    name: string;
    src: string;
    logo: string;
    details: string;
    video: string;
    type: string;
}