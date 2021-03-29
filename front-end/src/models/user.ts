import { UserBaseDTO } from "../lib/models/user";

export interface UserDTO extends UserBaseDTO{
    points: number;
    total_orders: number;
    dealer: number;
}