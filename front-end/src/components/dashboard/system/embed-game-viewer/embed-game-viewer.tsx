import './embed-game-viewer.css';
import React, { useEffect, useState } from "react";
import { BaseRouteComponentProps } from "../../../../lib/components/components";
import { EntityService } from "../../../../lib/services/entity-service/entity-service";
import { systemEmbedGamesService } from "../../../../services/service-config";
import { useLoader } from "../../../../lib/hooks/generic";
import { isEmpty, isNull, searchOnValue } from "../../../../lib/utils/utils";
import { EmbedGameDTO } from "../../../../models/embed-game";
import { Wrapper } from "../../../shared/wrapper";
import { NotFoundWidget } from "../../../errors/not-found-404";
import { connect } from "react-redux";
import { StoreState } from "../../../../lib/models/application";
import { HomeDTO } from "../../../../models/home-details";
import { AdsDTO } from "../../../../models/ads";
import { FlexBox } from "../../../../lib/components/containers";
import { Image } from "../../../../lib/components/basic";
import { Divider as SDivider, Embed } from "semantic-ui-react";
import MDEditor from "@uiw/react-md-editor";
import { useLanguage } from "../../../../lib/hooks/languageHook";
import { AdsBox } from "../../../shared/ads/ads";
import { ScrollCardView } from "../../../shared/games-components/games-components";
import { URL_ROUTES } from "../../../../routes";
import { EmbedGameCard } from "../../../shared/accessory/components";
import { useWindow } from "../../../../lib/hooks/screen-change";

function EmbedGameWidget({game, adsList, similarGames}: { game: EmbedGameDTO, adsList: AdsDTO[], similarGames: EmbedGameDTO[] }) {
	const {words} = useLanguage();
	const {isMobile} = useWindow();
	const now = Date.now() / 100000000;
	const random1 = Math.random() * 667;
	const random2 = Math.random() * 713;
	const adsToView = adsList.sort(() => ( Math.random()
		* now * ( Math.floor(Math.random()) > 0 ? random1 : random2 ) ) - ( Math.random() * now * ( Math.floor(Math.random()) > 0 ? random1 : random2 ) ))
		.slice(0, 3);
	return (
		<FlexBox flexDirection={ 'column' }>
			<div className={ 'em-viewer-container' }>
				<iframe title={'game'} src={ game.src }/>
			</div>
			<div className={ 'eg-info-container white-bg' }>
				<FlexBox padding={ 20 } flexDirection={ 'column' }>
					<FlexBox flexDirection={ 'row' } justifyContent={ isMobile ? 'center' : undefined }
					         alignItems={ isMobile ? 'center' : undefined }>
						<Image src={ game.logo } width={ 80 }/>
						<FlexBox className={ 'px-slp-10' } flexDirection={ 'column' }
						         justifyContent={ isMobile ? 'center' : undefined }
						         alignItems={ isMobile ? 'center' : undefined }>
							<h1 className={ 'px-non-margin grey-text' }> { game.name }</h1>
							<h3 className={ 'px-non-margin grey-text' }> { game.type }</h3>
						</FlexBox>
					</FlexBox>
					<SDivider hidden/>
					<SDivider hidden/>
					<SDivider hidden/>
					<FlexBox
						flexDirection={ 'column' }>
						<h1 className={ 'px-non-margin grey-text' }> { words.viewer.gameDescription } </h1>
						<FlexBox padding={ 20 }
						         flexDirection={ 'column' }>
							<SDivider hidden/>
							<MDEditor.Markdown source={ game.details }/>
							<SDivider hidden/>
							<Embed
								className={ 'px-non-padding video-embed' }
								id={ game.video }
								source='youtube'
							/>
						</FlexBox>
					</FlexBox>
					<SDivider hidden/>
				</FlexBox>
				{
					adsList ? (
						<FlexBox className={ 'ads-section' } flexDirection={ 'column' }>
							{
								adsToView.map(ad => {
									return <AdsBox key={ ad.id } ads={ ad }/>;
								})
							}
						</FlexBox>
					) : null
				}
			</div>
			<div className={ 'scroll-card-view-section white-bg em-viewer-container' }>
				{
					!isEmpty(similarGames) ?
						(
							<ScrollCardView
								showMoreURL={ URL_ROUTES.SEARCH + '/embed-game' }
								title={ words.viewer.embedGameSimilar }
								list={
									similarGames?.map((game, index) => {
										return (
											<EmbedGameCard key={ index } game={ game }/>
										);
									})
								}
							/>
						) : null
				}
			</div>
		</FlexBox>
	);
}

interface EmbedGameProps extends BaseRouteComponentProps {
	ads: AdsDTO[];
	embedGames: EmbedGameDTO[];
}

function EmbedGame(props: EmbedGameProps) {
	const gameId: number | null = props.match.params.gameId
	&& !isNaN(Number(props.match.params.gameId)) ? Number(props.match.params.gameId) : null;
	const service = new EntityService<EmbedGameDTO>(systemEmbedGamesService);
	const [ game, setGame ] = useState<EmbedGameDTO | null>(null);
	const loader = useLoader();
	const [ isNotFoundPage, setNotFoundPage ] = useState<boolean>(isNull(gameId));
	const fetchEntity = () => {
		loader.activate();
		service.findById(gameId).then((data) => {
			if (data) {
				setGame(data);
			} else {
				setNotFoundPage(true);
			}
			loader.disabled();
		})
	}
	let similarGames = props.embedGames && game ?
		props.embedGames.filter(eg => {
			return (
				eg.id !== game.id &&(
				eg.type === game.type
				|| searchOnValue(eg.name, game.name)
				|| searchOnValue(eg.type, game.name)
				|| searchOnValue(eg.details, game.name)
				|| searchOnValue(eg.name, game.type)
				|| searchOnValue(eg.details, game.name)
				)
			)
		})
		: [];
	if (similarGames.length < 12 && ( props.embedGames.length - similarGames.length ) > 0 && game) {
		const similarGamesIds = similarGames.map(eg => eg.id);
		const otherUnSimilarGames = props.embedGames.filter(eg => eg.id !== game.id).filter(eg => !similarGamesIds.includes(eg.id));
		similarGames = [ ...similarGames, ...otherUnSimilarGames.slice(0, ( 12 - similarGames.length )) ];
	}
	useEffect(() => {
		if (gameId !== game?.id) {
			setGame(null);
			setNotFoundPage(false);
			setTimeout(() => {
				fetchEntity();
			}, 50);
		}
		// eslint-disable-next-line
	}, [ gameId ])
	useEffect(() => {
		if (!game && !isNotFoundPage) {
			fetchEntity();
		}
		// eslint-disable-next-line
	}, []);
	return (
		<Wrapper
			loading={ loader.isLoading }
			hideContainer
			fitContainer={ false }
			hideTitle
		>
			{
				isNotFoundPage && !loader.isLoading ? (
					<div className={ 'center-not-found' }>
						<NotFoundWidget/>
					</div>
				) : null
			}
			{
				game ? (
					<EmbedGameWidget similarGames={ similarGames } adsList={ isEmpty(props.ads) ? [] : props.ads }
					                 game={ game }/>
				) : null
			}
		</Wrapper>
	);
}

export default connect((state: StoreState, props) => {
	const home: ( HomeDTO | null ) = state.entity['home'] ? ( state.entity['home'] as HomeDTO ) : null;
	return {...props, ads: home ? home.ads : [], embedGames: home ? home.embedGames : []};
})(EmbedGame);