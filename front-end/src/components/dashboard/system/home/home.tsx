import './home.css';
import { Wrapper } from "../../../shared/wrapper";
import React, { useEffect, useState } from 'react';
import { Divider as SDivider, Embed, Image } from "semantic-ui-react";
import { Divider, FlexBox, FlexCenter, If } from "../../../../lib/components/containers";
import { useWindow } from "../../../../lib/hooks/screen-change";
import { EntityService } from "../../../../lib/services/entity-service/entity-service";
import { homeService } from "../../../../services/service-config";
import { AccessoryDTO, GameCardDTO, GameDTO } from "../../../../models/game";
import { GameCard, GameCardBig, ScrollCardView } from "../../../shared/games-components/games-components";
import { HomeDetails, HomeDTO } from "../../../../models/home-details";
import { useLoader } from "../../../../lib/hooks/generic";
import { useLanguage } from "../../../../lib/hooks/languageHook";
import { endPoint } from "../../../../constant";
import { buildCN, isEmpty, isNull, isUndefined } from "../../../../lib/utils/utils";
import Image1 from '../../../../assets/testing/images/image1.jpg';
import Image2 from '../../../../assets/testing/images/image2.jpg';
import Image3 from '../../../../assets/testing/images/image3.jpg';
import Image4 from '../../../../assets/testing/images/image4.jpg';
import Image5 from '../../../../assets/testing/images/image5.jpg';
import { AdsDTO } from "../../../../models/ads";
import { AdsBox } from "../../../shared/ads/ads";
import { AccessoryCard, EmbedGameCard } from "../../../shared/accessory/components";
import { URL_ROUTES } from "../../../../routes";
import { EmbedGameDTO } from "../../../../models/embed-game";
import { getImageURL } from "../../../../utils/util";
import { ReviewScrollCard } from "../../../shared/review/review-component";
import NoImage from '../../../../lib/assets/images/noImage.jpg';

function fetchHomeDetails(homeData: HomeDTO): HomeDetails {
	homeData?.ads.forEach(ad => {
		if (ad.cover && !ad.cover.includes('http')) {
			ad.cover = endPoint.dev.substr(0, endPoint.dev.length - 1) + ad.cover;
		}
	});
	const games = ( homeData?.games ? homeData.games : [] ).map(g => {
		return {
			...g,
			logo: getImageURL(g.logo),
			bg_card: getImageURL(g.bg_card),
			bg_cover: getImageURL(g.bg_cover),
		} as GameDTO;
	});
	const gameCards = ( homeData?.gameCards ? homeData?.gameCards : [] ).map(gc => {
		return {...gc, game: ( gc.game as any )?.id ? gc.game : games.filter(g => g.id === gc.game)?.[0]}
	}).filter(g => !!g.game);
	const accessories = homeData?.accessory ? homeData?.accessory : [];
	const embedGames = homeData?.embedGames ? homeData?.embedGames : [];
	const ads = homeData?.ads ? homeData?.ads : [];
	let homeConfigEnum: HomeDetails = homeData?.enums?.filter(e => e.name === 'Home Config')?.[0]?.values as any;
	homeConfigEnum = homeConfigEnum ? JSON.parse(homeConfigEnum as any) : null;
	if (homeConfigEnum) {
		if (homeConfigEnum.specialDeals && homeConfigEnum.specialDeals.games) {
			homeConfigEnum.specialDeals.games = ( homeConfigEnum.specialDeals.games as number[] )
				.map((gameID) => games?.filter(g => g.id === gameID)?.[0]).filter(r => !!r);
		}
		if (homeConfigEnum.specialDeals && homeConfigEnum.specialDeals.gameCards) {
			homeConfigEnum.specialDeals.gameCards = ( homeConfigEnum.specialDeals.gameCards as number[] )
				.map((gameID) => gameCards?.filter(g => g.id === gameID)?.[0]).filter(r => !!r);
		}
		if (homeConfigEnum?.sections) {
			homeConfigEnum.sections.forEach(sec => {
				if (sec.games) {
					sec.games = ( sec.games as number[] )
						.map((gameID) => games?.filter(g => g.id === gameID)?.[0]).filter(r => !!r) as any;
				}
				if (sec.gameCards) {
					sec.gameCards = ( sec.gameCards as number[] )
						.map((gameID) => gameCards?.filter(g => g.id === gameID)?.[0]).filter(r => !!r) as any;
				}
			})
		}
		if (homeConfigEnum.accessorySection && homeConfigEnum.accessorySection.accessories) {
			homeConfigEnum.accessorySection.accessories = ( homeConfigEnum.accessorySection.accessories as number[] )
				.map((eID) => accessories?.filter(e => e.id === eID)?.[0]).filter(r => !!r);
		}
		if (homeConfigEnum.embedGameSection && homeConfigEnum.embedGameSection.embedGames) {
			homeConfigEnum.embedGameSection.embedGames = ( homeConfigEnum.embedGameSection.embedGames as number[] )
				.map((eID) => embedGames?.filter(e => e.id === eID)?.[0]).filter(r => !!r);
		}
		homeConfigEnum.mainAds1 = ads.filter(ad => ad.id === homeConfigEnum.mainAds1)?.[0];
		homeConfigEnum.mainAds2 = ads.filter(ad => ad.id === homeConfigEnum.mainAds2)?.[0];
		homeConfigEnum.dialogAds = ads.filter(ad => ad.id === homeConfigEnum.dialogAds)?.[0];
		if (homeConfigEnum.mainImages) {
			homeConfigEnum.mainImages = homeConfigEnum.mainImages.map(img => {
				return !isEmpty(img)
					? (
						img.includes('http')
							? img : `${ endPoint.dev }${ img.slice(1, img.length) }`
					) : '';
			});
		}
		if (homeConfigEnum?.accessorySection?.accessories) {
			homeConfigEnum.accessorySection.accessories = ( homeConfigEnum.accessorySection.accessories as AccessoryDTO[] ).map(acc => {
				return {
					...acc, logo: (
						!isEmpty(acc.logo)
							? (
								acc.logo.includes('http')
									? acc.logo : `${ endPoint.dev }${ acc.logo.slice(1, acc.logo.length) }`
							) : ''
					)
				}
			});
		}
		if (homeConfigEnum?.embedGameSection?.embedGames) {
			homeConfigEnum.embedGameSection.embedGames = ( homeConfigEnum.embedGameSection?.embedGames as EmbedGameDTO[] ).map(acc => {
				return {
					...acc, logo: (
						!isEmpty(acc.logo)
							? (
								acc.logo.includes('http')
									? acc.logo : `${ endPoint.dev }${ acc.logo.slice(1, acc.logo.length) }`
							) : ''
					)
				}
			});
		}
	}
	return homeConfigEnum;
}


