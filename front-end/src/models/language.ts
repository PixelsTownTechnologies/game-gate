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
    }
}