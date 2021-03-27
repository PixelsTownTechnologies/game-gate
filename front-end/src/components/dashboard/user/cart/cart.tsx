import React, { useEffect, useState } from 'react';
import './cart.css';
import { UserDTO } from "../../../../models/user";
import { Wrapper } from "../../../shared/wrapper";
import { connect } from "react-redux";
import { StoreState } from "../../../../lib/models/application";
import { useLanguage } from "../../../../lib/hooks/languageHook";
import { useLoader } from "../../../../lib/hooks/generic";
import { HomeDTO } from "../../../../models/home-details";
import { manipulateHomeData } from "../../../../utils/util";
import { buildCN, costFormat, isEmpty } from "../../../../lib/utils/utils";
import { AccessoryDTO, GameCardDTO, GameDTO } from "../../../../models/game";
import { Divider, FlexBox, FlexCenter, FlexSpace, If, Space } from "../../../../lib/components/containers";
import { CartObject } from "../../../../lib/models/user";
import { Button, Form, Icon, Item, Label } from "semantic-ui-react";
import { LanguageSystemWords } from "../../../../models/language";
import Logo from "../../../../assets/logo/logo-bg-w.jpg";
import { ImageCard } from "../../../shared/game-viewer-component/game-viewer-component";
import { Counter, TextField } from "../../../../lib/components/form/fields";
import { useWindow } from "../../../../lib/hooks/screen-change";
import UserFacadeService from "../../../../lib/services/facade-service/user-facade-service";
import { EntityService } from "../../../../lib/services/entity-service/entity-service";
import { userMultiOrderService, userOrderService } from "../../../../services/service-config";
import { Image, Redirect } from "../../../../lib/components/basic";
import { URL_ROUTES } from "../../../../routes";

interface CartOrder extends CartObject {
	gameCard: GameCardDTO | null;
	accessory: AccessoryDTO | null;
	account_id: string;
	ship_location: string;
	order: number;
}

function OrderCartItem({obj, words, dir, onFormChange, onRemove}: {
	obj: CartOrder,
	words: LanguageSystemWords, dir: string, onFormChange: (form: any) => void, onRemove: () => void
}) {
	if (!obj.gameCard && !obj.accessory) {
		return null;
	}
	const discount = obj.gameCard && obj.gameCard.discount && obj.gameCard.discount > 0 ? obj.gameCard.discount : (
		obj.accessory && obj.accessory.discount && obj.accessory.discount > 0 ? obj.accessory.discount : 0
	);
	const isSold = obj?.gameCard?.is_sold || obj?.accessory?.is_sold;
	return (
		<Item className={ 'oc-item' }>
			{
				obj.gameCard ? (
					<ImageCard
						className={ 'gcv-card-box' }
						logo={ ( obj.gameCard.game as GameDTO ).logo ? ( obj.gameCard.game as GameDTO ).logo : Logo }
						title={ ( obj.gameCard.game as GameDTO ).card_name }
					/>
				) : (
					obj.accessory ? (
						<Image width={ 180 } src={ obj.accessory.logo }/>
					) : null
				)
			}
			<Item.Content className={ 'order-cart-item-c' }>
				<div>
					<Item.Header><h3
						className={ 'px-non-margin grey-text text-align-c' }>{ obj.gameCard ? obj.gameCard.name : obj?.accessory?.name }</h3>
					</Item.Header>
					<Item.Meta>
						<div dir={ dir } className={ 'acc-price-section' }>
							<h4 className={ 'px-non-margin grey-text' }>${ obj.gameCard ? costFormat(obj.gameCard.total_price) : ( obj?.accessory ? costFormat(obj?.accessory.total_price) : 0 ) } US</h4>
							<If flag={ discount > 0 }>
								<h4 className={ 'acc-discount-price' }>${ obj.gameCard ? costFormat(obj.gameCard.price) : ( obj?.accessory ? costFormat(obj?.accessory.price) : 0 ) } US</h4>
								<Label className={ 'text-w acc-discount' } color='purple' tag>
									-{ discount }%
								</Label>
							</If>
						</div>
					</Item.Meta>
				</div>
				<Item.Extra>
					<FlexBox dir={ 'ltr' } className={ 'item-extra-order' } justifyContent={ 'flex-end' }>
						<FlexBox warp className={ 'item-extra-order' } dir={ 'ltr' } justifyContent={ 'flex-end' }>
							{
								isSold ? (
									<Label color={ 'red' }>
										<h3 className={ 'px-non-margin' }>{ words.gameViewer.sold }</h3>
									</Label>
								) : null
							}
							{
								!isSold && ( ( obj?.gameCard && ( obj?.gameCard?.game as GameDTO )?.type === 'K' ) || obj.accessory ) ? (
									<div className={ buildCN('counter-c', obj.accessory ? 'px-sm-5' : '') }>
										<Counter
											min={ obj.gameCard ? obj.gameCard.order_min : ( obj?.accessory ? obj.accessory?.order_min : 0 ) }
											max={ obj.gameCard ? obj.gameCard.order_max : ( obj?.accessory ? obj.accessory?.order_max : 0 ) }
											value={ obj.quantity }
											onChange={ (count: any) => {
												onFormChange({...obj, quantity: count});
											} }
										/>
									</div>
								) : null
							}
							{
								!isSold && ( obj?.gameCard?.game as GameDTO )?.type === 'C' ? (
									<Form>
										<Form.Field>
											<label>{ words.gameViewer.fields.orderId }</label>
											<TextField
												onChange={ (value) => {
													onFormChange({...obj, account_id: value});
												} }
												value={ obj.account_id }
												length={ 255 }
											/>
										</Form.Field>
									</Form>
								) : null
							}
							{
								!isSold && obj?.accessory ? (
									<Form className={ 'px-sm-5' }>
										<Form.Field>
											<label>{ words.viewer.shipLocation }</label>
											<TextField
												onChange={ (value) => {
													onFormChange({...obj, ship_location: value});
												} }
												value={ obj.ship_location }
												length={ 255 }
											/>
										</Form.Field>
									</Form>
								) : null
							}
						</FlexBox>
						<Button onClick={ () => onRemove() } className={ 'trash-btn-order' } icon={ 'trash alternate' }
						        color={ 'red' } basic/>
					</FlexBox>
				</Item.Extra>
			</Item.Content>
		</Item>
	);
}


