import React, { useState } from 'react';
import './components.css';
import { AccessoryDTO } from "../../../models/game";
import { Image, Link } from "../../../lib/components/basic";
import { URL_ROUTES } from "../../../routes";
import { Label} from "semantic-ui-react";
import { costFormat } from "../../../lib/utils/utils";
import { EmbedGameDTO } from "../../../models/embed-game";
import { FlexBox } from "../../../lib/components/containers";
import { useLanguage } from "../../../lib/hooks/languageHook";
import NoImage from '../../../lib/assets/images/noImage.jpg';
import { getDealerPrice, getImageURL } from "../../../utils/util";

export function EmbedGameCard({game}: { game?: EmbedGameDTO }) {
	if (!game) {
		return null;
	}
	return (
		<Link to={ URL_ROUTES.EMBED_GAME_VIEWER + '/' + game.id } className={ 'embed-game-card' }>
			<div>
				<Image src={ getImageURL(game.logo) } width={ 135 }/>
			</div>
			<h4>{ game.name }</h4>
		</Link>
	)
}

export function AccessoryCard({accessory}: { accessory?: AccessoryDTO }) {
	const {words} = useLanguage();
	const [error, setError] = useState(false);
	if (!accessory) {
		return null;
	}
	return (
		<Link to={ URL_ROUTES.ACCESSORY_VIEWER + '/' + accessory.id } className={ 'accessory-card' }>
			<div>
				<div  className={ 'ac-img-container' }>
				<img
					alt={''}
					src={ accessory.logo && !error ? getImageURL(accessory.logo) : NoImage }
					onError={() => setError(true)}
				/>
				</div>
				{
					accessory.discount ? (
						<Label tag color={ 'purple' }>
							-{ costFormat(accessory.discount) }%
						</Label>
					) : null
				}
			</div>
			<FlexBox justifyContent={'space-between'} className={'accessory-card-info'}>
				<h5>{ accessory.name }</h5>
				<div>
					<h4>${ costFormat(getDealerPrice(accessory.price, accessory.dealer_price)) } US</h4>
					<h6>{ accessory.total_orders } { words.viewer.orders }</h6>
				</div>
			</FlexBox>
		</Link>
	)
}