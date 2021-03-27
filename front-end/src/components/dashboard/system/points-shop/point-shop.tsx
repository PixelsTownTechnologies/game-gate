import './point-shop.css';
import React, { useEffect, useState } from 'react';
import { PointShopDTO } from "../../../../models/point-shop";
import { costFormat, isEmpty } from "../../../../lib/utils/utils";
import { EntityService } from "../../../../lib/services/entity-service/entity-service";
import { systemPointShopService, userOrderService } from "../../../../services/service-config";
import { useLoader } from "../../../../lib/hooks/generic";
import { useLanguage } from "../../../../lib/hooks/languageHook";
import { Wrapper } from "../../../shared/wrapper";
import { connect } from "react-redux";
import { StoreState } from "../../../../lib/models/application";
import { UserDTO } from "../../../../models/user";
import { FlexBox, FlexCenter, If } from "../../../../lib/components/containers";
import { PointCard } from "../../../shared/games-components/games-components";
import { Button, Divider, Form, Header, Icon, Modal } from "semantic-ui-react";
import { useWindow } from "../../../../lib/hooks/screen-change";
import { LanguageSystemWords } from "../../../../models/language";
import { TextField } from "../../../../lib/components/form/fields";
import { GameDTO } from "../../../../models/game";
import { updateUser } from "../../../../lib/store/actions/user";
import { Link } from "../../../../lib/components/basic";
import { URL_ROUTES } from "../../../../routes";

function PointShopConfirmModal({ps, onClose, onConfirm, words, dir, loading, error, isDone, orderId}: {
	ps: PointShopDTO, onClose: () => void, loading: boolean, error: boolean,
	onConfirm: (f: any) => void, words: LanguageSystemWords, dir: string, isDone: boolean, orderId: number | null
}) {
	const [ form, setForm ] = useState({id: ''});
	return (
		<Modal
			basic
			onClose={ () => {
				if (!loading) {
					onClose();
				}
			} }
			open={ true }
			size='small'
		>
			<h1 className={ 'ui header icon white-header-text' }>
				<Icon name='gift'/>
				{ words.entities.pointShop.shop.headerMsg }
			</h1>
			<Modal.Content className={ 'ps-order-confirm' }>
				<PointCard
					showDetailsOnly
					userPoint={ 999999999999999999999999999999 }
					dir={ dir }
					words={ words }
					pointShopObj={ ps }
					onClick={ () => {
					} }
				/>
				{
					ps?.game_card?.game && ( ( ps?.game_card?.game as GameDTO )?.type !== 'K' ) && !isDone ? (
						<Form dir={ dir } className={ 'fields-order' }>
							<Form.Field dir={ dir }>
								<label style={ {display: 'flex'} } dir={ dir }
								       className={ 'white-header-text' }>{ words.gameViewer.fields.orderId }</label>
								<TextField
									onChange={ (value) => {
										setForm({...form, id: value});
									} }
									value={ form.id }
									length={ 255 }
								/>
							</Form.Field>
						</Form>
					) : null
				}
				{
					!isDone ? (
						<p className={ 'white-header-text' }>
							{ words.entities.pointShop.shop.descriptionMsg }
						</p>
					) : (
						<If flag={ isDone }>
							<FlexCenter padding={10} flexDirection={ 'column' }>
								<h3 className={ 'white-header-text' }>{ words.gameViewer.orderThanksMsg }
									<Link to={ URL_ROUTES.USER.ORDER_HISTORY }> { words.gameViewer.orderHistory }</Link>
								</h3>
								<If flag={ orderId }>
									<h3 className={ 'white-header-text' }>
										<Link
											to={ URL_ROUTES.USER.ORDER_HISTORY_VIEW + '/' + orderId }>
											{ orderId ? orderId.toPrecision(8).split('.').reverse().join('') : 0 }</Link>
									</h3>
								</If>
								<If flag={ !orderId }>
									<h3 className={ 'white-header-text' }>
										{ words.entities.pointShop.shop.balance } + ${ costFormat(ps.money_reword) }
									</h3>
								</If>
							</FlexCenter>
						</If>
					)
				}
				{
					error ? (
						<Header color={ 'red' } as={ 'h4' }>
							{ words.gameViewer.failedMsg }
						</Header>
					) : null
				}
			</Modal.Content>
			<Modal.Actions className={ 'ps-order-confirm' }>
				<Button loading={ loading }
				        disabled={ loading || ( !form.id && ps?.game_card && ( ps?.game_card?.game as GameDTO )?.type !== 'K' ) }
				        color='green' inverted
				        onClick={ () => {
					        if (isDone) {
						        onClose();
						        return;
					        }
					        if (form.id || !ps.game_card || ( ( ps?.game_card?.game as GameDTO )?.type === 'K' )) {
						        onConfirm(form);
					        }
				        } }>
					{ !isDone ? words.gameViewer.buyNow : words.basic.ok }
				</Button>
			</Modal.Actions>
		</Modal>
	);
}


