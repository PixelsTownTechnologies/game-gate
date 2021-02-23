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
        language: 'ألغة',
        search: 'بحث',
        edit: 'تعديل',
        add: 'أضافة'
    },
    fields: {
        id: 'الرقم التسلسلي',
        name: 'ألاسم',
        value: 'ألقيمة'
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
        newPassword: 'كلمة المرور الجديدة',
        balance: 'الرصيد'
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
        verifyCode: 'رمز أعادة تعين',
        logout: 'تسجيل خروج',
        signUp: 'أنشاء مستخدم',
        welcomeMsg: 'مرحبا بك في',
    },
    validatorMessages: {
        required: 'هذا الحقل مطلوب من فضلك قم بادخاله.',
        email: 'هذا الحقل مدخل بشكل خطاء يجب ان يحتوي على بريد الكتروني'
    },
    serviceErrors: {
        invalidId: 'خطاء في الرقم التسلسلي',
        generalFailed: 'حدث خطاء اثناء الرسال, حاول مره اخرى فيما بعد.'
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
        },
        menu: {
            lookingHelp: 'هل تريد اي نساعدة'
        }
    },
    title: {
        manageUsers: 'أدارة المستخدمين',
        manageEnums: 'أدارت متغيرات النظام',
        manageInvoice: 'أدارة الفواتير',
        dashboard: 'لوحة التحكم',
        actions: {
            editUser: 'تعديل معلومات المستخدم',
            addUser: 'تعديل معلومات المستخدم',
            editEnums: 'تعديل متغيرات النظام',
            setBalance: 'تعديل الرصيد',
            addBalance: 'أضافة الرصيد',
            removeBalance: 'سحب الرصيد',
            permissions: 'الصلاحيات',
            changePermissions: 'تعديل صلاحيات المستخدم'
        }
    },
    invoice: {
        action: 'العملية',
        amount: 'ألكمية',
        details: 'تفاصيل',
        userName: 'أسم المستخدم',
        userId: 'رقم المستخدم',
        action_date: 'تاريخ العملية',
        action_time: 'توقيت العملية',
        actionTypes: {
            A: 'أضافة رصيد',
            R: 'سحب رصيد',
            S: 'تعديل رصيد',
            P: 'شراء'
        }
    },
    menu: {
        profile: 'الملف الشخصي'
    }
} as LanguageSystemWords;

export default ARABIC_LANGUAGE;