function ImageSlider(props: { images: any[] }) {
	const [ imageSelectedIndex, setImageSelectedIndex ] = useState(0);
	const [ intervalId, setIntervalId ] = useState<any>(null);
	const getImageIndex = () => {
		return imageSelectedIndex;
	}
	useEffect(() => {
		if (!intervalId) {
			setIntervalId(setInterval(() => {
				const nextIndex = ( ( getImageIndex() + 1 ) % props.images.length );
				setImageSelectedIndex(nextIndex);
			}, 5000) as any);
		}
		return () => {
			if (intervalId) {
				clearInterval(intervalId);
				setIntervalId(null);
			}
		}
		// eslint-disable-next-line
	}, [ props.images, imageSelectedIndex, intervalId ]);
	return (
		<div className={ 'image-slider-container' }>
			<Image
				className={'isc-img-animation'}
				src={ !isNull(imageSelectedIndex) &&
				!isUndefined(imageSelectedIndex) && !!props.images[imageSelectedIndex] ? props.images[imageSelectedIndex] : NoImage }/>
			<div className={ 'image-slider-control' } style={ {'--totalPoints': props.images.length} as any }>
				{
					props.images.map((image, index) => {
						return (
							<div
								className={ buildCN('image-s-point', index === imageSelectedIndex ? 'active' : '') }
								key={ index }
								onClick={ () => {
									setImageSelectedIndex(index);
								} }
							/>
						);
					})
				}
			</div>
		</div>
	);
}


function HomeSection1(props: { images?: any[], ads1?: AdsDTO, ads2?: AdsDTO }) {
	const defaultImages = [ Image1, Image2, Image3, Image4, Image5 ];
	const {width} = useWindow();
	return (
		<div className={ 'home-section1' }>
			<ImageSlider images={ !isEmpty(props.images) && props.images ? props.images : defaultImages }/>
			<If flag={ width > 970 }>
				<div>
					{
						props.ads1 ? (
							<AdsBox className={ 'home-s1-ads' } ads={ props.ads1 }/>
						) : null
					}
					<SDivider hidden/>
					{
						props.ads2 ? (
							<AdsBox className={ 'home-s1-ads' } ads={ props.ads2 }/>
						) : null
					}
				</div>
			</If>
		</div>
	);
}


function HomeSection2(props: {
	isMobile: boolean, list?: GameCardDTO[], dir: string,
	maxSpecialView: number, title?: string, description?: string
}) {
	if (!props.list || isEmpty(props.list)) {
		return null;
	}
	return (
		<div className={ 'h-border-container' }>
			<div className={ 'h-border-padding' }>
				<FlexBox dir={ props.dir } className={ 'home-h1 sec2-header' } flexDirection={ 'column' }
				         justifyContent={ !props.isMobile ? 'flex-start' : 'center' }
				         alignItems={ props.isMobile ? 'center' : undefined }>
					<h1 className={ 'sec2-text' }> { props.title ? props.title : '' } </h1>
					<h4 className={ 'sec2-text px-non-margin' }>{ props.description ? props.description : '' }</h4>
				</FlexBox>
				<SDivider hidden/>
				<FlexBox warp justifyContent={ 'center' }
				         alignItems={ 'center' }>
					{
						props.list ? props.list.slice(0, props.maxSpecialView).map((gameCard, index) => {
							return (
								<GameCard gameCard={ gameCard } game={ gameCard.game as GameDTO }
								          key={ index }/>
							);
						}) : null
					}
				</FlexBox>
			</div>
		</div>
	);
}


