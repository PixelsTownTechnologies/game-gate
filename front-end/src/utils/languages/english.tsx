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
        language: 'Language'
    },
    fields: {
        id: 'id',
        name: 'name'
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
    },
    authPages: {
        register: 'Register',
        login: 'Login',
        log: 'Login',
        forgetPassword: 'Forget Password',
        reset: 'Re-set',
        signInTo: 'Sign-in to',
        signIn: 'Sign-in',
        registerNow: 'New Member? Sign Up Now',
        haveAccountLogin: 'Already have an account? Sign-In',
        sendResetCode: 'Send Reset Password Email',
        verify: 'Verify Code',
        changePassword: 'Change Password',
        resetPassword: 'Reset Password',
        verifyCode: 'Verify Code'
    },
    validatorMessages: {
        required: 'This field required, Please enter it.',
        email: 'This filed not valid, Should be email.'
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
        }
    }
} as LanguageSystemWords;

export default ENGLISH_LANGUAGE;