interface PointShopProps {
	user: UserDTO;
}


function PointShopPage(props: PointShopProps) {
	const [ list, setList ] = useState<PointShopDTO[]>([]);
	const [ error, setError ] = useState<boolean>(false);
	const [ selectedCard, setSelectedCard ] = useState<PointShopDTO | null>(null);
	const [ isDone, setDone ] = useState<boolean>(false);
	const [ orderId, setOrderId ] = useState<number | null>(null);
	
	const {isComputer} = useWindow();
	const loader = useLoader();
	const {words, dir} = useLanguage();
	useEffect(() => {
		if (isEmpty(list)) {
			loader.activate();
			new EntityService<PointShopDTO>(systemPointShopService).find().then((data) => {
				if (data) {
					setList(( data as PointShopDTO[] ).filter(c => c.show));
				}
				loader.disabled();
			});
		}
		// eslint-disable-next-line
	}, []);
	
	const onConfirmOrder = (form: { id: string }) => {
		if (selectedCard) {
			const sendForm = {account_id: form.id, pointShopId: selectedCard.id};
			loader.activate();
			new EntityService(systemPointShopService).createEntity(sendForm).then(data => {
				if (data) {
					if (selectedCard.game_card) {
						new EntityService(userOrderService).flushStore();
						updateUser({points: props.user.points - selectedCard.point_cost} as any);
					}
					if (selectedCard.money_reword) {
						updateUser({
							points: props.user.points - selectedCard.point_cost,
							balance: props.user.balance + selectedCard.money_reword
						} as any);
					}
					//setSelectedCard(null);
					setDone(true);
					if (data.id) {
						setOrderId(data.id);
					}
				} else {
					setError(true);
				}
				setError(false);
				loader.disabled();
			});
		}
	};
	return (
		<Wrapper
			loading={ loader.isLoading }
			title={ words.entities.pointShop.shop.title }
			icon={ 'gift' }
			subTitleChildren={
				<FlexBox className={ 'ps-header-title' } justifyContent={ !isComputer ? 'center' : 'flex-start' }
				         flexDirection={ 'column' }>
					<h2 className={ 'grey-text' }> { props.user.points } </h2>
					<h6 className={ 'grey-text' }>{ words.entities.pointShop.shop.creditsAvailable }</h6>
				</FlexBox>
			}
		>
			{
				isEmpty(list) ? (
					<FlexBox className={ 'center-not-found' } justifyContent={ 'center' } alignItems={ 'center' }>
						<h1 className={ 'grey-text text-align-c' }> { words.entities.pointShop.shop.noOffAvNBL } </h1>
					</FlexBox>
				) : null
			}
			<Divider hidden/>
			<Divider hidden/>
			<FlexBox warp flexDirection={ 'row' } justifyContent={ !isComputer ? 'center' : 'flex-start' }
			         alignItems={ 'center' }>
				{
					list.sort((g1, g2) => g1.point_cost - g2.point_cost)
						.filter(v => !v.game_card).map((ps, index) => {
						return <PointCard
							userPoint={ props.user ? props.user.points : 0 }
							dir={ dir }
							words={ words }
							key={ index }
							pointShopObj={ ps }
							onClick={ () => {
								setSelectedCard(ps);
							} }
						/>
					})
				}
			</FlexBox>
			<FlexBox warp flexDirection={ 'row' } justifyContent={ !isComputer ? 'center' : 'flex-start' }
			         alignItems={ 'center' }>
				{
					list.sort((g1, g2) => g1.point_cost - g2.point_cost)
						.filter(v => v.game_card).map((ps, index) => {
						return <PointCard
							userPoint={ props.user ? props.user.points : 0 }
							dir={ dir }
							words={ words }
							key={ index }
							pointShopObj={ ps }
							onClick={ () => {
								setSelectedCard(ps);
							} }
						/>
					})
				}
			</FlexBox>
			{
				selectedCard ? (
					<PointShopConfirmModal
						isDone={ isDone }
						orderId={ orderId }
						error={ error }
						loading={ loader.isLoading }
						dir={ dir }
						onClose={ () => {
							setError(false);
							setSelectedCard(null);
							setDone(false);
							setOrderId(null);
						} }
						words={ words }
						onConfirm={ (form) => onConfirmOrder(form) }
						ps={ selectedCard }
					/>
				) : null
			}
		</Wrapper>
	);
}

export default connect((state: StoreState, props) => {
	return {...props, user: state.user};
})(PointShopPage as any);