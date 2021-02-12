import { UserBaseDTO, UserLoginDTO, UserRegisterDTO } from "../../models/user";
import { AxiosResponse } from 'axios';
import { BaseHTTPEntityService } from "./base-http-service";

export interface UserLoginResponse {
    token: string;
    user: UserBaseDTO;
}

export interface CheckTokenResponse {
    valid: boolean;
    user: UserBaseDTO;
}

export interface CheckEmailResponse {
    used: boolean;
}

class UserHTTPServiceClass extends BaseHTTPEntityService<UserBaseDTO> {

    constructor() {
        super('user/');
    }

    public register = (form: UserRegisterDTO): Promise<AxiosResponse<UserRegisterDTO>> => {
        this.endPoint = 'register';
        return this.post(form);
    }

    public login = (form: UserLoginDTO): Promise<AxiosResponse<UserLoginResponse>> => {
        this.endPoint = 'login';
        return this.post(form);
    }

    public logout = (): Promise<AxiosResponse<any>> => {
        this.endPoint = 'logout';
        return this.postAuth(null);
    }

    public checkToken = (token: string): Promise<AxiosResponse<CheckTokenResponse>> => {
        this.endPoint = 'check-token';
        return this.post({token});
    }

    public checkEmail = (email: string): Promise<AxiosResponse<any>> => {
        this.endPoint = 'check-email';
        return this.post({email});
    }

    public adminGetUsers = (): Promise<AxiosResponse<any>> => {
        return this.createAuthRequest().get('admin/cg-users');
    }

    public adminCreateUser = (form: any): Promise<AxiosResponse<any>> => {
        return this.createAuthRequest().post('admin/cg-users', form);
    }

    public adminDeleteUser = (id: any) => {
        return this.createAuthRequest().delete('admin/users/' + id);
    }

    public adminUpdateUser = (id: any, data: any) => {
        return this.createAuthRequest().put('admin/users/' + id, data);
    }

}

const UserHTTPService = new UserHTTPServiceClass();
export default UserHTTPService;