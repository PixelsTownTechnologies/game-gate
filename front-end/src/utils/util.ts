import { HomeDTO } from "../models/home-details";
import { isEmpty } from "../lib/utils/utils";
import { endPoint } from "../constant";
import { getUser } from "../lib/store/actions/user";
import { UserDTO } from "../models/user";

export function getImageURL(image?: any) {
	return !isEmpty(image)
		? (
			image.includes('http')
				? image : `${ endPoint.dev }${ image.slice(1, image.length) }`
		) : null;
}


export function manipulateHomeData(data: HomeDTO): HomeDTO {
	if (data?.embedGames) {
		data.embedGames = data?.embedGames.map(eg => {
			return {...eg, logo: getImageURL(eg.logo)};
		});
	}
	if (data?.ads) {
		data.ads = data?.ads.map(eg => {
			return {...eg, cover: getImageURL(eg.cover)};
		});
	}
	if (data?.games) {
		data.games = data?.games.map(eg => {
			return {
				...eg,
				logo: getImageURL(eg.logo),
				bg_cover: getImageURL(eg.bg_cover),
				bg_card: getImageURL(eg.bg_card),
			};
		});
	}
	if (data?.gameCards) {
		data.gameCards = data?.gameCards.map(eg => {
			return {...eg, game: ( eg.game as any )?.id ? eg.game : data?.games?.filter(g => g.id === eg.game)?.[0]};
		})
	}
	if (data?.accessory) {
		data.accessory = data?.accessory.map(eg => {
			return {...eg, logo: getImageURL(eg.logo)};
		});
	}
	return data;
}

export function getDealerPrice(price: number, dealerPrice: number): number {
	const user = getUser() as UserDTO;
	if (user && user.id && user.dealer && !!dealerPrice) {
		return dealerPrice;
	}
	return price;
}