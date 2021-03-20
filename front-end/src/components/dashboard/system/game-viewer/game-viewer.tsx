import React, { useEffect, useState } from 'react';
import './game-viewer.css';
import { BaseRouteComponentProps } from "../../../../lib/components/components";
import { useLanguage } from "../../../../lib/hooks/languageHook";
import { Wrapper } from "../../../shared/wrapper";
import { Divider, FlexBox, FlexCenter, If, Map } from "../../../../lib/components/containers";
import { NotFoundWidget } from "../../../errors/not-found-404";
import { buildCN, clamp, costFormat, isNull } from "../../../../lib/utils/utils";
import { ImageCard, OrderConfirm } from "../../../shared/game-viewer-component/game-viewer-component";
import { GameCardDTO, GameDTO, gameTypes, platformTypeStateToPlatform } from "../../../../models/game";
import { EntityService } from "../../../../lib/services/entity-service/entity-service";
import { systemGameService, userOrderService } from "../../../../services/service-config";
import { useLoader } from "../../../../lib/hooks/generic";
import { useWindow } from "../../../../lib/hooks/screen-change";
import {
	Button,
	Checkbox,
	Dimmer,
	Divider as SDivider,
	Embed,
	Form,
	Header,
	Icon,
	Image,
	Label, Rating
} from "semantic-ui-react";
import { useFavorite } from "../../../../hooks/storage";
import Countries from '../../../../assets/icons/countries.png';
import { Counter, TextArea, TextField } from "../../../../lib/components/form/fields";
import MDEditor from '@uiw/react-md-editor';
import { useEntityStore } from "../../../../lib/hooks/user";
import { UserBaseDTO } from "../../../../lib/models/user";
import { isUserAuthenticate } from "../../../../lib/utils/application-helper";
import { LoginWidget } from "../../user/auth";
import UserFacadeService from "../../../../lib/services/facade-service/user-facade-service";
import TokenService from "../../../../lib/services/token-service";
import { registerUser, updateUser } from "../../../../lib/store/actions/user";
import Logo from '../../../../assets/logo/logo-bg-w.jpg';
import { ReviewScrollCard } from "../../../shared/review/review-component";

interface GameViewerWidgetProps {
	game: GameDTO | null;
	gameCardId: number | null;
	onPay: () => void;
}

export function GameCardWidget({logo, isSelected, onSelect, gameCard}: {
	logo: any,
	isSelected: boolean, onSelect: () => void,
	gameCard: GameCardDTO
}) {
	const {words, dir} = useLanguage();
	return (
		<div className={ buildCN('g-card', isSelected ? 'active' : null, gameCard.is_sold ? 'sold' : null) }
		     onClick={ onSelect }>
			<If flag={ gameCard.discount && !gameCard.is_sold }>
				<Label dir={ dir } className={ 'gc-offer' } color='red' ribbon={ 'right' }>
					{ words.gameViewer.offer } { gameCard.discount }%
				</Label>
			</If>
			<If flag={ gameCard.is_sold }>
				<Label dir={ dir } className={ 'gc-offer' } color={ 'grey' } ribbon={ 'right' }>
					{ words.gameViewer.sold }
				</Label>
			</If>
			<div className={ 'image-s-box' }>
				<Image src={ logo ? logo : Logo }/>
			</div>
			<div className={ 'g-card-info' }>
				<h5 className={ 'gc-name' }>{ gameCard.name }</h5>
				<h5 className={ 'gc-price' }>$ { costFormat(gameCard.total_price) }</h5>
			</div>
		</div>
	);
}

