import './game-viewer-component.css';
import React from 'react';
import { Divider as SDivider, Header, Image as SImage } from "semantic-ui-react";
import { buildCN, costFormat, isFalse, isNull } from "../../../lib/utils/utils";
import { AccessoryDTO, GameCardDTO, GameDTO } from "../../../models/game";
import { useWindow } from "../../../lib/hooks/screen-change";
import { FlexBox, If } from "../../../lib/components/containers";
import { useLanguage } from "../../../lib/hooks/languageHook";
import ConfirmCart from '../../../assets/icons/cart.png';
import { Button, Image, Link } from "../../../lib/components/basic";
import { URL_ROUTES } from "../../../routes";
import { useLoader } from "../../../lib/hooks/generic";
import Logo from '../../../assets/logo/logo-bg-w.jpg';
import { getDealerPrice } from "../../../utils/util";

export function ImageCard(props: { logo: any, title: string, className?: string }) {
	return (
		<div className={ buildCN('card-view', props.className ? props.className : '') }>
			<div>
				<SImage src={ props.logo ? props.logo : Logo }/>
			</div>
			<Header className={ 'px-non-margin' } as={ 'h5' }>{ props.title }</Header>
		</div>
	);
}


export function OrderItemView({game, quantity, gameCard, accessory, shipLocation}: {
	game?: GameDTO,
	gameCard?: GameCardDTO, quantity?: number,
	accessory?: AccessoryDTO, shipLocation?: string
}) {
	const {isMobile} = useWindow();
	const {words} = useLanguage();
	return (
		<FlexBox
			className={ 'order-confirm-container' }
			flexDirection={ isMobile ? 'column' : 'row' }
			alignItems={ isMobile ? 'center' : undefined }
			justifyContent={ isMobile ? 'center' : 'space-between' }
			warp
		>
			<div>
				{
					game ? (
						<ImageCard logo={ game.logo } title={ game.card_name }/>
					) : null
				}
				{
					accessory ? (
						<Image width={ 200 } src={ accessory.logo }/>
					) : null
				}
			</div>
			<FlexBox
				dir={'ltr'}
				justifyContent={ isMobile ? 'center' : undefined }
				alignItems={ isMobile ? 'center' : undefined }
				warp flexDirection={ 'column' } padding={ 20 }
			>
				{
					gameCard?.name ? (
						<Header className={ 'state-info' } as={ 'h2' }>{ gameCard?.name }</Header>
					) : null
				}
				{
					accessory?.name ? (
						<Header className={ 'state-info' } as={ 'h2' }>{ accessory?.name }</Header>
					) : null
				}
				<FlexBox dir={'ltr'} className={ 'order-state-info-c' } warp flexDirection={ 'column' }
				         justifyContent={ 'flex-start' }>
					<Header className={ 'state-info' } as={ 'h3' }>
						{ words.viewer.selectedQuantity }: { quantity }
					</Header>
					<Header className={ 'state-info' } as={ 'h3' }>
						{ words.gameViewer.totalPrice }: <span
						className={ 'gc-price' }>${ costFormat(
						( quantity ? quantity : 1 ) * ( gameCard ? getDealerPrice(gameCard.total_price, gameCard.total_dealer_price) : ( accessory ? getDealerPrice(accessory.total_price, accessory.total_dealer_price) : 1 ) ))
					}</span>
					</Header>
					{
						shipLocation ? (
							<Header className={ 'state-info' } as={ 'h3' }>
								{ words.viewer.totalEarnPoint }: { costFormat(
								( quantity ? quantity : 1 ) * ( gameCard ? gameCard.points : ( accessory ? accessory.points : 1 ) ))
							}
							</Header>
						) : null
					}
					{
						shipLocation ? (
							<Header className={ 'state-info' } as={ 'h3' }>
								{ words.viewer.shipLocation }: { shipLocation }
							</Header>
						) : null
					}
				</FlexBox>
			</FlexBox>
		</FlexBox>
	);
}

export function OrderConfirm({pxIf, gameCard, game, quantity, onCancel, onAccept, accessory, shipLocation, orderId, onAcceptNextSuccess}: {
	pxIf?: boolean, accessory?: AccessoryDTO, shipLocation?: string, orderId?: number, onAcceptNextSuccess?: () => void,
	gameCard?: GameCardDTO, game?: GameDTO, quantity?: number, onCancel: () => void, onAccept: () => Promise<boolean | null>
}) {
	const {words} = useLanguage();
	const [ error, setError ] = React.useState(false);
	const [ success, setSuccess ] = React.useState(false);
	const loader = useLoader();
	if (isFalse(pxIf)) {
		return null;
	}
	return (
		<div className={ 'order-confirm-box' }>
			<div className={ 'order-confirm-header' }>
				<FlexBox justifyContent={ 'flex-end' } alignItems={ 'center' }>
					<Button disabled={ loader.isLoading } size={ 'tiny' } basic
					        color={ 'grey' } onClick={ () => {
						if (success && onAcceptNextSuccess) {
							onAcceptNextSuccess();
						}
						onCancel();
					} }
					        iconSetting={ {name: 'times', attachToButton: true} }/>
				</FlexBox>
				<SDivider hidden/>
				<FlexBox flexDirection={ 'column' } alignItems={ 'center' }
				         justifyContent={ 'center' }>
					<Header as={ 'h1' } className={ 'white' }>{ words.gameViewer.confirmOrder }</Header>
					<SDivider hidden/>
					<SImage src={ ConfirmCart }/>
				</FlexBox>
			</div>
			<OrderItemView shipLocation={ shipLocation } accessory={ accessory } quantity={ quantity } game={ game }
			               gameCard={ gameCard }/>
			<FlexBox
				className={ 'order-confirm-bottom' }
				flexDirection={ 'column' }
				alignItems={ 'center' }
				justifyContent={ 'center' }
				padding={ 30 }
				warp
			>
				<If flag={ success }>
					<Header as={ 'h3' }>{ words.gameViewer.orderThanksMsg }
						<Link to={ URL_ROUTES.USER.ORDER_HISTORY }> { words.gameViewer.orderHistory }</Link>
					</Header>
					<If flag={ orderId }>
						<Header as={ 'h3' }>
							<Link
								to={ URL_ROUTES.USER.ORDER_HISTORY_VIEW + '/' + orderId }>
								{ orderId ? orderId.toPrecision(8).split('.').reverse().join('') : 0 }</Link>
						</Header>
					</If>
				</If>
				<If flag={ !success }>
					<Header as={ 'h3' }>
						{ words.gameViewer.orderMsgOne }
					</Header>
				</If>
				<SDivider hidden/>
				<If flag={ error }>
					<Header as={ 'h4' }>
						{ words.gameViewer.failedMsg }
					</Header>
				</If>
				<Button
					loading={ loader.isLoading }
					disabled={ loader.isLoading }
					onClick={ () => {
						if (!success) {
							loader.activate();
							onAccept().then((d) => {
								if (isNull(d)) {
									loader.disabled();
									return;
								}
								if (!d) {
									setError(true);
								} else {
									setError(false);
									setSuccess(true);
								}
								loader.disabled();
							});
						} else {
							if (success && onAcceptNextSuccess) {
								onAcceptNextSuccess();
							}
							onCancel();
						}
					} }
					className={ 'confirm-button' }
					color={ 'orange' }
					text={ success ? words.basic.ok : words.gameViewer.continue }
				/>
			</FlexBox>
		</div>
	);
}