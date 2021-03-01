import { LanguageSystemWords } from "../../models/language";

const ARABIC_LANGUAGE: LanguageSystemWords = {
    appName: 'GAMERS-DZ',
    basic: {
        yes: 'نعم',
        no: 'لا',
        save: 'حفظ',
        ok: 'حسنا',
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
        add: 'أضافة',
        goTo: 'انتقال',
        view: 'أظهار',
        backToHome: 'الصفحة الرئيسية',
        notFound: 'العنصر غير متوفر'
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
        manageOrders: 'أدارة الطلبات',
        manageGames: 'أدارة الالعاب',
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
    },
    entities: {
        game: {
            title: 'إدارة الألعاب',
            actions: {
                edit: 'تعديل العبة',
                add: 'أضافة لعبة جديدة',
                editSubData: 'تعديل المعلومات الاضافية'
            },
            keys: {
                fileContent: 'معلومات الملف',
                addKeys: 'أضافة مفاتيح',
                saveGeneratedKeys: 'حفظ',
                viewKeys: 'مراجعة النتائج',
                fileFormat: 'ترتيب الملف',
                file: 'أختار الملف',
                fileFormatNote: 'ٌقم بازالة اي معلومات غير ضرورية'
            },
            fields: {
                name: 'ألاسم',
                game_type: 'النوع',
                country: 'البلد',
                card_name: 'أسم الشعار',
                type: 'نوع العرض',
                show: 'أظهار',
                platform: 'المنصه',
                notes: 'ملاحظات',
                about: 'حول',
                details: 'تفاصيل',
                video: 'رقم التسلسلي للفيديو',
                facebook: 'رابط الفيسبوك',
                website: 'رابط موقع الكتروني',
                youtube: 'رابط اليوتيوب',
                bg_card: 'غلاف الكارد',
                bg_cover: 'غلاف الداخلي',
                logo: 'الشعار',
            }
        },
        gameCard: {
            title: 'إدارة بطاقة اللعبة',
            actions: {
                edit: 'تعديل بطاقة العبة',
                add: 'أضافة بطاقة لعبة جديدة'
            },
            fields: {
                name: 'ألاسم',
                sold_flag: 'تم البيع',
                available: 'متوفر',
                is_sold: 'تم البيع',
                show: 'أظهار',
                total_price: 'السعر الكلي',
                price: 'السعر',
                discount: 'الخصم',
                max: 'الكمية القصوى',
                min: 'الكمية الدنيا',
                points: 'نقاط مكافأة',
                available_keys: 'المفاتيح المتوفرة',
                order_min: 'الحد الأدنى من الطلبات',
                order_max: 'الحد الاقصى من الطلبات',
            }
        },
        order: {
            account_id: 'رقم الحساب',
            compete_date: 'تاريخ أكمال الطلب',
            error_msg: 'معلومات اخطاء',
            extra_info: 'معلومات طلب اضافية',
            orderDate: 'تاريخ الطلب',
            ownerId: 'رقم المالك',
            ownerUsername: 'أسم المالك',
            quantity: 'الكمية',
            review_description: 'نص التقيم',
            review_star: 'نسبة التقيم',
            reviewDate: 'تاريخ التقيم',
            state: 'حالة الطلب',
            title: 'أدارة الطلبات',
            stateMap: {
                C: 'مكتمل',
                E: 'خطاء معلومات',
                I: 'قيد التنفيذ'
            },
            actions: {
                convertToComplete: 'تحويل الى مكتمل',
                convertToError: 'تحويل الى خطاء',
                convertToInProgress: 'تحويل الى قيد تنفيذ',
                edit: 'تعديل',
            },
        }
    },
    gameViewer: {
        fields: {
            orderId: 'رمز الحساب',
            rulesLabel: 'انا اتحمل كل المسؤولية عن المعلومات التي تقدمها',
            subDetails: 'معلومات أضافية؟'
        },
        importantNotes: 'ملاحظات هامة',
        addToFavorite: 'أضافة للمفضل',
        offer: 'خصم',
        selectCardType: 'أختار العرض',
        selectQuantity: 'أختار الكمية',
        reviews: 'التقيم',
        buyNow: 'أشتر الان',
        addToCart: 'أضافة الى السلة',
        total: 'المجموع الكلي',
        credits: 'نقاط',
        selectOrderData: 'أدخال معلومات الطلب',
        sold: 'تم البيع',
        orderMsgOne: 'يرجى التأكد من تفاصيل الطلب قبل الاكمال نحن لا اتحمل اي مسؤلية عن المعلومات المقدمة',
        details: 'تفاصيل',
        totalPrice: 'السعر الكلي',
        videoGame: 'عرض تقديمي للعبة',
        orderHistory: 'سجل الطلبات',
        orderThanksMsg: 'شكرًا على الطلب ، يمكنك تتبع الطلب من',
        confirmOrder: 'تأكيد الطلب الخاص بك',
        continue: 'أستمرار',
        noBalance: 'رصيدك لا يكفي',
        failedMsg: 'لقد فشل اكمال الطلب يرجى المحاولة فيما بعد'
    }
};

export default ARABIC_LANGUAGE;