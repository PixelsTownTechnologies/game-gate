import { LanguageBaseWords } from "../lib/services/language-service";

export interface LanguageSystemWords extends LanguageBaseWords {
	errors: {
		verifyCodeLength: string;
		emailOrPasswordNotCorrect: string;
		emailAlreadyUsed: string;
		emailNotUsed: string;
		verifyCodeNotCorrect: string;
		passwordAndConfirmPassword: string;
		resetPasswordFailedPleaseTryAgain: string;
		currentPasswordError: string;
	};
	messages: {
		profile: {
			changePassword: string;
			changePasswordDescription: string;
			generalSetting: string;
			generalSettingDescription: string;
			userNameSetting: string;
			userNameSettingDescription: string;
			passwordChangeSuccess: string;
		};
		menu: {
			lookingHelp: string;
		};
	};
	title: {
		manageUsers: string;
		manageEnums: string;
		manageInvoice: string;
		manageGames: string;
		manageOrders: string;
		dashboard: string;
		userHistory: string;
		actions: {
			editUser: string;
			addUser: string;
			setBalance: string;
			addBalance: string;
			removeBalance: string;
			permissions: string;
			editEnums: string;
			changePermissions: string;
		};
	};
	invoice: {
		action: string;
		amount: string;
		details: string;
		userName: string;
		action_date: string;
		action_time: string;
		userId: string;
		actionTypes: {
			A: string;
			R: string;
			S: string;
			P: string;
		};
	};
	menu: {
		profile: string;
		games: string;
		accessories: string;
		embedGames: string;
		topSells: string;
		topOffers: string;
	};
	entities: {
		game: {
			title: string;
			actions: {
				edit: string;
				editSubData: string;
				add: string;
			};
			keys: {
				fileContent: string;
				addKeys: string;
				viewKeys: string;
				saveGeneratedKeys: string;
				fileFormat: string;
				file: string;
				fileFormatNote: string;
			};
			fields: {
				name: string;
				game_type: string;
				type: string;
				platform: string;
				card_name: string;
				country: string;
				notes: string;
				show: string;
				about: string;
				details: string;
				video: string;
				facebook: string;
				website: string;
				youtube: string;
				bg_card: string;
				bg_cover: string;
				logo: string;
			}
		};
		gameCard: {
			title: string;
			actions: {
				edit: string;
				add: string;
			};
			fields: {
				name: string;
				sold_flag: string;
				available: string;
				is_sold: string;
				show: string;
				total_price: string;
				price: string;
				discount: string;
				max: string;
				min: string;
				points: string;
				available_keys: string;
				order_min: string;
				order_max: string;
			}
		};
		order: {
			title: string;
			orderHistory: string;
			orderKeys: string;
			key: string;
			download: string;
			ownerAddress: string;
			actions: {
				review: string;
				edit: string;
				showKeys: string;
				convertToError: string;
				convertToComplete: string;
				convertToInProgress: string;
			};
			stateMap: {
				I: string;
				C: string;
				E: string;
			};
			ship_location: string;
			ownerId: string;
			orderId: string;
			ownerUsername: string;
			orderDate: string;
			compete_date: string;
			account_id: string;
			extra_info: string;
			error_msg: string;
			state: string;
			quantity: string;
			reviewDate: string;
			review_star: string;
			review_description: string;
			cost: string;
		};
		files: {
			title: string;
			action: {
				edit: string;
				add: string;
			};
			fields: {
				file: string;
				name: string;
				id: string
				fileURL: string;
			}
		};
		user: {
			points: string;
			numberOfOrders: string;
		};
		accessory: {
			title: string;
			actions: {
				add: string;
				edit: string;
			};
			fields: {
				name: string;
				type: string;
				shortDescription: string;
				details: string;
				discount: string;
				price: string;
				points: string;
				total_price: string;
				system_quantity: string;
				video: string;
				show: string;
				sold_flag: string;
				is_sold: string;
				logo: string;
				image1: string;
				image2: string;
				image3: string;
				image4: string;
			};
		};
		embedGames: {
			title: string;
			actions: {
				add: string;
				edit: string;
			};
			fields: {
				name: string;
				type: string;
				details: string;
				src: string;
				video: string;
				logo: string;
			};
		};
		ads: {
			title: string;
			action: {
				edit: string;
				add: string;
			};
			fields: {
				cover: string;
				external_link: string;
				id: string
				forward_id: string;
				type: string;
				show: string;
				name: string;
			}
		};
		pointShop: {
			title: string;
			actions: {
				add: string;
				edit: string;
			};
			fields: {
				name: string;
				game_card: string;
				point_cost: string;
				quantity: string;
				show: string;
				money_reword: string;
			};
		};
	};
	gameViewer: {
		fields: {
			orderId: string;
			rulesLabel: string;
			subDetails: string;
		};
		importantNotes: string;
		addToFavorite: string;
		offer: string;
		totalPrice: string;
		selectOrderData: string;
		selectCardType: string;
		selectQuantity: string;
		reviews: string;
		buyNow: string;
		addToCart: string;
		total: string;
		credits: string;
		sold: string;
		details: string;
		videoGame: string;
		orderHistory: string;
		orderThanksMsg: string;
		confirmOrder: string;
		continue: string;
		noBalance: string;
		failedMsg: string;
		orderMsgOne: string;
	};
	homeSettings: {
		editConfig: string;
		addSection: string;
		sectionTitle: string;
		sectionDescription: string;
		selectedGames: string;
		selectedGameCards: string;
		sections: string;
		sectionConfig: string;
		ArText: string;
		EnText: string;
		mainText: string;
		specialDeals: string;
		homeImages: string;
		image: string;
		homeAds1: string;
		homeAds2: string;
		dialogAds: string;
		selectedResources: string;
		embedGameSection: string;
		selectedEmbedGames: string;
		accessorySection: string;
		selectedAccessory: string;
		homeVideoId: string;
	};
	viewer: {
		reviews: string;
		orders: string;
		quantity: string;
		overView: string;
		selectedQuantity: string;
		shipLocation: string;
		shipLocation2: string;
		totalCost: string;
		totalEarnPoint: string;
		phoneNumber: string;
		shipLocationMessage: string;
		itemID: string;
		itemName: string;
		viewMore: string;
		gameDescription: string;
		embedGameSimilar: string;
		gameSimilar: string;
		accessoriesSimilar: string;
	};
	searchViewer: {
		lookingForGame: string;
		lookingForOnlineGame: string;
		lookingForAccessory: string;
		showMore: string;
		searchTitle: string;
		noItemsFitSearch: string;
	};
	reviews: {
		amazing: string;
		veryGood: string;
		good: string;
		notBad: string;
		bad: string;
		noReviews: string;
		gamesReviews: string;
		accessoryReviews: string;
		userReviews: string;
		userReviewsSection: string;
	};
}