import React, { useEffect, useState } from 'react';
import './accessory-viewer.css';
import { BaseRouteComponentProps } from "../../../../lib/components/components";
import { useLanguage } from "../../../../lib/hooks/languageHook";
import { Wrapper } from "../../../shared/wrapper";
import { FlexBox, If } from "../../../../lib/components/containers";
import { NotFoundWidget } from "../../../errors/not-found-404";
import { clamp, isNull } from "../../../../lib/utils/utils";
import { OrderConfirm } from "../../../shared/game-viewer-component/game-viewer-component";
import { AccessoryDTO } from "../../../../models/game";
import { EntityService } from "../../../../lib/services/entity-service/entity-service";
import { systemAccessoryService, userOrderService } from "../../../../services/service-config";
import { useLoader } from "../../../../lib/hooks/generic";
import { useWindow } from "../../../../lib/hooks/screen-change";
import { Button, Dimmer, Divider as SDivider, Embed, Header, Label, Rating } from "semantic-ui-react";
import MDEditor from '@uiw/react-md-editor';
import { useEntityStore } from "../../../../lib/hooks/user";
import { UserBaseDTO } from "../../../../lib/models/user";
import { isUserAuthenticate } from "../../../../lib/utils/application-helper";
import { LoginWidget } from "../../user/auth";
import UserFacadeService from "../../../../lib/services/facade-service/user-facade-service";
import TokenService from "../../../../lib/services/token-service";
import { getUser, registerUser, updateUser } from "../../../../lib/store/actions/user";
import { ImageShower } from "../../../../lib/components/basic";
import { Counter } from "../../../../lib/components/form/fields";
import { UpdateUserDataDialog } from "../../user/profile/profile";

interface AccessoryViewerWidgetProps {
	accessory: AccessoryDTO | null;
}


