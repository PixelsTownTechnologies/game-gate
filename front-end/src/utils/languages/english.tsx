import { LanguageSystemWords } from "../../models/language";

const ENGLISH_LANGUAGE: LanguageSystemWords = {
    appName: 'GAMERS-DZ',
    basic: {
        yes: 'Yes',
        no: 'No',
        ok: 'Ok',
        save: 'Save',
        delete: 'Delete',
        cancel: 'Cancel',
        show: 'Show',
        theme: 'Theme',
        dark: 'Dark',
        light: 'Light',
        noDataToView: 'No Content To View',
        refresh: 'Refresh',
        pageSize: 'Page Size',
        link: 'Link',
        upload: 'Upload',
        language: 'Language',
        search: 'Search',
        edit: 'Edit',
        add: 'Add',
        goTo: 'GoTO',
        view: 'View',
        backToHome: 'Back To Home',
        notFound: 'Not Found'
    },
    fields: {
        id: 'Id',
        name: 'Name',
        value: 'Value'
    },
    userFields: {
        email: 'Email',
        firstName: 'First Name',
        lastName: 'Last Name',
        userName: 'User Name',
        fullName: 'Full Name',
        dateJoined: 'Join Date',
        isActive: 'Active',
        isStaff: 'Staff',
        phone: 'Phone',
        city: 'City',
        addressOne: 'First Address',
        addressTwo: 'Second Address',
        state: 'State',
        zip_code: 'Zip Code',
        verified: 'Verified',
        country: 'Country',
        groups: 'Groups',
        permissions: 'Permissions',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        balance: 'Balance'
    },
    authPages: {
        register: 'Register',
        login: 'Login',
        log: 'Login',
        forgetPassword: 'Forget Password',
        reset: 'Re-set',
        signInTo: 'Sign-in to',
        signIn: 'Sign-In',
        signUp: 'Sign-Up',
        welcomeMsg: 'Welcome To',
        registerNow: 'New Member? Sign Up Now',
        haveAccountLogin: 'Already have an account? Sign-In',
        sendResetCode: 'Send Reset Password Email',
        verify: 'Verify Code',
        changePassword: 'Change Password',
        resetPassword: 'Reset Password',
        verifyCode: 'Verify Code',
        logout: 'Logout'
    },
    validatorMessages: {
        required: 'This field required, Please enter it.',
        email: 'This filed not valid, Should be email.'
    },
    serviceErrors: {
        invalidId: 'Invalid entity id provided',
        generalFailed: 'Request failed, Try again later.'
    },
    errors: {
        verifyCodeLength: 'Verify code should be 8 characters',
        emailOrPasswordNotCorrect: 'Email or password not correct, Please try again',
        emailAlreadyUsed: 'This Email already used!',
        emailNotUsed: 'This email not used',
        verifyCodeNotCorrect: 'Verify code not correct',
        passwordAndConfirmPassword: 'Password and confirm password Should be same, Please try again',
        resetPasswordFailedPleaseTryAgain: 'Change password failed, Please try again later',
        currentPasswordError: 'Your current password not correct'
    },
    messages: {
        profile: {
            changePassword: 'Change Your Password',
            changePasswordDescription: 'choose complex password contains unique and special characters and numbers ex: f%D21v1#*!a',
            generalSetting: 'General Setting',
            generalSettingDescription: 'You can change language and enable dark mode!',
            userNameSetting: 'User Settings',
            userNameSettingDescription: 'You can modify your user data, Make sure to put your real data!',
            passwordChangeSuccess: 'Your Password Has been Changed Successfully'
        },
        menu: {
            lookingHelp: 'Looking For Something?'
        }
    },
    title: {
        manageUsers: 'Manage Users',
        manageEnums: 'Manage Config',
        manageInvoice: 'Manage Invoice',
        manageGames: 'Manage Games',
        userHistory: 'History',
        manageOrders: 'Manage Order',
        dashboard: 'Dashboard',
        actions: {
            editUser: 'Edit User',
            addUser: 'Add User',
            editEnums: 'Edit Enum Value',
            permissions: 'Permissions',
            setBalance: 'Set Balance',
            addBalance: 'Add Balance',
            removeBalance: 'Remove Balance',
            changePermissions: 'Change User Permissions'
        }
    },
    invoice: {
        action: 'Action',
        amount: 'Amount',
        details: 'Details',
        userName: 'User Name',
        action_date: 'Action Date',
        action_time: 'Action Time',
        userId: 'User ID',
        actionTypes: {
            A: 'Add Balance',
            R: 'Remove Balance',
            S: 'Set Balance',
            P: 'Pay Order'
        }
    },
    menu: {
        profile: 'Profile'
    },
    entities: {
        game: {
            title: 'Manage Games',
            actions: {
                add: 'Add New Game',
                edit: 'Edit Game',
                editSubData: 'Show And Edit Sub Data'
            }, keys: {
                fileContent: 'File Content',
                addKeys: 'Add Keys',
                saveGeneratedKeys: 'Save',
                viewKeys: 'Review Keys',
                fileFormat: 'File Format',
                file: 'Select File',
                fileFormatNote: 'Please any padding lines'
            },
            fields: {
                name: 'Name',
                game_type: 'Category',
                card_name: 'Card Name',
                type: 'Type',
                country: 'Country',
                platform: 'Platform',
                notes: 'Notes',
                show: 'Is Show',
                about: 'About',
                details: 'Details',
                video: 'Video ID',
                facebook: 'FaceBook URL',
                website: 'Website URL',
                youtube: 'Youtube URL',
                bg_card: 'Card Background',
                bg_cover: 'Cover Background',
                logo: 'Logo',
            }
        },
        gameCard: {
            title: 'Manage Game Card',
            actions: {
                add: 'Add New Game Card',
                edit: 'Edit Game Card'
            },
            fields: {
                name: 'Name',
                sold_flag: 'Is Sold',
                available: 'Is Available',
                is_sold: 'Is Sold',
                show: 'Is Show',
                total_price: 'Total Price',
                price: 'Price',
                discount: 'Discount',
                max: 'Max Quantity',
                min: 'Min Quantity',
                points: 'Reward Points',
                available_keys: 'Available Keys',
                order_min: 'Min Quantity Order',
                order_max: 'Max Quantity Order',
            }
        },
        order: {
            orderHistory: 'Order History',
            account_id: 'Account ID',
            compete_date: 'Complete Date',
            error_msg: 'Warning Msg',
            extra_info: 'Extra Order Info',
            orderDate: 'Order Date',
            ownerId: 'Owner ID',
            ownerUsername: 'Owner UserName',
            quantity: 'Quantity',
            review_description: 'Review Description',
            review_star: 'Review Star',
            reviewDate: 'Review Date',
            state: 'Order State',
            title: 'Manage Orders',
            orderKeys: 'Order Keys',
            stateMap: {
                C: 'Completed',
                E: 'Warning',
                I: 'In Progress'
            },
            actions: {
                review: 'Review',
                showKeys: 'Show Keys',
                convertToComplete: 'Convert To Complete',
                convertToError: 'Convert To Error',
                convertToInProgress: 'Convert To In Progress',
                edit: 'Edit',
            },
        },
        files: {
            title: 'Manage Resource',
            action: {
                edit: 'Edit',
                add: 'Add',
            },
            fields:{
                file: 'Resource URL',
                name: 'Resource Name',
                fileURL: 'Resource URL',
                id: 'ID',
            }
        }
    },
    gameViewer: {
        fields: {
            orderId: 'Account ID',
            rulesLabel: 'I assume all responsibility for the information you provide',
            subDetails: 'More Information?'
        },
        importantNotes: 'Important Note',
        addToFavorite: 'Add Favorite',
        offer: 'Offer',
        selectCardType: 'Select Card Type',
        selectQuantity: 'Select Quantity',
        reviews: 'Reviews',
        buyNow: 'Buy Now',
        addToCart: 'Add To Cart',
        total: 'Total',
        selectOrderData: 'Select Order Data',
        credits: 'Credits',
        sold: 'Stock Out',
        totalPrice: 'Total Cost',
        details: 'Game Details',
        videoGame: 'Game Trailer',
        orderHistory: 'Order History',
        orderThanksMsg: 'Thanks for order, You can tracking order from',
        confirmOrder: 'Confirm Your Order',
        continue: 'Continue',
        orderMsgOne: 'Please verify the order details before continue, We are not responsible for the information you provided',
        noBalance: 'Your balance is not enough',
        failedMsg: 'Order Failed, Please try again later'
    },
    homeSettings: {
        addSection: 'Add New Section',
        ArText: 'Arabic Text',
        editConfig: 'Home Config',
        EnText: 'English Text',
        sectionConfig: 'Section Config',
        sections: 'Sections',
        mainText: 'Main Home Text',
        sectionDescription: 'Section Description',
        sectionTitle: 'Section Title',
        selectedGameCards: 'Selected Game Cards',
        selectedGames: 'Selected Games',
        specialDeals: 'Special Deals Section'
    }
};

export default ENGLISH_LANGUAGE;