import React, { useEffect, useState } from 'react';
import './search.css';
import { Wrapper } from "../../../shared/wrapper";
import { useLanguage } from "../../../../lib/hooks/languageHook";
import { HomeDTO } from "../../../../models/home-details";
import { useLoader } from "../../../../lib/hooks/generic";
import { EntityService } from "../../../../lib/services/entity-service/entity-service";
import { homeService } from "../../../../services/service-config";
import { manipulateHomeData } from "../../../../utils/util";

import { Button, Divider as SDivider, Header, Input } from "semantic-ui-react";
import { BaseRouteComponentProps } from "../../../../lib/components/components";
import { AccessoryDTO, GameCardDTO, GameDTO, platformTypeStateToPlatform } from "../../../../models/game";
import { EmbedGameDTO } from "../../../../models/embed-game";
import { isEmpty, searchOnObject } from "../../../../lib/utils/utils";
import { GameCardBig } from "../../../shared/games-components/games-components";
import { AccessoryCard, EmbedGameCard } from "../../../shared/accessory/components";
import { FlexBox, TitleView } from "../../../../lib/components/containers";

export function SearchOnItem(props: BaseRouteComponentProps
) {
	const type: string | null = props.match?.params?.type;
	const defaultSearchValue = props.location.search?.split('?search=')?.[1]?.split('%20').join(' ').trim();
	const isGameType = type === 'game' || !type;
	const isEmbedGameType = type === 'embed-game' || !type;
	const isAccessoryType = type === 'accessory' || !type;
	const {words} = useLanguage();
	const [ isHomeLoading, setHomeLoading ] = useState<boolean>(false);
	const [ errorLoading, setErrorLoading ] = useState<boolean>(false);
	const [ searchValue, setSearchValue ] = useState<string>(defaultSearchValue ? defaultSearchValue : '');
	const [ searchBoxValue, setBoxSearchValue ] = useState<string>(defaultSearchValue ? defaultSearchValue : '');
	const [ homeData, setHomeData ] = useState<HomeDTO | null>(null);
	const [ numberOfItemInGame, setNumberItemInGame ] = useState(6);
	const [ numberOfItemInAccessories, setNumberItemInAccessories ] = useState(5);
	const [ numberOfItemInEmbedGame, setNumberItemInEmbedGame ] = useState(7);
	const loader = useLoader();
	useEffect(() => {
		if (searchValue !== defaultSearchValue) {
			setSearchValue(defaultSearchValue);
			setBoxSearchValue(defaultSearchValue);
			setNumberItemInGame(6);
			setNumberItemInAccessories(5);
			setNumberItemInEmbedGame(7);
		}
		if (!loader.isLoading && !isHomeLoading && !errorLoading) {
			loader.activate();
			new EntityService(homeService).find().then((data) => {
				const homeData: HomeDTO = data as any;
				if (homeData) {
					setHomeData(manipulateHomeData(homeData));
					setHomeLoading(true);
				} else {
					setErrorLoading(true);
				}
				loader.disabled();
			});
		}
	});
	const getGames = (): GameDTO[] => {
		if (isGameType && homeData?.games) {
			const searchText = searchValue ? searchValue.toLowerCase() : null;
			return searchText ? homeData.games.filter(g => ( g.platform ? platformTypeStateToPlatform[g.platform] : false ) ||
				searchOnObject(g, [ 'type', 'details', 'name', 'notes', 'platform' ], searchText)
			) : homeData.games;
		}
		return [];
	}
	const getGameCards = (): GameCardDTO[] => {
		if (isGameType && homeData?.gameCards) {
			return searchValue ? homeData.gameCards.filter(g => searchOnObject(g, [ 'name' ], searchValue)) : homeData.gameCards;
		}
		return [];
	}
	const getAccessories = (): AccessoryDTO[] => {
		if (isAccessoryType && homeData?.accessory) {
			return searchValue ? homeData.accessory.filter(a => searchOnObject(a, [ 'name', 'details', 'short_description', 'type' ], searchValue))
				: homeData.accessory;
		}
		return [];
	}
	const getEmbedGames = (): EmbedGameDTO[] => {
		if (isEmbedGameType && homeData?.embedGames) {
			return searchValue ? homeData.embedGames.filter(g => searchOnObject(g, [ 'name', 'type', 'details' ], searchValue)) : homeData.embedGames;
		}
		return [];
	}
	let totalGamesList = 0;
	let totalAccessories = 0;
	let totalEmbedGames = 0;
	let games = getGames();
	totalGamesList += games.length;
	games = games.slice(0, numberOfItemInGame);
	let gameCards = getGameCards();
	totalGamesList += gameCards.length;
	gameCards = gameCards.slice(0, ( numberOfItemInGame - games.length ) > 0 ? ( numberOfItemInGame - games.length ) : 0);
	let accessories = getAccessories();
	totalAccessories = accessories.length;
	accessories = accessories.slice(0, numberOfItemInAccessories);
	let embedGames = getEmbedGames();
	totalEmbedGames = embedGames.length;
	embedGames = embedGames.slice(0, numberOfItemInEmbedGame);
	return (
		<Wrapper
			loading={ loader.isLoading }
			icon={ 'search' }
			title={ words.searchViewer.searchTitle }
			className={ 'search-container' }
			subTitleChildren={
				<Input
					placeholder={ words.basic.search }
					onChange={ (e) => setBoxSearchValue(e.target.value) }
					className={ 'ss-search-input' }
					icon='search'
					value={ searchBoxValue ? searchBoxValue : '' }
					onKeyPress={ (e: any) => {
						if (e.key === 'Enter') {
							setSearchValue(searchBoxValue);
						}
					} }
				/>
			}
		>
			{
				isEmpty(embedGames) && isEmpty(games) && isEmpty(gameCards) && isEmpty(accessories) && !loader.isLoading && isHomeLoading ? (
					<Header> { words.searchViewer.noItemsFitSearch } </Header>
				) : null
			}
			<FlexBox flexDirection={ 'column' } padding={ 10 }>
				<FlexBox flexDirection={ 'column' }>
					{
						( !isEmpty(accessories) || !isEmpty(embedGames) ) && ( !isEmpty(games) || !isEmpty(gameCards) ) ? (
							[
								<SDivider key={ 1 } hidden/>,
								<TitleView key={ 2 } title={ words.searchViewer.lookingForGame }/>
							]
						) : null
					}
					<div className={ 'game-viewer-ss game-cards' }>
						{
							!isEmpty(games) ? (
								games.map(g => {
									return <GameCardBig key={ g.id } game={ g }/>;
								})
							) : null
						}
						{
							!isEmpty(gameCards) ? (
								gameCards.map(gc => {
									return <GameCardBig key={ gc.id } game={ gc.game as GameDTO } gameCard={ gc }/>
								})
							) : null
						}
					</div>
					{
						( !isEmpty(games) || !isEmpty(gameCards) ) && ( totalGamesList > numberOfItemInGame ) ? (
							<Button
								className={ 'show-more-button-ss' }
								basic color={ 'grey' }
								onClick={ () => setNumberItemInGame(numberOfItemInGame + 6) }
							>
								{ words.searchViewer.showMore }
							</Button>
						) : null
					}
				</FlexBox>
				<FlexBox flexDirection={ 'column' }>
					{
						( !isEmpty(games) || !isEmpty(gameCards) ) && !isEmpty(accessories) ? (
							[
								<SDivider key={ 1 } hidden/>,
								<TitleView key={ 2 } title={ words.searchViewer.lookingForAccessory }/>
							]
						) : null
					}
					<div className={ 'game-viewer-ss accessory' }>
						{
							!isEmpty(accessories) ? (
								accessories.map(g => {
									return <AccessoryCard key={ g.id } accessory={ g }/>;
								})
							) : null
						}
					</div>
					{
						!isEmpty(accessories) && ( totalAccessories > numberOfItemInAccessories ) ? (
							<Button
								className={ 'show-more-button-ss' }
								basic color={ 'grey' }
								onClick={ () => setNumberItemInAccessories(numberOfItemInAccessories + 4) }
							>
								{ words.searchViewer.showMore }
							</Button>
						) : null
					}
				</FlexBox>
				<FlexBox flexDirection={ 'column' }>
					{
						( !isEmpty(accessories) || !isEmpty(games) || !isEmpty(gameCards) ) && !isEmpty(embedGames) ? (
							[
								<SDivider key={ 1 } hidden/>,
								<TitleView key={ 2 } title={ words.searchViewer.lookingForOnlineGame }/>
							]
						) : null
					}
					
					<div className={ 'game-viewer-ss embed-games' }>
						{
							!isEmpty(embedGames) ? (
								embedGames.map(g => {
									return <EmbedGameCard key={ g.id } game={ g }/>;
								})
							) : null
						}
					</div>
					{
						!isEmpty(embedGames) && ( totalEmbedGames > numberOfItemInEmbedGame ) ? (
							<Button
								className={ 'show-more-button-ss' }
								basic color={ 'grey' }
								onClick={ () => setNumberItemInEmbedGame(numberOfItemInEmbedGame + 6) }
							>
								{ words.searchViewer.showMore }
							</Button>
						) : null
					}
				</FlexBox>
			</FlexBox>
		</Wrapper>
	);
}