export function GameViewerWidget({game, gameCardId, onPay}: GameViewerWidgetProps) {
	const {isFavorite, addToFavorite, removeFromFavorite} = useFavorite();
	const [ isInFavorite, setInFavorite ] = useState<boolean>(isFavorite(game ? game.id : 0));
	const urlGame = game?.game_cards?.filter(gc => gc.id === gameCardId)?.[0];
	const [ selectedCard, setSelectedCard ] = useState(urlGame && !urlGame.is_sold ? urlGame : undefined);
	const [ selectedQuantity, setSelectedQuantity ] = useState(urlGame && !urlGame.is_sold ? urlGame.order_min : 0);
	const [ orderDataForm, setOrderDataForm ] = useState({id: '', subDetails: '', accepted: false});
	const [ showLogin, setShowLogin ] = useState(false);
	const [ showPaymentConfirm, setShowPaymentConfirm ] = useState(false);
	const [ showNoBalance, setShowNoBalance ] = useState(false);
	const [ orderId, setOrderId ] = useState<number | undefined>(undefined);
	const user = useEntityStore<UserBaseDTO>('user');
	const {words, dir} = useLanguage();
	const {width, type} = useWindow();
	useEffect(() =>{
		if(selectedCard?.id !== gameCardId){
			const newUrlGame = game?.game_cards?.filter(gc => gc.id === gameCardId)?.[0];
			if(!newUrlGame?.is_sold) {
				setSelectedCard(!newUrlGame?.is_sold ? newUrlGame : undefined);
				setSelectedQuantity(!newUrlGame?.is_sold && newUrlGame?.order_min? newUrlGame.order_min : 0);
			}
		}
		// eslint-disable-next-line
	}, [gameCardId])
	if (!game) {
		return null;
	}
	const handleBuyNow = () => {
		if (selectedCard && game) {
			if (user && isUserAuthenticate()) {
				const quantity = game?.type === gameTypes.Keys ? selectedQuantity : 1;
				const totalPrice = selectedCard.total_price * quantity;
				if (user.balance >= totalPrice) {
					setShowPaymentConfirm(true);
				} else {
					setShowNoBalance(true);
				}
			} else {
				setShowLogin(true);
			}
		}
	};
	const onAcceptOrder = async () => {
		if (selectedCard && game && user && isUserAuthenticate()) {
			const quantity = game?.type === gameTypes.Keys ? selectedQuantity : 1;
			const totalPrice = selectedCard.total_price * quantity;
			const account_id = orderDataForm?.id;
			const extra_info = orderDataForm?.subDetails;
			const game_card_id = selectedCard.id;
			const data = await new EntityService(userOrderService).createEntity(
				{
					account_id,
					quantity,
					extra_info,
					game_card_id
				});
			if (data) {
				await new EntityService(userOrderService).reload().then();
				setOrderId(data.id);
				updateUser({balance: user.balance - totalPrice} as any);
			}
			return !!data;
		}
		return null;
	};
	const handleAddToCard = () => {
		if (isUserAuthenticate()) {
		
		} else {
			setShowLogin(true);
		}
	};
	const handleSingIn = async (form: any) => {
		const data = await UserFacadeService.login(form, true);
		if (data) {
			setTimeout(() => {
				TokenService.saveToken(data.token);
				registerUser(data.user);
			}, 200);
			return {pass: true};
		}
		return {pass: false};
	}
	return (
		<FlexBox flexDirection={ 'column' } justifyContent={ 'flex-start' }>
			<FlexBox padding={ clamp(10, width * 0.10, 60) }
			         justifyContent={ type !== 'Computer' ? 'center' : undefined } className={ 'max-width white-bg' }
			         alignItems={ 'center' } warp>
				<ImageCard logo={ game.logo } title={ game.card_name }/>
				<div className={ 'gv t-info' }>
					<FlexBox justifyContent={ 'space-between' }>
						<div>
							<Header as={ 'h2' }>{ game.name }</Header>
							<div className={ 'status-info' }>
								<Header as={ 'h5' }>
									<Image className={ 'countries-icon' } src={ Countries }/>
									{ game.country ? game.country : 'Global' }
								</Header>
								<Header as={ 'h5' }>
									<Icon name={ 'gamepad' }/>
									{ game.platform ? platformTypeStateToPlatform[game.platform] : 'Global' }
								</Header>
							</div>
							<div className={ 'game-rating-section' }>
								<Rating maxRating={ 5 } disabled defaultRating={ game.review_stars + 0.5 }
								        icon='star'
								        size='large'/>
								<Header as={ 'h4' }>{ game.review_stars ? costFormat(game.review_stars) : '0.0' }</Header>
								<Header as={ 'h4' }>{ game.total_reviews } { words.viewer.reviews }</Header>
								<Header as={ 'h4' }>{ game.total_orders } { words.viewer.orders }</Header>
							</div>
							{
								game.notes ? (
									<p className={ 'import-notes' }>
										{ words.gameViewer.importantNotes }: <span
										className={ 'red-text' }>{ game.notes }</span>
									</p>
								) : null
							}
						</div>
						<div>
							<Button onClick={ () => {
								if (isFavorite(game ? game.id : 0)) {
									removeFromFavorite(game.id);
									setInFavorite(false);
								} else {
									addToFavorite(game.id);
									setInFavorite(true);
								}
							} } circular={ type !== 'Computer' } icon={ type !== 'Computer' } inverted toggle
							        active={ isInFavorite || isFavorite(game ? game.id : 0) } color='red'>
								<Icon name='heart'/>
								{ type !== 'Computer' ? null : words.gameViewer.addToFavorite }
							</Button>
						</div>
					</FlexBox>
				</div>
			</FlexBox>
			<FlexBox className={ 'white-bg' } padding={ clamp(10, width * 0.10, 60) } justifyContent={ 'center' }
			         alignItems={ type === 'Mobile' ? 'center' : undefined }
			         flexDirection={ 'column' }>
				<Header color={ 'grey' } as={ 'h3' }>{ words.gameViewer.selectCardType }</Header>
				<FlexBox className={ 'full-width' } justifyContent={ 'center' } warp>
					<div className={ 'game-card-c' }>
						<Map list={ game.game_cards
							? game.game_cards.filter(gc => gc.show).sort(
								(a, b) => a.price - b.price) : [] }
						     mapper={ (row: GameCardDTO) => {
							     return <GameCardWidget
								     key={ row.id }
								     isSelected={ row.id === selectedCard?.id }
								     gameCard={ row }
								     logo={ game?.logo }
								     onSelect={ () => {
									     if (row.available && !row.is_sold && row.show) {
										     setShowNoBalance(false);
										     setSelectedCard(game?.game_cards?.filter(gc => gc.id === row.id)?.[0]);
										     setSelectedQuantity(game?.game_cards?.filter(gc => gc.id === row.id)?.[0]?.order_min)
									     }
								     } }
							     />
						     } }
						/>
					</div>
					<div className={ 'total-card' }>
						<FlexBox justifyContent={ 'space-between' }>
							<h3>{ words.gameViewer.total }</h3>
							<div>
								<h3
									className={ 'gc-price px-non-margin' }
								>
									$ { costFormat(selectedCard ? selectedCard.total_price * selectedQuantity : 0) }
								</h3>
								<h5
									className={ 'gc-credits px-non-margin' }
								>
									{ words.gameViewer.credits } { selectedCard ? selectedCard.points * selectedQuantity : 0 }
								</h5>
							</div>
						</FlexBox>
						<If flag={ showNoBalance }>
							<h5 dir={ dir } className={ 'red-text' }> { words.gameViewer.noBalance } </h5>
						</If>
						<Divider/>
						<div className={ 'total-card-button' }>
							<Button disabled={ ( game.type === gameTypes.Charging
								&& ( !orderDataForm.accepted || ( !orderDataForm.id
									|| orderDataForm.id.length < 4 ) ) ) || !selectedCard } color='google plus'
							        onClick={ () => {
								        const isDisabled = ( game.type === gameTypes.Charging
									        && ( !orderDataForm.accepted || ( !orderDataForm.id
										        || orderDataForm.id.length < 4 ) ) ) || !selectedCard;
								        if (!isDisabled) {
									        handleBuyNow();
								        }
							        } }>
								{ words.gameViewer.buyNow }
							</Button>
							<Button
								onClick={ () => {
									if (selectedCard) {
										handleAddToCard();
									}
								} }
								disabled={ !selectedCard } color='facebook'>
								{ words.gameViewer.addToCart }
							</Button>
						</div>
					</div>
				</FlexBox>
			</FlexBox>
			<If flag={ game.type === gameTypes.Keys }>
				<FlexBox padding={ clamp(10, width * 0.10, 30) } justifyContent={ 'center' }
				         alignItems={ 'center' }
				         className={ 'white-bg' }
				         flexDirection={ 'column' }>
					<Header color={ 'grey' } as={ 'h3' }>{ words.gameViewer.selectQuantity }</Header>
					<FlexCenter>
						<div className={ 'counter-c' }>
							<Counter
								min={ selectedCard ? selectedCard.order_min : 1 }
								max={ selectedCard ? selectedCard.order_max : 10 }
								value={ selectedQuantity }
								onChange={ (count: any) => {
									setSelectedQuantity(count);
								} }
							/>
						</div>
					</FlexCenter>
				</FlexBox>
			</If>
			<If flag={ game.type === gameTypes.Charging }>
				<FlexBox padding={ clamp(10, width * 0.10, 60) } justifyContent={ 'center' }
				         className={ 'white-bg' }
				         alignItems={ type === 'Mobile' ? 'center' : undefined }
				         flexDirection={ 'column' }>
					<Header color={ 'grey' } as={ 'h3' }>{ words.gameViewer.selectOrderData }</Header>
					<FlexBox
						alignItems={ type === 'Mobile' ? 'center' : undefined }
						justifyContent={ type === 'Mobile' ? 'center' : undefined }
						className={ 'full-width' }
					>
						<div className={ 'order-info-box' }>
							<Form>
								<Form.Field>
									<label>{ words.gameViewer.fields.orderId }</label>
									<TextField
										onChange={ (value) => {
											setOrderDataForm({...orderDataForm, id: value});
										} }
										value={ orderDataForm.id }
									/>
								</Form.Field>
								<Form.Field>
									<label>{ words.gameViewer.fields.subDetails }</label>
									<TextArea
										onChange={ (value) => {
											setOrderDataForm({...orderDataForm, subDetails: value});
										} }
										value={ orderDataForm.subDetails }
									/>
								</Form.Field>
								<Form.Field>
									<Checkbox
										label={ words.gameViewer.fields.rulesLabel }
										checked={ orderDataForm.accepted }
										onChange={ () => {
											setOrderDataForm({...orderDataForm, accepted: !orderDataForm.accepted});
										} }
									/>
								</Form.Field>
							</Form>
						</div>
					</FlexBox>
				</FlexBox>
			</If>
			<FlexBox className={ 'white-bg' } padding={ clamp(10, width * 0.10, 60) } justifyContent={ 'center' }
			         alignItems={ type === 'Mobile' ? 'center' : undefined }
			         flexDirection={ 'column' }>
				<FlexBox justifyContent={ 'center' } alignItems={ 'center' }
				         flexDirection={ 'column' }>
					<Header color={ 'grey' } as={ 'h3' }>{ words.gameViewer.details }</Header>
				</FlexBox>
				<SDivider hidden/>
				<FlexBox className={ 'details-section' } padding={ 25 }
				         flexDirection={ 'column' }>
					<MDEditor.Markdown source={ game.details }/>
					<SDivider hidden/>
					<Embed
						defaultActive={ !!game.video }
						className={ 'px-non-padding video-embed' }
						id={ game.video }
						source='youtube'
					/>
				</FlexBox>
				<SDivider hidden/>
			</FlexBox>
			<FlexBox padding={ clamp(10, width * 0.10, 60) } justifyContent={ 'center' } alignItems={ 'center' }
			         className={ 'review-details-section green-bg' }>
				<ReviewScrollCard
					showAvg
					avgReview={ game.review_stars }
					headerClassName={ 'white-text' }
					title={ words.reviews.gamesReviews }
					reviews={ game?.game_orders?.filter(ord => ord.review_star && ord.review_star > 0) }
				/>
			</FlexBox>
			<If flag={ showPaymentConfirm || showLogin }>
				<Dimmer page active>
					<LoginWidget onSignIn={ handleSingIn } asComponent pxIf={ showLogin }/>
					<OrderConfirm
						onAcceptNextSuccess={ () => {
							onPay();
						} }
						orderId={ orderId }
						onAccept={ onAcceptOrder }
						onCancel={ () => setShowPaymentConfirm(false) }
						game={ game }
						quantity={ game?.type === gameTypes.Keys ? selectedQuantity : 1 }
						gameCard={ selectedCard }
						pxIf={ showPaymentConfirm }
					/>
				</Dimmer>
			</If>
		</FlexBox>
	);
}


