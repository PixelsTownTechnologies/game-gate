import StorageService from "./storage-service";

class TokenServiceClass {
    getToken = () => {
        return StorageService.load('token');
    };

    saveToken = (token: string) => {
        StorageService.store('token', token);
    };

    clearToken = () => {
        StorageService.clear('token');
    };
}

const TokenService = new TokenServiceClass();
export default TokenService;