import { LanguageSystemWords } from "../../models/language";

const ARABIC_LANGUAGE: LanguageSystemWords = {
    appName: 'GAMERS-DZ',
    basic: {
        yes: 'نعم',
        no: 'لا',
        save: 'حفظ',
        delete: 'حذف',
        cancel: 'ألغاء',
        show: 'أظهار',
        theme: 'الوضع',
        dark: 'اليلي',
        light: 'النهاري',
        noDataToView: 'لا يوجد اي معلومات',
        refresh: 'تحديث',
        pageSize: 'حجم صفحة',
        link: 'رابط',
        upload: 'تحميل',
        language: 'ألغة'
    },
    fields: {
        id: 'الرقم التسلسلي',
        name: 'ألاسم'
    },
    userFields: {
        email: 'ألبريد ألاكتروني',
        firstName: 'ألاسم الأول',
        lastName: 'الاسم ألاخير',
        userName: 'أسم المستخدم',
        fullName: 'ألاسم الكامل',
        dateJoined: 'تاريخ الدخول',
        isActive: 'مفعل',
        isStaff: 'موظف',
        phone: 'رقم الهاتف',
        city: 'المدينة',
        addressOne: 'العنوان الاول',
        addressTwo: 'العنوان الاخير',
        state: 'القرية',
        zip_code: 'رقم المدينة',
        verified: 'موثق',
        country: 'البلد',
        groups: 'المجموعات',
        permissions: 'الصلاحيات',
        password: 'كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        currentPassword: 'كلمة المرور الحالية',
        newPassword: 'كلمة المرور الجديدة'
    },
    authPages: {
        register: 'تسجيل مستخدم',
        login: 'تسجيل دخول',
        log: 'تسجيل',
        forgetPassword: 'أسترجاع كلمة المرور',
        reset: 'أعادة تعين',
        signInTo: 'تسجيل الدخول إلى',
        signIn: 'تسجيل الدخول',
        registerNow: 'مستخدم جديد؟ تسجيل الان',
        haveAccountLogin: 'هل لديك حساب؟ تسجيل دخول',
        sendResetCode: 'إعادة تعيين كلمة المرور',
        verify: 'التحقق من كود',
        changePassword: 'تغيير كلمة المرور',
        resetPassword: 'أعادة تعين كلمة المرور',
        verifyCode: 'رمز أعادة تعين'
    },
    validatorMessages: {
        required: 'هذا الحقل مطلوب من فضلك قم بادخاله.',
        email: 'هذا الحقل مدخل بشكل خطاء يجب ان يحتوي على بريد الكتروني'
    },
    errors: {
        verifyCodeLength: 'رمز أعادة تعين يتكون من 8 حروف',
        emailOrPasswordNotCorrect: 'كلمة المرور او أسم المستخدم غير صحيح',
        emailAlreadyUsed: 'البريد الالكتروني مستخدم فالفعل',
        emailNotUsed: 'البريد الالكتروني غير مستخدم',
        verifyCodeNotCorrect: 'رمز الاستعادة غير صحيح',
        passwordAndConfirmPassword: 'تاكيد كلمة المرور غير متطابق مع كلمة المرور',
        resetPasswordFailedPleaseTryAgain: 'عملية تغير كلمة المرور فشلت قم باعدة المحاولة لاحقا',
        currentPasswordError: 'هناك خطا في ادخال كلمة المرور الحاليه!'
    },
    messages: {
        profile: {
            changePassword: 'أعادة تعين كلمة المرور',
            changePasswordDescription: 'قم بتعين كلمة مرور تحتوي على رموز خاصه من دون تكرار مثل f%D21v1#*!a',
            generalSetting: 'ألعدادات العامة',
            generalSettingDescription: 'يمكنك تغير الغة و تفعيل الوضع اليلي!',
            userNameSetting: 'أعدادات المستخدم',
            userNameSettingDescription: 'قم بتغير معلوماتك الشخصيه ولكن استعمل معلوماتك الحقيقيه',
            passwordChangeSuccess: 'تم تغير كلمة المرور بنجاح'
        }
    }
} as LanguageSystemWords;

export default ARABIC_LANGUAGE;