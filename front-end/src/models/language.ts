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
    };
    messages: {
        profile: {
            changePassword: string;
            changePasswordDescription: string;
            generalSetting: string;
            generalSettingDescription: string;
            userNameSetting: string;
            userNameSettingDescription: string;
            passwordChangeSuccess: string;
        };
        menu: {
            lookingHelp: string;
        };
    };
    title: {
        manageUsers: string;
        manageEnums: string;
        manageInvoice: string;
        manageGames: string;
        dashboard: string;
        actions: {
            editUser: string;
            addUser: string;
            setBalance: string;
            addBalance: string;
            removeBalance: string;
            permissions: string;
            editEnums: string;
            changePermissions: string;
        };
    };
    invoice: {
        action: string;
        amount: string;
        details: string;
        userName: string;
        action_date: string;
        action_time: string;
        userId: string;
        actionTypes: {
            A: string;
            R: string;
            S: string;
            P: string;
        };
    };
    menu: {
        profile: string;
    };
    entities: {
        game: {
            title: string;
            fields: {
                name: string;
                game_type: string;
                type: string;
                platform: string;
                notes: string;
                show: string;
                about: string;
                details: string;
                video: string;
                facebook: string;
                website: string;
                youtube: string;
                bg_card: string;
                bg_cover: string;
                logo: string;
            }
        },
        gameCard: {
            title: string;
            fields: {
                name: string;
                sold_flag: string;
                available: string;
                is_sold: string;
                show: string;
                total_price: string;
                price: string;
                discount: string;
                max: string;
                min: string;
                points: string;
                available_keys: string;
                order_min: string;
                order_max: string;
            }
        }
    }
}