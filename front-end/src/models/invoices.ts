import { BaseEntity } from "../lib/models/base";
import { UserBaseDTO } from "../lib/models/user";

export interface InvoiceDTO extends BaseEntity {
    action: 'A' | 'R' | 'S' | 'P';
    amount: number;
    details: string;
    user: UserBaseDTO;
    create_at: Date;
}