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
		addressOne: 'العنوان',
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
		userHistory: 'السجل',
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
		profile: 'الملف الشخصي',
		games: 'العاب',
		accessories: 'ملحقات',
		embedGames: 'العاب مباشرة',
		topSells: 'الأكثر مبيعا',
		topOffers: 'أفضل العروض'
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
				is_sold: 'مباع',
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
			orderHistory: 'سجل الطلبات',
			account_id: 'رقم الحساب',
			orderId: 'رقم الطلب',
			ship_location: 'موقع التوصيل',
			key: 'المفتاح',
			ownerAddress: 'موقع المالك',
			download: 'تنزيل',
			compete_date: 'تاريخ أكمال الطلب',
			error_msg: 'معلومات اخطاء',
			extra_info: 'معلومات طلب اضافية',
			orderDate: 'تاريخ الطلب',
			ownerId: 'رقم المالك',
			ownerUsername: 'أسم المالك',
			quantity: 'الكمية',
			review_description: 'نص التقيم',
			review_star: 'نسبة التقيم',
			cost: 'السعر الكلي',
			reviewDate: 'تاريخ التقيم',
			state: 'حالة الطلب',
			title: 'أدارة الطلبات',
			stateMap: {
				C: 'مكتمل',
				E: 'خطاء معلومات',
				I: 'قيد التنفيذ'
			},
			actions: {
				review: 'تقيم',
				showKeys: 'أظهار المفاتيح',
				convertToComplete: 'تحويل الى مكتمل',
				convertToError: 'تحويل الى خطاء',
				convertToInProgress: 'تحويل الى قيد تنفيذ',
				edit: 'تعديل',
			},
			orderKeys: 'مفاتيح الطلب'
		},
		files: {
			title: 'إدارة الموارد',
			action: {
				edit: 'تعديل',
				add: 'أضافة',
			},
			fields: {
				file: 'الملف',
				name: 'أسم الملف',
				fileURL: 'رابط الملف',
				id: 'الرقم تسلسلي',
			}
		},
		user: {
			points: 'النقاط',
			numberOfOrders: 'عدد الطلبات'
		},
		accessory: {
			actions: {
				add: 'أضافة ملحق جديد',
				edit: 'نعديل الملحق'
			},
			title: 'إدارة الملحقات',
			fields: {
				name: 'ألاسم',
				shortDescription: 'نص توضيحي',
				type: 'النوع',
				details: 'تفاصيل',
				discount: 'الخصم',
				price: 'السعر',
				points: 'نقاط المكافئة',
				total_price: 'السعر الكلي',
				system_quantity: 'الكمية المتوفرة',
				video: 'معرف الفيديو',
				show: 'أظهار',
				sold_flag: 'مباع',
				is_sold: 'مباع',
				logo: 'الصورة الرئيسية',
				image1: 'خيار الصورة 1',
				image2: 'خيار الصورة 2',
				image3: 'خيار الصورة 3',
				image4: 'خيار الصورة 4',
			}
		},
		embedGames: {
			title: 'أدارة الالعاب الملحقه',
			actions: {
				add: 'أضافة لعبة جديده',
				edit: 'تعديل العبة',
			},
			fields: {
				name: 'الاسم',
				type: 'النوع',
				details: 'تفاصيل',
				src: 'عنوان العبة',
				video: 'رمز الفيديو',
				logo: 'شعار'
			},
		},
		ads: {
			action: {
				add: 'أضافة اعلان',
				edit: 'تعديل الاعلان'
			},
			fields: {
				cover: 'صورة الاعلان',
				external_link: 'رابط خارجي',
				forward_id: 'رقم العنصر',
				id: 'رقم التسلسلي',
				type: 'النوع',
				show: 'أظهار',
				name: 'الاسم'
			},
			title: 'أدارة الاعلانات'
		},
		pointShop: {
			shop: {
				noOffAvNBL: 'لا توجد عروض متاحة الآن عد لاحقًا',
				creditsAvailable: 'النقاط المتاحة',
				title: 'سوق النقاط',
				credits: 'نقطة',
				balance: 'رصيد',
				descriptionMsg: 'قم بتاكيد طلبك ومعلوماتك انت مسؤول عن كل ما يتم تقديمه وعن طلب شراء الخاص بك',
				headerMsg: 'قم بتأكيد طلبك'
			},
			title: 'أدارة سوق النقاط',
			actions: {
				add: 'أضافة عرض جديد',
				edit: 'تعديل العرض',
			},
			fields: {
				name: 'ألاسم',
				game_card: 'العبة المختارة',
				point_cost: 'السعر',
				quantity: 'الكمية',
				show: 'أظهار',
				money_reword: 'مكافاة المالية'
			}
		}
	},
	gameViewer: {
		fields: {
			orderId: 'رمز الحساب',
			rulesLabel: 'انا اتحمل كل المسؤولية عن المعلومات القدمه',
			subDetails: 'معلومات أضافية؟'
		},
		alreadyInCard: 'متوفر في سلتك',
		importantNotes: 'ملاحظات هامة',
		addToFavorite: 'أضافة للمفضل',
		isFavorite: 'مفضل',
		offer: 'خصم',
		inCartAlready: 'متوفر في سلتك',
		selectCardType: 'أختار العرض',
		selectQuantity: 'أختار الكمية',
		reviews: 'التقيم',
		buyNow: 'أشتر الان',
		addToCart: 'أضافة الى السلة',
		total: 'المجموع الكلي',
		credits: 'نقاط',
		selectOrderData: 'أدخال معلومات الطلب',
		sold: 'مباع',
		orderMsgOne: 'يرجى التأكد من تفاصيل الطلب قبل الاكمال نحن لا نتحمل اي مسؤولية عن المعلومات المقدمة',
		details: 'تفاصيل',
		totalPrice: 'السعر الكلي',
		videoGame: 'عرض تقديمي للعبة',
		orderHistory: 'سجل الطلبات',
		orderThanksMsg: 'شكرًا على الطلب ، يمكنك تتبع الطلب من',
		confirmOrder: 'تأكيد الطلب الخاص بك',
		continue: 'أستمرار',
		noBalance: 'رصيدك لا يكفي',
		failedMsg: 'لقد فشل اكمال الطلب يرجى المحاولة فيما بعد'
	},
	homeSettings: {
		addSection: 'إضافة قسم جديد',
		ArText: 'النص عربي',
		editConfig: 'أعدادات الصفحه الرئيسية',
		EnText: 'النص الانجليزي',
		sectionConfig: 'أعدادات القسم',
		sections: 'الاقسام',
		mainText: 'رسالة  الصفحه الرئيسية',
		sectionDescription: 'وصف القسم',
		sectionTitle: 'عنوان القسم',
		selectedGameCards: 'بطاقات ألعاب مختارة',
		selectedGames: 'ألعاب مختارة',
		specialDeals: 'قسم الصفقات الخاصة',
		dialogAds: 'أعلان الرائيسي',
		homeAds1: 'أعلان الصفحه الرئيسي 1',
		homeAds2: 'أعلان الصفحه الرئيسي 2',
		homeImages: 'صور الصفحه الرئيسي',
		image: 'الصورة',
		selectedResources: 'المصادر مختارة',
		accessorySection: 'قسم الملحقات',
		embedGameSection: 'قسم ألعاب المضمنة',
		selectedAccessory: 'الملحقات المختارة',
		selectedEmbedGames: 'ألعاب تضمين المختارة',
		homeVideoId: 'رمز فيديو الصفحة الرئيسية'
	},
	viewer: {
		reviews: 'التقييمات',
		orders: 'الطلبات',
		quantity: 'ألكمية',
		overView: 'نظرة عامة',
		phoneNumber: 'رقم الهاتف المحمول',
		selectedQuantity: 'الكمية المختارة',
		shipLocation: 'موقع التوصيل',
		shipLocation2: 'موقع التوصيل الفرعي',
		totalCost: 'السعر الكلي',
		totalEarnPoint: 'مجموع النقاط المكتسبة',
		shipLocationMessage: 'يرجى تقديم عنوانك ورقم هاتفك.',
		itemID: 'الرقم التسلسلي للعنصر',
		itemName: 'أسم العنصر',
		viewMore: 'أظهار المزيد',
		gameDescription: 'وصف العبة',
		accessoriesSimilar: 'منتجات ذات صلة',
		embedGameSimilar: 'تحقق من الألعاب ذات صلة',
		gameSimilar: 'تحقق من الألعاب ذات صلة'
	},
	searchViewer: {
		searchTitle: 'هل تحتاج مساعده؟',
		lookingForAccessory: 'تبحث عن اكسسوارات؟',
		lookingForGame: 'هل تبحث عن ألعاب؟',
		lookingForOnlineGame: 'هل تبحث عن ألعاب على الإنترنت؟',
		showMore: 'أظهار المزيد',
		noItemsFitSearch: 'آسف ، ولكن لا شيء يطابق شروط البحث الخاصة بك. أرجو المحاولة مرة أخرى بإستخدام كلمات أخرى.'
	},
	reviews: {
		amazing: 'إنه لأمر مدهش حقًا !! ، أنصح الجميع بشرائه',
		veryGood: 'جيدًا جدًا ، أنصح الجميع بشرائه',
		good: 'هذا جيد ، جربه',
		notBad: 'لم أحب ذلك كثيرا ، يمكنك تجربته',
		bad: 'إنه أمر سيء ، يمكنك تجربته',
		noReviews: 'لا يوجد تقييمات للعرض',
		gamesReviews: 'تقييمات العبة',
		accessoryReviews: 'تقييمات',
		userReviews: 'تقييمات المستخدمين',
		userReviewsSection: 'تتم كتابة المراجعات من قبل مستخدمين حقيقيين وفقط بعد إكمال الطلب. بالإضافة إلى البريد العشوائي ، لا يتم تحرير أو حذف أي مراجعات'
	},
	cart: {
		title: 'سلة المشتريات',
		totalCost: 'التكلفة الإجمالية',
		Games: 'قائمة الألعاب',
		needShipLocation: 'أدخل عنوان توصيل',
		checkout: 'أكمال الطلب',
		needAccountID: 'أدخل رمز الحساب',
		done: 'تم',
		cartIsEmpty: 'سلة الشراء الخاصة بك فارغة',
		gameNotAvailable: 'اللعبة غير متوفرة',
	},
	favorite: {
		title: 'العناصر المفضلة',
		emptyFavorite: 'ليس لديك اي عنصر مفضل',
	},
	footer: {
		fastAccess: 'وصول سريع',
		contacts: 'معلومات التواصل',
		rules: 'حقوق النشر © 2021 GAMERS-DZ. كل الحقوق محفوظة. جميع أسماء المنتجات هي علامات تجارية للشركات المالكة لها.',
		homePage: 'الصفحة الرئيسية',
		game:'ألعاب',
		accessories: 'ملحقات',
		playGameForFree: 'العب الألعاب مجانًا',
	}
};

export default ARABIC_LANGUAGE;