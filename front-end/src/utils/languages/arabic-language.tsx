import { LanguageBaseWords } from "../../lib/services/language-service";

const ARABIC_LANGUAGE: LanguageBaseWords = {
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
        link: 'رابط'
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
    }
} as LanguageBaseWords;

export default ARABIC_LANGUAGE;