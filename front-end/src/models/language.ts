import { LanguageBaseWords } from "../lib/services/language-service";

export interface LanguageSystemWords extends LanguageBaseWords {
    errors: {
        verifyCodeLength: string;
        emailOrPasswordNotCorrect: string;
        emailAlreadyUsed: string;
        emailNotUsed: string;
        verifyCodeNotCorrect: string;
        passwordAndConfirmPassword: string;
        resetPasswordFailedPleaseTryAgain: string;
        currentPasswordError: string;
    },
    messages: {
        profile: {
            changePassword: string;
            changePasswordDescription: string;
            generalSetting: string;
            generalSettingDescription: string;
            userNameSetting: string;
            userNameSettingDescription: string;
            passwordChangeSuccess: string;
        }
    }
}