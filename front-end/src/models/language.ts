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
        manageOrders: string;
        dashboard: string;
        userHistory: string;
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
            actions: {
                edit: string;
                editSubData: string;
                add: string;
            };
            keys: {
                fileContent: string;
                addKeys: string;
                viewKeys: string;
                saveGeneratedKeys: string;
                fileFormat: string;
                file: string;
                fileFormatNote: string;
            };
            fields: {
                name: string;
                game_type: string;
                type: string;
                platform: string;
                card_name: string;
                country: string;
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
        };
        gameCard: {
            title: string;
            actions: {
                edit: string;
                add: string;
            };
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
        };
        order: {
            title: string;
            orderHistory: string;
            orderKeys: string;
            actions: {
                review: string;
                edit: string;
                showKeys: string;
                convertToError: string;
                convertToComplete: string;
                convertToInProgress: string;
            };
            stateMap: {
                I : string;
                C: string;
                E: string;
            };
            ownerId: string;
            ownerUsername: string;
            orderDate: string;
            compete_date: string;
            account_id: string;
            extra_info: string;
            error_msg: string;
            state: string;
            quantity: string;
            reviewDate: string;
            review_star: string;
            review_description: string;
        };
        files: {
            title: string;
            action: {
                edit: string;
                add: string;
            };
            fields:{
                file: string;
                name: string;
                id: string
                fileURL: string;
            }
        }
    };
    gameViewer: {
        fields: {
            orderId: string;
            rulesLabel: string;
            subDetails: string;
        };
        importantNotes: string;
        addToFavorite: string;
        offer: string;
        totalPrice: string;
        selectOrderData: string;
        selectCardType: string;
        selectQuantity: string;
        reviews: string;
        buyNow: string;
        addToCart: string;
        total: string;
        credits: string;
        sold: string;
        details: string;
        videoGame: string;
        orderHistory: string;
        orderThanksMsg: string;
        confirmOrder: string;
        continue: string;
        noBalance: string;
        failedMsg: string;
        orderMsgOne: string;
    };
    homeSettings: {
        editConfig: string;
        addSection: string;
        sectionTitle: string;
        sectionDescription: string;
        selectedGames: string;
        selectedGameCards: string;
        sections: string;
        sectionConfig: string;
        ArText: string;
        EnText: string;
        mainText: string;
        specialDeals: string;
    };
}