export function AccessoryViewerWidget({accessory}: AccessoryViewerWidgetProps) {
	const [ showLogin, setShowLogin ] = useState(false);
	const [ selectedQuantity, setSelectedQuantity ] = useState(accessory && !accessory.is_sold ? accessory.order_min : 1);
	const [ showPaymentConfirm, setShowPaymentConfirm ] = useState(false);
	const [ showChangeInformation, setShowChangeInformation ] = useState(false);
	const [ showNoBalance, setShowNoBalance ] = useState(false);
	const [ orderId, setOrderId ] = useState<number | undefined>(undefined);
	const user = useEntityStore<UserBaseDTO>('user');
	const {words, dir} = useLanguage();
	const {width, type} = useWindow();
	if (!accessory) {
		return null;
	}
	const handleBuyNow = () => {
		if (accessory) {
			if (user && isUserAuthenticate()) {
				const totalPrice = accessory.total_price * selectedQuantity;
				if (getUser().balance >= totalPrice) {
					if (!getUser().address_one || getUser().address_one.trim().length < 0) {
						setShowChangeInformation(true);
					} else {
						setShowPaymentConfirm(true);
					}
				} else {
					setShowNoBalance(true);
				}
			} else {
				setShowLogin(true);
			}
		}
	};
	const onAcceptOrder = async () => {
		if (accessory && user && isUserAuthenticate()) {
			const data = await new EntityService(userOrderService).createEntity(
				{
					quantity: selectedQuantity,
					ship_location: getUser().address_one,
					accessory_id: accessory.id
				} as any);
			if (data) {
				await new EntityService(userOrderService).reload().then();
				setOrderId(data.id);
				const totalPrice = accessory.total_price * selectedQuantity;
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
		<FlexBox
			className={ 'acc-container' }
			flexDirection={ 'column' } justifyContent={ 'flex-start' }
		>
			<FlexBox dir={ dir } className={ 'max-width acc-info-container w-background ' }
			         warp>
				<ImageShower width={ clamp(320, width * 0.35, 400) } padding={ 25 } mainImage={ accessory.logo }
				             imageList={ [ accessory.image1, accessory.image2, accessory.image3, accessory.image4 ].filter(i => !!i) }/>
				<div dir={ dir } className={ 'acc-info' }>
					<div>
						<div dir={ 'auto' } className={ 'acc-header-section' }>
							<Header as={ 'h1' }>{ accessory.name }</Header>
							<h4>{ accessory.type }</h4>
						</div>
						<div dir={ dir } className={ 'acc-rating-section' }>
							<Rating maxRating={ 5 } disabled defaultRating={ accessory.review_stars + 0.5 }
							        icon='star'
							        size='large'/>
							<Header as={ 'h4' }>{ accessory.review_stars }</Header>
							<Header as={ 'h4' }>{ accessory.total_reviews } { words.viewer.reviews }</Header>
							<Header as={ 'h4' }>{ accessory.total_orders } { words.viewer.orders }</Header>
						</div>
						<div dir={ dir } className={ 'acc-price-section' }>
							<h2>${ accessory.total_price } US</h2>
							<If flag={ accessory.discount && accessory.discount > 0 }>
								<h4 className={ 'acc-discount-price' }>${ accessory.price } US</h4>
								<Label className={ 'text-w acc-discount' } color='purple' tag>
									-{ accessory.discount }%
								</Label>
							</If>
						</div>
						<If flag={ accessory.points > 0 }>
							<Label color={ 'teal' }>
								<h5 className={ ' px-non-margin' }>
									{ words.gameViewer.credits } +{ accessory ? accessory.points : 0 }
								</h5>
							</Label>
						</If>
						<SDivider hidden/>
						<div dir={ dir } className={ 'acc-description-section' }>
							<p>{ accessory.short_description }</p>
						</div>
					</div>
					<SDivider hidden/>
					<div>
						<div className={ 'acc-counter-section' }>
							<h2>{ words.viewer.quantity }</h2>
							<Counter
								min={ accessory ? accessory.order_min : 1 }
								max={ accessory ? accessory.order_max : 10 }
								value={ selectedQuantity }
								onChange={ (count: any) => {
									setSelectedQuantity(count);
								} }
							/>
						</div>
						<If flag={ showNoBalance }>
							<h5 dir={ dir }
							    className={ 'red-text acc-no-balance-msg' }> { words.gameViewer.noBalance } </h5>
						</If>
						<If flag={ !showNoBalance }>
							<SDivider hidden/>
						</If>
						<div className={ 'acc-buttons-section' }>
							<Button color='google plus'
							        onClick={ () => {
								        handleBuyNow();
							        } }>
								{ words.gameViewer.buyNow }
							</Button>
							<Button
								onClick={ () => {
									handleAddToCard();
								} } color='facebook'>
								{ words.gameViewer.addToCart }
							</Button>
						</div>
					</div>
				</div>
			</FlexBox>
			<SDivider hidden/>
			<SDivider hidden/>
			<FlexBox justifyContent={ 'center' } alignItems={ type === 'Mobile' ? 'center' : undefined }
			         flexDirection={ 'column' }>
				<SDivider hidden/>
				<FlexBox dir={ dir } className={ 'details-section w-background ' } padding={ 25 }
				         flexDirection={ 'column' }>
					<FlexBox justifyContent={ 'center' } alignItems={ type === 'Mobile' ? 'center' : undefined }
					         flexDirection={ 'column' }>
						<h2 className={ 'acc-overview' }>{ words.viewer.overView }</h2>
					</FlexBox>
					<SDivider hidden/>
					<MDEditor.Markdown source={ accessory.details }/>
					<SDivider hidden/>
					<SDivider hidden/>
					<Embed
						className={ 'px-non-padding video-embed' }
						style={ {
							width: `${ clamp(300, width * 0.4, 600) }px`,
							height: `${ clamp(180, width * 0.32, 370) }px`
						} }
						id={ accessory.video }
						source='youtube'
					/>
				</FlexBox>
			</FlexBox>
			<SDivider hidden/>
			<If flag={ showPaymentConfirm || showLogin }>
				<Dimmer page active>
					<LoginWidget onSignIn={ handleSingIn } asComponent pxIf={ showLogin }/>
					<OrderConfirm
						orderId={ orderId }
						shipLocation={ getUser().address_one }
						onAccept={ onAcceptOrder }
						onCancel={ () => setShowPaymentConfirm(false) }
						accessory={ accessory }
						quantity={ selectedQuantity }
						pxIf={ showPaymentConfirm }
					/>
				</Dimmer>
			</If>
			<UpdateUserDataDialog
				onClose={ () => setShowChangeInformation(false) }
				open={ showChangeInformation }
				message={ words.viewer.shipLocationMessage }
				fields={ [ 'address_one', 'phone' ] }
			/>
		</FlexBox>
	);
}


export function AccessoryViewer(props: BaseRouteComponentProps) {
	const accessoryId: number | null = props.match.params.accessoryId
	&& !isNaN(Number(props.match.params.accessoryId)) ? Number(props.match.params.accessoryId) : null;
	
	const service = new EntityService<AccessoryDTO>(systemAccessoryService);
	const [ accessory, setAccessory ] = useState<AccessoryDTO | null>(null);
	const loader = useLoader();
	const [ isNotFoundPage, setNotFoundPage ] = useState<boolean>(isNull(accessoryId));
	useEffect(() => {
		if (!accessory && !isNotFoundPage) {
			loader.activate();
			service.findById(accessoryId).then((data) => {
				if (!!data) {
					setAccessory(data);
				} else {
					setNotFoundPage(true);
				}
				loader.disabled();
			})
		}
	});
	return (
		<Wrapper
			className={ 'game-viewer-component-bg' }
			loading={ loader.isLoading }
			hideContainer={ !isNotFoundPage }
			fitContainer={ isNotFoundPage }
			hideTitle
		>
			<If flag={ isNotFoundPage && !loader.isLoading }>
				<NotFoundWidget/>
			</If>
			{
				accessory ? (
					<AccessoryViewerWidget accessory={ accessory }/>
				) : null
			}
		</Wrapper>
	);
}