import UserHTTPService, {
    CheckEmailResponse,
    CheckTokenResponse,
    UserLoginResponse
} from "../http-services/user-http-service";
import { AxiosResponse } from "axios";
import { BaseFacadeServices } from "./base-facade-service";
import { GroupBaseDTO, UserBaseDTO, UserLoginDTO, UserRegisterDTO } from "../../models/user";
import { USER_ACTIONS } from "../models/actions";
import { CountryDTO } from "../../models/country";
import { flushUser, registerUser, updateUser } from "../../store/actions/user";
import TokenService from "../token-service";

class UserFacadeServiceClass extends BaseFacadeServices {

    private setLoading(flag: boolean) {
        this.setLoader(USER_ACTIONS.AUTH_USER, flag);
    }

    public async login(form: UserLoginDTO, skipSave?: boolean): Promise<UserLoginResponse | undefined> {
        this.setLoading(true);
        try {
            const response: AxiosResponse<UserLoginResponse> = await UserHTTPService.login(form);
            if(!skipSave) {
                TokenService.saveToken(response.data.token);
                registerUser(response.data.user);
            }
            return response && response.data ? response.data : undefined;
        } catch (error) {
            this.throwError(USER_ACTIONS.AUTH_USER, error
            );
        } finally {
            this.setLoading(false);
        }
    }

