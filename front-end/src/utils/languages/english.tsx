import { LanguageSystemWords } from "../../models/language";

const ENGLISH_LANGUAGE: LanguageSystemWords = {
    appName: 'GAMERS-DZ',
    basic: {
        yes: 'yes',
        no: 'no',
        save: 'save',
        delete: 'delete',
        cancel: 'cancel',
        show: 'show',
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
        add: 'Add'
    },
    fields: {
        id: 'id',
        name: 'name',
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
        manageEnums: 'Manage Enums',
        manageInvoice: 'Manage Invoice',
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
    }
} as LanguageSystemWords;

export default ENGLISH_LANGUAGE;