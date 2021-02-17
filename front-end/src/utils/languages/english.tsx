import { LanguageBaseWords } from "../../lib/services/language-service";

const ENGLISH_LANGUAGE: LanguageBaseWords = {
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
        link: 'Link'
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
        resetPasswordFailedPleaseTryAgain: 'Change password failed, Please try again later'
    }
} as LanguageBaseWords;

export default ENGLISH_LANGUAGE;