    public async logout(): Promise<any> {
        this.setLoading(true);
        try {
            const response: AxiosResponse<any> = await UserHTTPService.logout();
            flushUser();
            TokenService.clearToken();
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.AUTH_USER, error
            );
        } finally {
            this.setLoading(false);
        }
    }

    public async register(form: UserRegisterDTO): Promise<UserRegisterDTO | undefined> {
        this.setLoading(true);
        try {
            const response: AxiosResponse<any> = await UserHTTPService.register(form);
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.AUTH_USER, error
            );
        } finally {
            this.setLoading(false);
        }
    }

    public async checkEmail(email: string): Promise<CheckEmailResponse | undefined> {
        this.setLoader(USER_ACTIONS.CHECK_EMAIL, true);
        try {
            const response: AxiosResponse<CheckEmailResponse> = await UserHTTPService.checkEmail(email);
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.CHECK_EMAIL, error
            );
        } finally {
            this.setLoader(USER_ACTIONS.CHECK_EMAIL, false);
        }
    }

    public async checkToken(token: string): Promise<CheckTokenResponse | undefined> {
        this.setLoader(USER_ACTIONS.CHECK_TOKEN, true);
        try {
            const response: AxiosResponse<CheckTokenResponse> = await UserHTTPService.checkToken(token);
            if (response.data.valid) {
                registerUser(response.data.user);
            } else {
                flushUser();
                TokenService.clearToken();
                //window.open();
            }
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.CHECK_TOKEN, error);
        } finally {
            this.setLoader(USER_ACTIONS.CHECK_TOKEN, false);
        }
        return undefined;
    }


    public async checkTokenCycle(token: string): Promise<CheckTokenResponse | undefined> {
        try {
            const response: AxiosResponse<CheckTokenResponse> = await UserHTTPService.checkToken(token);
            if (response && response.data && response.data.valid) {
                registerUser(response.data.user);
            } else {
                flushUser();
                TokenService.clearToken();
            }
            return response.data;
        } catch (error) {
        }
    }

    public async adminGetUsers(): Promise<UserBaseDTO[] | undefined> {
        this.setLoader(USER_ACTIONS.ADMIN_GET_USERS, true);
        try {
            const response: AxiosResponse<UserBaseDTO[]> = await UserHTTPService.adminGetUsers();
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.ADMIN_GET_USERS, error
            );
        } finally {
            this.setLoader(USER_ACTIONS.ADMIN_GET_USERS, false);
        }
    }

    public async adminCreateUser(form: any): Promise<any> {
        this.setLoader(USER_ACTIONS.ADMIN_CREATE_USER, true);
        try {
            const response: AxiosResponse<UserBaseDTO> = await UserHTTPService.adminCreateUser(form);
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.ADMIN_CREATE_USER, error
            );
        } finally {
            this.setLoader(USER_ACTIONS.ADMIN_CREATE_USER, false);
        }
    }

    public async adminDeleteUser(userId: number): Promise<any> {
        this.setLoader(USER_ACTIONS.ADMIN_DELETE_USER, true);
        try {
            const response: AxiosResponse<any> = await UserHTTPService.adminDeleteUser(userId);
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.ADMIN_DELETE_USER, error
            );
        } finally {
            this.setLoader(USER_ACTIONS.ADMIN_DELETE_USER, false);
        }
    }

    public async adminUpdateUser(userId: number, form: any): Promise<UserBaseDTO | undefined> {
        this.setLoader(USER_ACTIONS.ADMIN_UPDATE_USER, true);
        try {
            const response: AxiosResponse<UserBaseDTO> = await UserHTTPService.adminUpdateUser(userId, form);
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.ADMIN_UPDATE_USER, error
            );
        } finally {
            this.setLoader(USER_ACTIONS.ADMIN_UPDATE_USER, false);
        }
    }

    public async updateUserSelf(form: any): Promise<UserBaseDTO | undefined> {
        this.setLoader(USER_ACTIONS.UPDATE_USER_DATA, true);
        const formUser = new FormData();
        Object.keys(form).forEach(key => {
            if (form[key]) {
                formUser.append(key, form[key]);
            }
        });
        try {
            const response: AxiosResponse<UserBaseDTO>
                = await UserHTTPService.createAuthRequest().put('user/update-data', formUser, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data) {
                updateUser({
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    address_one: response.data.address_one,
                    address_two: response.data.address_two,
                    phone: response.data.phone,
                    city: response.data.city,
                    email: response.data.email,
                } as UserBaseDTO);
            }
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.UPDATE_USER_DATA, error
            );
        } finally {
            this.setLoader(USER_ACTIONS.UPDATE_USER_DATA, false);
        }
    }

    public async changePassword(form: { newPassword: string, currentPassword: string }): Promise<any> {
        this.setLoader(USER_ACTIONS.UPDATE_USER_DATA, true);
        try {
            const response: AxiosResponse<any> = await UserHTTPService.postAuth(form, 'user/change-password');
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.UPDATE_USER_DATA, error
            );
        } finally {
            this.setLoader(USER_ACTIONS.UPDATE_USER_DATA, false);
        }
    }

    public async getGroups(): Promise<GroupBaseDTO[] | undefined> {
        this.setLoader(USER_ACTIONS.GET_GROUPS, true);
        try {
            const response: AxiosResponse<GroupBaseDTO[]> = await UserHTTPService.getAuth('user/groups');
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.GET_GROUPS, error
            );
        } finally {
            this.setLoader(USER_ACTIONS.GET_GROUPS, false);
        }
        return [];
    }

    public async changeUserGroups(userId: number, groupList: number[]): Promise<any> {
        this.setLoader(USER_ACTIONS.ADMIN_UPDATE_USER, true);
        try {
            const response: AxiosResponse<any> = await UserHTTPService.putAuth(userId,
                {group: groupList}, 'user/admin/change-groups/' + userId);
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.ADMIN_UPDATE_USER, error
            );
        } finally {
            this.setLoader(USER_ACTIONS.ADMIN_UPDATE_USER, false);
        }
    }

    public async getCountries(): Promise<CountryDTO[] | undefined> {
        this.setLoader(USER_ACTIONS.GET_COUNTRIES, true);
        try {
            const response: AxiosResponse<CountryDTO[]> = await UserHTTPService.createRequest().get('countries/');
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.GET_COUNTRIES, error
            );
        } finally {
            this.setLoader(USER_ACTIONS.GET_COUNTRIES, false);
        }
        return [];
    }

    public async resetPasswordSendEmail(email: string): Promise<{ send: boolean }> {
        this.setLoader(USER_ACTIONS.RESET_PASSWORD, true);
        try {
            const response: AxiosResponse<{ send: boolean }> =
                await UserHTTPService.postAuth({email}, 'user/reset-password/send/');
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.RESET_PASSWORD, error
            );
        } finally {
            this.setLoader(USER_ACTIONS.RESET_PASSWORD, false);
        }
        return {send: false};
    }

    public async resetPasswordCheckCode(email: string, code: string): Promise<{ valid: boolean }> {
        this.setLoader(USER_ACTIONS.RESET_PASSWORD, true);
        try {
            const response: AxiosResponse<{ valid: boolean }> =
                await UserHTTPService.postAuth({email, code}, 'user/reset-password/check/');
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.RESET_PASSWORD, error
            );
        } finally {
            this.setLoader(USER_ACTIONS.RESET_PASSWORD, false);
        }
        return {valid: false};
    }

    public async resetPasswordChangePassword(email: string, password: string, code: string): Promise<{ completed: boolean }> {
        this.setLoader(USER_ACTIONS.RESET_PASSWORD, true);
        try {
            const response: AxiosResponse<{ completed: boolean }> =
                await UserHTTPService.postAuth({email, password, code}, 'user/reset-password/change/');
            return response.data;
        } catch (error) {
            this.throwError(USER_ACTIONS.RESET_PASSWORD, error
            );
        } finally {
            this.setLoader(USER_ACTIONS.RESET_PASSWORD, false);
        }
        return {completed: false};
    }

}

const UserFacadeService = new UserFacadeServiceClass();
export default UserFacadeService;