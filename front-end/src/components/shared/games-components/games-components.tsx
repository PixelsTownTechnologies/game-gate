import { Button, Button as SButton, Divider, Icon, Image, Label } from "semantic-ui-react";
import React from "react";
import { GameCardDTO, GameDTO } from "../../../models/game";
import './games-components.css';
import { Link } from "../../../lib/components/basic";
import { URL_ROUTES } from "../../../routes";
import { FlexBox, FlexCenter, FlexSpace, If } from "../../../lib/components/containers";
import { buildCN, costFormat, isEmpty } from "../../../lib/utils/utils";
import Logo from '../../../assets/logo/logo-bg-w.jpg';
import { ImageCard } from "../game-viewer-component/game-viewer-component";
import { DIR } from "../../../lib/utils/constant";
import { useLanguage } from "../../../lib/hooks/languageHook";

export function GameCard(props: { gameCard?: GameCardDTO, game: GameDTO }) {
	const style = props.game.bg_card ? {'--headerBGImageURL': `url(${ props.game.bg_card })`} : {};
	return (
		<Link to={ URL_ROUTES.GAME_VIEWER + '/' + props.game.id + ( props.gameCard ? `/${ props.gameCard.id }` : '' ) }>
			<div className={ 'vvg vvg-container' }>
				<div style={ style as any } className={ 'vvg-header-container' }>
					<div className={ 'vvg-index vvg-logo' }>
						<Image src={ props.game.logo ? props.game.logo : Logo }/>
					</div>
					<div className={ 'vvg-index vvg-name' }>
						<h5 className={ 'text-w px-non-margin' }>{ props.gameCard?.name ? props.gameCard.name : props.game.name }</h5>
					</div>
				</div>
				<If flag={ !!props.gameCard }>
					<div className={ 'vvg-price-container' }>
						<div className={ 'price-discount-s' }>
							<h5 className={ buildCN(!!props.gameCard?.discount ? 'line-price' : null, 'text-b px-non-margin') }>
								${ costFormat(props.gameCard ? props.gameCard.price : 0) }
							</h5>
							<If flag={ !!props.gameCard?.discount }>
								<h5 className={ 'text-b px-non-margin' }> ${ costFormat(props.gameCard ? props.gameCard.total_price : 0) } </h5>
							</If>
						</div>
						<div>
							<If flag={ !!props.gameCard?.discount }>
								<Label className={ 'text-w game-discount-l' } color='purple' tag>
									-{ props.gameCard?.discount }%
								</Label>
							</If>
						</div>
					</div>
				</If>
			</div>
		</Link>
	);
}


export function GameCardBig(props: { gameCard?: GameCardDTO, game: GameDTO }) {
	return (
		<Link to={ URL_ROUTES.GAME_VIEWER + '/' + props.game.id + ( props.gameCard ? `/${ props.gameCard.id }` : '' ) }>
			<div className={ 'gcv-container' }>
				<ImageCard
					className={ 'gcv-card-box' }
					logo={ props.game.logo ? props.game.logo : Logo }
					title={ props.game.card_name }
				/>
				<div className={ 'gcv-name-box' }>
					<h5 className={ 'text-b px-non-margin' }>{ props.gameCard?.name ? props.gameCard.name : props.game.name }</h5>
				</div>
			</div>
		</Link>
	);
}


export function ScrollCardView(props: {
	list?: any[], title?: string,
	description?: string, showMoreURL?: string, textClassName?: string, buttonClassName?: string
}) {
	const sectionRef = React.useRef<HTMLDivElement>(null);
	const language = useLanguage();
	if (isEmpty(props.list) || isEmpty(props.list?.filter(v => !!v))) {
		return null;
	}
	return (
		<div className={ 'scroll-card-view-box' }>
			<FlexBox dir={ language.dir } flexDirection={ 'column' }
			         justifyContent={ 'flex-start' }>
				<FlexSpace dir={ language.dir }>
					<h1 className={ props.textClassName ? props.textClassName : 'grey-text' }> { props.title ? props.title : '' } </h1>
					{
						props.showMoreURL ? (
							<Link to={ props.showMoreURL }>
								<SButton inverted={ !!props.textClassName } className={ 'view-more-button' }
								         basic> { language.words.viewer.viewMore } </SButton>
							</Link>
						) : null
					}
				</FlexSpace>
				<Divider hidden/>
				{
					props.description ?
						<h4 className={ props.textClassName ? props.textClassName : 'grey-text px-non-margin' }>  { props.description } </h4>
						: null
				}
			</FlexBox>
			<Divider hidden/>
			<div dir={ DIR.LTR } ref={ sectionRef } className={ 'scroll-card-view-container' }>
				{
					props.list
				}
			</div>
			<FlexCenter className={ 'cv-button-box' }>
				<div/>
				<Divider horizontal className={ props.textClassName ? props.textClassName : '' }>
					<Button.Group basic size='small' className={ 'cv-scroll-button' }>
						<Button
							className={ 'px-lib' } color={ 'orange' } icon
							onClick={
								() => {
									if (sectionRef.current) {
										sectionRef.current.scrollBy({behavior: 'smooth', left: -250});
									}
								}
							}>
							<Icon name='angle left'/>
						</Button>
						<Button
							className={ 'px-lib' } color={ 'orange' } icon
							onClick={
								() => {
									if (sectionRef.current) {
										sectionRef.current.scrollBy({behavior: 'smooth', left: 250});
									}
								}
							}>
							<Icon name='angle right'/>
						</Button>
					</Button.Group>
				</Divider>
			</FlexCenter>
		</div>
	);
}
