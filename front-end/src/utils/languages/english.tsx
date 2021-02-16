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
    },
    validatorMessages: {
        required: 'This field required, Please enter it.',
        email: 'This filed not valid, Should be email.'
    }
} as LanguageBaseWords;

export default ENGLISH_LANGUAGE;