function UserCart({user, gameCards, accessories}: { user: UserDTO, gameCards: GameCardDTO[], accessories: AccessoryDTO[] }) {
	const {words, dir} = useLanguage();
	const [ orders, setOrders ] = useState<CartOrder[] | null>(null);
	const [ redirect, setRedirect ] = useState(false);
	const [ error, setError ] = useState(false);
	const {width} = useWindow();
	const loader = useLoader();
	const notSoldOrders = orders ? orders.filter(obj => obj?.gameCard ? ( !obj.gameCard.is_sold ) : ( !obj?.accessory?.is_sold )) : [];
	const sortOrders = (ordersToSort: CartOrder[]) => {
		return ordersToSort.sort(
			(o1, o2) => o1.order - o2.order);
	}
	useEffect(() => {
		setOrders(sortOrders(( user.cart_data as CartOrder[] )
			.map((cObj, index) => {
				return {
					...cObj,
					gameCard: cObj.type === 'game' ? gameCards.filter(gc => gc.id === cObj.objectId)?.[0] : null,
					accessory: cObj.type === 'accessory' ? accessories.filter(gc => gc.id === cObj.objectId)?.[0] : null,
					account_id: cObj.account_id ? cObj.account_id : '',
					ship_location: user.address_one
				};
			}).filter(o => !!o.gameCard || !!o.accessory)).sort(
			(o1, o2) => {
				if (o1.gameCard && o2.gameCard) {
					return ( o2.gameCard.game as GameDTO ).type.charCodeAt(0) - ( o1.gameCard.game as GameDTO ).type.charCodeAt(0);
				}
				if (o1.gameCard && o2.accessory) {
					return -1;
				}
				if (o1.accessory && o2.gameCard) {
					return 1;
				}
				return 0;
			}
		).map((ord, index) => ( {...ord, order: index} )));
		// eslint-disable-next-line
	}, [ user.cart_data.length ]);
	const handleSendOrders = () => {
		if (orders && !isEmpty(notSoldOrders)) {
			loader.activate();
			const orderToSend = notSoldOrders;
			new EntityService(userMultiOrderService).createEntity(orderToSend.map(obj => ( {
				...obj,
				gameCard: undefined,
				accessory: undefined,
				order: undefined
			} ))).then(data => {
				if (data) {
					let failedOrder = [] as CartObject[];
					const codes = data as any as number[];
					codes.forEach((code, index) => {
						if (code !== 201) {
							failedOrder.push(orderToSend[index]);
						}
					});
					failedOrder = [ ...failedOrder,
						...orders.filter(obj => !!obj.gameCard).filter(obj => obj.gameCard?.is_sold),
						...orders.filter(obj => !!obj.accessory).filter(obj => obj.accessory?.is_sold) ]
						.map(obj => ( {quantity: obj.quantity, objectId: obj.objectId, type: obj.type} ));
					UserFacadeService.updateCart(failedOrder).then(() =>{
						loader.disabled();
					});
					new EntityService(userOrderService).flushStore();
					if (failedOrder.length < 1) {
						setRedirect(true);
					} else {
						setError(true);
					}
				} else {
					setError(true);
					loader.disabled();
				}
			});
		}
	}
	const isOrderValid = (ord: CartOrder) => {
		if (ord.gameCard) {
			if (( ord.gameCard?.game as GameDTO )?.type === 'C') {
				return ord.account_id || ord.account_id.length > 3;
			}
			return true;
		}
		if (ord.accessory) {
			return ord.ship_location || ord.ship_location.length > 3;
		}
		return false;
	}
	const total_cost = orders && !isEmpty(notSoldOrders) ? notSoldOrders
			.map(obj => ( obj.quantity ? obj.quantity : 1 ) * ( obj.gameCard ? obj.gameCard.total_price : ( obj.accessory ? obj.accessory.total_price : 0 ) ))
			.reduce((total, num) => total + num)
		:
		0;
	const total_point = orders && !isEmpty(notSoldOrders) ? notSoldOrders
		.map(obj => ( obj.quantity ? obj.quantity : 1 ) * ( obj.gameCard ? obj.gameCard.points : ( obj.accessory ? obj.accessory.points : 0 ) ))
		.reduce((total, num) => total + num) : 0;
	const isNotValidCheckout = orders && !isEmpty(notSoldOrders) ? notSoldOrders
		.filter(ord => !isOrderValid(ord)).length > 0
		: false;
	const isMobile = width < 850;
	return (
		<Wrapper
			icon={ 'cart' }
			title={ words.cart.title }
			loading={ loader.isLoading }
		>
			<Redirect flag={ redirect } url={ URL_ROUTES.USER.ORDER_HISTORY }/>
			{
				orders && !isEmpty(orders) ? (
					<FlexBox className={ 'cart-container' } justifyContent={ 'space-between' }
					         flexDirection={ isMobile ? 'column' : 'row' }>
						<Item.Group divided>
							{
								orders.map(o => {
									return <OrderCartItem onRemove={ () => {
										const otherOrders = ( orders?.filter(ord => ord.objectId !== o.objectId) as CartOrder[] )
											.map(ord => ( {
												objectId: ord.objectId,
												quantity: ord.quantity,
												type: ord.type
											} ));
										loader.activate();
										UserFacadeService.updateCart(otherOrders).then(() => loader.disabled());
									}
									} onFormChange={ form => {
										const otherOrders = orders?.filter(ord => ord.objectId !== o.objectId || ord.type !== o.type);
										otherOrders?.push(
											{
												...o,
												...form
											}
										)
										setOrders(sortOrders(otherOrders));
									} } key={ o.order } words={ words } dir={ dir } obj={ o }/>
								})
							}
						</Item.Group>
						<div className={ 'total-card total-card-cart' }>
							<FlexBox justifyContent={ 'space-between' }>
								<h3>{ words.gameViewer.total }</h3>
								<div>
									<h3
										className={ 'gc-price px-non-margin' }
									>
										$ { costFormat(total_cost ? total_cost : 0) }
									</h3>
									<h5
										className={ 'gc-credits px-non-margin' }
									>
										{ words.gameViewer.credits } { total_point ? total_point : 0 }
									</h5>
								</div>
							</FlexBox>
							{
								orders.map(ord => {
									const validOrder = isOrderValid(ord);
									const isSold = ord?.gameCard ? ord?.gameCard.is_sold : ( ord?.accessory?.is_sold );
									const totalPrice = ord?.gameCard && ord.type === 'game'
										? ord?.gameCard?.total_price : ( ord.accessory && ord.type === 'accessory' ? ord.accessory.total_price : 0 );
									return (
										<FlexSpace dir={ 'ltr' } key={ ord.order } flexDirection={ 'column' }>
											<h4 className={ buildCN('px-non-margin', validOrder ? 'grey-text' : 'red-text') }>
												{
													isSold ? words.gameViewer.sold :
														(
															validOrder ? `$${ costFormat(ord.quantity * totalPrice) }` :
																( ord.gameCard ? words.cart.needAccountID : words.cart.needShipLocation )
														)
												}
											</h4>
											<h4 className={ 'px-non-margin grey-text' }>${ totalPrice } x { ord.quantity }</h4>
										</FlexSpace>
									);
								})
							}
							<If flag={ user.balance < total_cost }>
								<h5 dir={ dir } className={ 'red-text' }> { words.gameViewer.noBalance } </h5>
							</If>
							<If flag={ error }>
								<h5 dir={ dir } className={ 'red-text' }> { words.gameViewer.failedMsg } </h5>
							</If>
							<Divider/>
							<FlexBox justifyContent={ 'flex-end' } className={ 'total-card-button' }>
								<Button style={ {width: '100%'} }
								        disabled={ loader.isLoading || ( user.balance < total_cost ) || isNotValidCheckout }
								        color='google plus'
								        onClick={ () => {
									        if (!loader.isLoading && !( user.balance < total_cost ) && !isNotValidCheckout) {
										        handleSendOrders();
									        }
								        } }>
									<Space/><Icon name={ 'cart' }/> <Space/>{ words.cart.checkout }
								</Button>
							</FlexBox>
						</div>
					</FlexBox>
				) : (
					<div className={ 'center-not-found' }>
						<FlexCenter>
							<h1> { words.cart.cartIsEmpty }</h1>
						</FlexCenter>
					</div>
				)
			}
		</Wrapper>
	);
}


export default connect((state: StoreState, ownProps) => {
	const home: ( HomeDTO | null ) = state.entity['home'] ? manipulateHomeData(state.entity['home'] as HomeDTO) : null;
	return {
		...ownProps, user: state.user,
		gameCards: home && !isEmpty(home.gameCards) ? home.gameCards : [],
		accessories: home && !isEmpty(home.accessory) ? home.accessory : [],
	};
})(UserCart as any);
