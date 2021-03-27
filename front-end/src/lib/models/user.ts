import { BaseEntity, BaseModel, BaseModelMethods } from "./base";

export interface PermissionBaseDTO extends BaseEntity {
	name: string;
	codename: string;
}

export interface GroupBaseDTO extends BaseEntity {
	name: string;
	permissions: PermissionBaseDTO[];
}

export interface UserLoginDTO {
	username: string;
	password: string;
}

export interface UserRegisterDTO {
	email: string;
	password: string;
	confirmPassword: string;
	first_name?: string;
	last_name?: string;
}

export interface CartObject {
	quantity: number;
	objectId: number;
	type: string;
}

export interface UserBaseDTO extends BaseEntity {
	uuid: string;
	email: string;
	first_name: string;
	last_name: string;
	username: string;
	full_name: string;
	date_joined?: Date;
	is_active: boolean;
	is_staff: boolean;
	phone: string;
	city: string;
	address_one: string;
	address_two: string;
	state: string;
	zip_code: string;
	verified: boolean;
	country: any;
	groups: GroupBaseDTO[];
	balance: number;
	cart: string;
	favorite: string;
	cart_data: CartObject[];
	favorite_data: number[];
}


class User extends BaseModel<UserBaseDTO> implements BaseModelMethods<UserBaseDTO> {
	
	public static createEmptyForm(): UserBaseDTO {
		return {
			username: '',
			address_one: '',
			address_two: '',
			city: '',
			country: '',
			email: '',
			first_name: '',
			last_name: '',
			phone: '',
			zip_code: '',
			cart_data: [],
			favorite_data: [],
			full_name: '',
			groups: [],
			is_active: false,
			is_staff: false,
			id: 0,
			state: '',
			uuid: '',
			date_joined: undefined,
			verified: false,
			is_deletable: false,
			is_editable: false,
			balance: 0,
			favorite: '',
			cart: ''
		}
	}
	
}

export default User;