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
		addressOne: 'Address',
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
		profile: 'Profile',
		games: 'Games',
		accessories: 'Accessories',
		embedGames: 'Online Games',
		topSells: 'Top Selling',
		topOffers: 'Best Offers'
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
			orderId: 'Order ID',
			key: 'Key',
			ship_location: 'Ship Location',
			ownerAddress: 'Owner Address',
			download: 'Download',
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
			cost: 'Total Cost',
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
			fields: {
				file: 'Resource URL',
				name: 'Resource Name',
				fileURL: 'Resource URL',
				id: 'ID',
			}
		},
		user: {
			points: 'User Points',
			numberOfOrders: 'Total Orders'
		},
		accessory: {
			title: 'Manage Accessories',
			actions: {
				add: 'Add New Accessory',
				edit: 'Edit Accessory'
			},
			fields: {
				shortDescription: 'Short Description',
				name: 'Name',
				type: 'Type',
				details: 'Details',
				discount: 'Discount',
				price: 'Price',
				points: 'Reword Point',
				total_price: 'Total Price',
				system_quantity: 'Available Quantity',
				video: 'Video ID',
				show: 'Show',
				sold_flag: 'Is Sold',
				is_sold: 'Is Sold',
				logo: 'Main Image',
				image1: 'Image Option 1',
				image2: 'Image Option 2',
				image3: 'Image Option 3',
				image4: 'Image Option 4',
			}
		},
		embedGames: {
			title: 'Manage Embed Games',
			actions: {
				add: 'Add New Embed Games',
				edit: 'Edit Embed Games',
			},
			fields: {
				name: 'Name',
				type: 'Type',
				details: 'Details',
				src: 'Src URL',
				video: 'Video ID',
				logo: 'Logo'
			},
		},
		ads: {
			action: {
				add: 'Add New Ad',
				edit: 'Edit Ad'
			},
			fields: {
				cover: 'Ad Cover',
				external_link: 'External Link',
				forward_id: 'Forward ID',
				id: 'ID',
				type: 'Type',
				show: 'Show',
				name: 'Name'
			},
			title: 'Manage Ads'
		},
		pointShop: {
			shop: {
				noOffAvNBL: 'No Offers Available Now Back Later',
				title: 'Points Shop',
				creditsAvailable: 'Credits Available',
				balance: 'Balance',
				credits: 'Credits',
				descriptionMsg: 'Confirm your order and information You are responsible for everything submitted and for your purchase order',
				headerMsg: 'Confirm Your Order'
			},
			title: 'Manage Point Shop',
			actions: {
				add: 'Add Point Card',
				edit: 'Edit Point Card',
			},
			fields: {
				name: 'Name',
				game_card: 'Game Card',
				point_cost: 'Price In Point',
				quantity: 'Quantity',
				show: 'Show',
				money_reword: 'Money Reword'
			}
		}
	},
	gameViewer: {
		fields: {
			orderId: 'Account ID',
			rulesLabel: 'I assume all responsibility for the information you provide',
			subDetails: 'More Information?'
		},
		alreadyInCard: 'Already In Cart',
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
		isFavorite: 'Favorite',
		inCartAlready: 'In Cart',
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
		specialDeals: 'Special Deals Section',
		dialogAds: 'Dialog Ads',
		homeAds1: 'Home Main ads 1',
		homeAds2: 'Home Main ads 2',
		homeImages: 'Home Images',
		image: 'Image',
		selectedResources: 'Selected Resources',
		accessorySection: 'Accessory Section',
		embedGameSection: 'Embed Games Section',
		selectedAccessory: 'Selected Accessories',
		selectedEmbedGames: 'Selected Embed Games',
		homeVideoId: 'Home Video ID'
	},
	viewer: {
		reviews: 'Reviews',
		orders: 'Orders',
		quantity: 'Quantity',
		overView: 'OVERVIEW',
		phoneNumber: 'Phone Number',
		selectedQuantity: 'Selected Quantity',
		shipLocation: 'Ship Location',
		shipLocation2: 'Ship Location 2',
		totalCost: 'Total Cost',
		totalEarnPoint: 'Total Earn Points',
		shipLocationMessage: 'Please provide your address and phone number.',
		itemID: 'Item ID',
		itemName: 'Item Name',
		viewMore: 'View More',
		gameDescription: 'GAME DESCRIPTION',
		accessoriesSimilar: 'Check Similar Accessories',
		embedGameSimilar: 'Check Similar Games',
		gameSimilar: 'Check Similar Games'
	},
	searchViewer: {
		searchTitle: 'Looking for Help?',
		lookingForAccessory: 'Looking For Accessories',
		lookingForGame: 'Looking For Games',
		lookingForOnlineGame: 'Looking For Online Games',
		showMore: 'Show More',
		noItemsFitSearch: 'Sorry, but nothing matched your search terms. Please try again with some different keywords.'
	},
	reviews: {
		amazing: 'Will it\'s really amazing!! I advise everyone to buy it',
		veryGood: 'Will it\'s Very Good, I advise everyone to buy it',
		good: 'Will it\'s Good, Try it',
		notBad: 'I don\'t like it so much',
		bad: 'It\'s bad, left you can try it',
		noReviews: 'No Reviews To Shows',
		gamesReviews: 'Game Reviews',
		accessoryReviews: 'Accessory Reviews',
		userReviews: 'Users Reviews',
		userReviewsSection: 'Reviews are written by real users and only after a completed order. Besides spam, no reviews are edited or deleted'
	},
	cart: {
		title: 'My Cart',
		totalCost: 'Total Cost',
		Games: 'Games List',
		needShipLocation: 'Enter Ship Location',
		needAccountID: 'Enter Account ID',
		checkout: 'Checkout Orders',
		done: 'Done',
		cartIsEmpty: 'Your Cart Empty',
		gameNotAvailable: 'Game Not Available',
	},
	favorite: {
		title: 'Favorite Games',
		emptyFavorite: 'You don\'t have any item' ,
	},
	footer: {
		fastAccess: 'Fast Access',
		contacts: 'Contacts',
		rules: 'Copyright © 2021 GAMERS-DZ. All rights reserved. All product names are trademarks of their respective companies.',
		homePage: 'Home Page',
		game:'Games',
		accessories:'Accessories',
		playGameForFree: 'Play Games For Free',
	}
};

export default ENGLISH_LANGUAGE;