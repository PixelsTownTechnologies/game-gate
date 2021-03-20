import './ads.css';
import React, { useEffect, useState } from 'react';
import { AdsDTO } from "../../../models/ads";
import { Link } from "../../../lib/components/basic";
import { URL_ROUTES } from "../../../routes";
import { HomeDetails, HomeDTO } from "../../../models/home-details";
import { getEnumFromList, isEmpty } from "../../../lib/utils/utils";
import StorageService from "../../../lib/services/storage-service";
import { Dimmer, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { StoreState } from "../../../lib/models/application";
import { getImageURL } from "../../../utils/util";


export function buildAdsURL(ads?: AdsDTO) {
	if (!ads) {
		return '';
	}
	if (ads.type === 'external') {
		return ads.external_link;
	}
	if (ads.type === 'Game') {
		return `${ URL_ROUTES.GAME_VIEWER }/${ ads.forward_id }`
	}
	if (ads.type === 'Accessory') {
		return `${ URL_ROUTES.ACCESSORY_VIEWER }/${ ads.forward_id }`
	}
	return '';
}

export function AdsBox({ads, className}: { ads?: AdsDTO, className?: string }) {
	return (
		<Link className={ className } to={ buildAdsURL(ads) } out={ ads?.type === 'external' }>
			<img alt={ '' } src={ ads?.cover }/>
		</Link>
	);
}

function AdsDialogClass(props: { home: HomeDTO }) {
	const [ showAds, setShowAds ] = useState(false);
	const [ selectedAds, setSelectedAds ] = useState<AdsDTO | null>(null);
	useEffect(() => {
		if (props.home && !isEmpty(props.home.ads)) {
			setTimeout(() => {
				const adsRefreshRate = getEnumFromList(props.home.enums, 'Ads Refresh Rate')?.data;
				const homeConfig = getEnumFromList(props.home.enums, 'Home Config')?.values;
				let dialogAds = null;
				if (homeConfig) {
					const dialogAdsId = ( JSON.parse(homeConfig) as HomeDetails ).dialogAds;
					dialogAds = props.home.ads.filter(ad => dialogAdsId === ad.id)?.[0];
				}
				const lastAdsTimestamp = StorageService.load('lastAdsTimestamp');
				const lastAdsShows = StorageService.load('lastAdsShows');
				if (lastAdsTimestamp) {
					if (( Math.abs(Number(lastAdsTimestamp) - Date.now()) / 1000 ) > ( adsRefreshRate ? Number(adsRefreshRate) : ( 60 * 10 ) )) {
						const adsListIds = props.home.ads.map(ad => ad.id).filter(id => !lastAdsShows || id !== lastAdsShows);
						if (adsListIds.length > 0) {
							const nextAdsIndex = Math.floor(Math.random() * adsListIds.length);
							const selectedAds = props.home.ads.filter(ad => ad.id === adsListIds[nextAdsIndex])?.[0];
							setSelectedAds(dialogAds ? dialogAds : selectedAds);
							StorageService.store('lastAdsTimestamp', Date.now());
							StorageService.store('lastAdsShows', selectedAds ? selectedAds.id : 0);
							setShowAds(true);
						}
					}
				} else {
					const adsListIds = props.home.ads.map(ad => ad.id).filter(id => !lastAdsShows || id !== lastAdsShows);
					if (adsListIds.length > 0) {
						const nextAdsIndex = Math.floor(Math.random() * adsListIds.length);
						const selectedAds = props.home.ads.filter(ad => ad.id === adsListIds[nextAdsIndex])?.[0];
						setSelectedAds(dialogAds ? dialogAds : selectedAds);
						StorageService.store('lastAdsTimestamp', Date.now());
						StorageService.store('lastAdsShows', selectedAds ? selectedAds.id : 0);
						setShowAds(true);
					}
				}
			}, 500);
		}
	}, [ props.home ]);
	if (!showAds || !props.home || isEmpty(props.home.ads) || !selectedAds || !selectedAds?.cover) {
		return null;
	}
	const coverURL = getImageURL(selectedAds?.cover);
	return (
		<Dimmer
			active={ showAds }
			page
		>
			<div className={ 'dialog-ads-container' }>
				<Icon name={ 'close' } className={ 'dialog-ads-close-button' } onClick={ () => {
					setShowAds(false);
					setSelectedAds(null);
				} }/>
				<Link className={ 'dialog-ads' } to={ buildAdsURL(selectedAds) }
				      out={ selectedAds?.type === 'external' }>
					<img alt={ '' } src={ coverURL }/>
				</Link>
			</div>
		</Dimmer>
	);
}

export const AdsDialog = connect((state: StoreState, ownProps) => {
	return {...ownProps, home: state?.entity?.['home']};
})(AdsDialogClass);
