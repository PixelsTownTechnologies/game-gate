import React from 'react';
import { connect } from "react-redux";
import { HomeDTO } from "../../../../models/home-details";
import { manipulateHomeData } from "../../../../utils/util";
import { UserDTO } from "../../../../models/user";
import { GameDTO } from "../../../../models/game";
import { Wrapper } from "../../../shared/wrapper";
import { useLanguage } from "../../../../lib/hooks/languageHook";
import { isEmpty } from "../../../../lib/utils/utils";
import { FlexCenter } from "../../../../lib/components/containers";
import { GameCardBig } from "../../../shared/games-components/games-components";

interface FavoritePageProps {
	user: UserDTO;
	games: GameDTO[];
}

function FavoritePage(props: FavoritePageProps) {
	const {words, dir} = useLanguage();
	const gamesToShow: GameDTO[] = ( props?.user?.favorite_data && props.games
		? props?.user?.favorite_data.map(id => props.games?.filter(g => g.id === id)?.[0]) : [] ).filter(game => !!game);
	return (
		<Wrapper
			icon={ 'heart' }
			title={ words.favorite.title }
			className={ 'search-container' }
		>
			{
				!gamesToShow || isEmpty(gamesToShow) ? (
					<div className={ 'center-not-found' }>
						<FlexCenter>
							<h1> { words.cart.cartIsEmpty }</h1>
						</FlexCenter>
					</div>
				): (
					<div className={ 'game-viewer-ss game-cards' }>
						{
							gamesToShow.map(g => {
								return <GameCardBig key={ g.id } game={ g }/>;
							})
						}
					</div>
				)
			}
		</Wrapper>
	);
}

export default connect((state: any, ownProps: any) => {
	const home: ( HomeDTO | null ) = state.entity['home'] ? manipulateHomeData(state.entity['home'] as HomeDTO) : null;
	return {...ownProps, user: state.user, games: home?.games ? home.games : []};
})(FavoritePage as any);