export function GameViewer(props: BaseRouteComponentProps) {
	const gameId: number | null = props.match.params.gameId
	&& !isNaN(Number(props.match.params.gameId)) ? Number(props.match.params.gameId) : null;
	const gameCardId: number | null = props.match.params.gameCardId
	&& !isNaN(Number(props.match.params.gameCardId)) ? Number(props.match.params.gameCardId) : null;
	const service = new EntityService<GameDTO>(systemGameService);
	const [ game, setGame ] = useState<GameDTO | null>(null);
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
	useEffect(() => {
		if (gameId !== game?.id) {
			setGame(null);
			setNotFoundPage(false);
			setTimeout(() => {
				fetchEntity();
			}, 50);
		}
	}, [ gameId ])
	// eslint-disable-next-line
	useEffect(() => {
		if (!game && !isNotFoundPage) {
			fetchEntity();
		}
	}, []);
	return (
		<Wrapper
			loading={ loader.isLoading }
			hideContainer
			fitContainer={ false }
			hideTitle
		>
			{
				isNotFoundPage && !loader.isLoading ?(
					<div className={'center-not-found'}>
						<NotFoundWidget/>
					</div>
				) : null
			}
			{
				game ? (
					<GameViewerWidget onPay={ () => {
						fetchEntity();
					} } game={ game } gameCardId={ gameCardId }/>
				) : null
			}
		</Wrapper>
	);
}