export function HomeWidget() {
	const {type} = useWindow();
	const language = useLanguage();
	const [ isHomeLoading, setHomeLoading ] = useState<boolean>(false);
	const [ errorLoading, setErrorLoading ] = useState<boolean>(false);
	const [ homeConfig, setHomeConfig ] = useState<HomeDetails | null>(null);
	const [ homeData, setHomeData ] = useState<HomeDTO | null>(null);
	const languageFlag = language.language.flag;
	const loader = useLoader();
	const isMobile = type === 'Mobile';
	useEffect(() => {
		if (!loader.isLoading && !isHomeLoading && !errorLoading) {
			loader.activate();
			new EntityService(homeService).find().then((data) => {
				const homeData: HomeDTO = data as any;
				if (homeData) {
					const homeConfigEnum = fetchHomeDetails(homeData);
					setHomeConfig(homeConfigEnum);
					setHomeData(homeData);
					setHomeLoading(true);
				} else {
					setErrorLoading(true);
				}
				loader.disabled();
			});
		}
		// eslint-disable-next-line
	}, []);
	return (
		<Wrapper loading={ loader.isLoading } className={ 'home home-bg' } hideTitle hideContainer>
			<div className={ 'white-bg px-sbp-50' }>
				<HomeSection1
					images={ homeConfig?.mainImages }
					ads1={ homeConfig?.mainAds1 as AdsDTO }
					ads2={ homeConfig?.mainAds2 as AdsDTO }
				/>
				<FlexCenter className={ 'h-border-container' } pxIf={ !!homeConfig?.homeVideo }>
					<Embed
						defaultActive={ false }
						className={ 'px-non-padding video-embed' }
						id={ homeConfig?.homeVideo }
						source='youtube'
					/>
				</FlexCenter>
			</div>
			<div className={ 'home-viewer-sections white-bg ' }>
				<If flag={ homeConfig }>
					<HomeSection2 dir={ language.dir } isMobile={ isMobile } maxSpecialView={ 250 }
					              title={ ( homeConfig?.specialDeals?.title as any )?.[languageFlag] }
					              description={ ( homeConfig?.specialDeals?.description as any )?.[languageFlag] as any }
					              list={ homeConfig?.specialDeals?.gameCards as GameCardDTO[] }/>
					<div className={ 'white-bg home-view-section' }>
						{
							homeConfig?.sections?.map((s, key) => {
								return (
									<div key={ key }>
										<ScrollCardView
											showMoreURL={ URL_ROUTES.SEARCH + '/game' }
											description={ ( s.description as any )?.[languageFlag] }
											title={ ( s.title as any )?.[languageFlag] }
											list={ [
												...( s?.games as GameDTO[] )?.map(g => {
													return (
														<GameCardBig key={ `game_${ g.id }` }
														             game={ g as GameDTO }/>
													)
												}),
												...( s?.gameCards as GameCardDTO[] )?.map(g => {
													return (
														<GameCardBig key={ `gameCard_${ g.id }` }
														             game={ g.game as GameDTO }
														             gameCard={ g as GameCardDTO }/>
													)
												}),
											]
											}
										/>
									</div>
								);
							})
						}
						{
							homeConfig?.accessorySection ?
								(
									<ScrollCardView
										showMoreURL={ URL_ROUTES.SEARCH + '/accessory' }
										description={ ( homeConfig?.accessorySection?.description as any )?.[languageFlag] }
										title={ ( homeConfig?.accessorySection?.title as any )?.[languageFlag] }
										list={
											( homeConfig?.accessorySection?.accessories as AccessoryDTO[] )?.map((acc, index) => {
												return (
													<AccessoryCard key={ index } accessory={ acc }/>
												);
											})
										}
									/>
								) : null
						}
						{
							homeConfig?.embedGameSection ?
								(
									<ScrollCardView
										showMoreURL={ URL_ROUTES.SEARCH + '/embed-game' }
										description={ ( homeConfig?.embedGameSection?.description as any )?.[languageFlag] }
										title={ ( homeConfig?.embedGameSection?.title as any )?.[languageFlag] }
										list={
											( homeConfig?.embedGameSection?.embedGames as EmbedGameDTO[] )?.map((game, index) => {
												return (
													<EmbedGameCard key={ index } game={ game }/>
												);
											})
										}
									/>
								) : null
						}
					</div>
					<div className={ 'h-border-container white-bg' }>
						<ReviewScrollCard
							title={ language.words.reviews.userReviews }
							description={ language.words.reviews.userReviewsSection }
							reviews={ homeData?.reviews.slice(0, 25) }
						/>
					</div>
				</If>
			</div>
		</Wrapper>
	);
}