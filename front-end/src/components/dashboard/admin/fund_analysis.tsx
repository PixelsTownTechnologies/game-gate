import './fund-analysis.css';
import { Wrapper } from "../../shared/wrapper";
import React, { useEffect, useState } from "react";
import { useLoader } from "../../../lib/hooks/generic";
import { useLanguage } from "../../../lib/hooks/languageHook";
import { Button, Form, Header, Icon, Segment } from "semantic-ui-react";
import { connect } from "react-redux";
import { generateMapStateEntityToProps } from "../../../lib/store/util";
import {
	accessoryService,
	adminInvoiceService,
	adminOrderService,
	adminUserService,
	gameCardService
} from "../../../services/service-config";
import { AccessoryDTO, GameCardDTO, OrderDTO } from "../../../models/game";
import { InvoiceDTO } from "../../../models/invoices";
import { UserDTO } from "../../../models/user";
import { EntityService } from "../../../lib/services/entity-service/entity-service";
import { TitleView } from "../../../lib/components/containers";
import { costFormat } from "../../../lib/utils/utils";
import { Table, TableSetting } from "../../../lib/components/tabels";

const colors = [
	'red',
	'orange',
	'yellow',
	'green',
	'teal',
	'blue',
	'violet',
	'purple',
	'pink',
	'grey',
	'black'
];

export function ViewBox({color, title, icon, value}: { color: string, title: string, icon: string, value: any }) {
	return (
		<Segment color={ color as any } stacked className={ 'analysis-box' }>
			<div className={ 'analysis-box-header' }>
				<div><Icon size={ 'big' } color={ color as any } name={ icon as any }/></div>
				<h3>{ title }</h3>
			</div>
			<Header color={ color as any } as={ 'h1' }>{ !isNaN(Number(value)) ? costFormat(value) : value }</Header>
		</Segment>
	);
}

interface FundAnalysisProps {
	gameCards: GameCardDTO[];
	invoices: InvoiceDTO[];
	systemOrders: OrderDTO[];
	users: UserDTO[];
	accessory: AccessoryDTO[];
}

interface ItemStatusView {
	totalOrders: number;
	totalEarns: number;
	totalQuantity: number;
	name: string;
	id: number;
}

function FundAnalysis({gameCards, invoices, systemOrders, users, accessory}: FundAnalysisProps) {
	const {words, dir} = useLanguage();
	const gameLoader = useLoader();
	const usersLoader = useLoader();
	const invoiceLoader = useLoader();
	const orderLoader = useLoader();
	const accessoryLoader = useLoader();
	const [ startDate, setStartDate ] = useState('');
	const [ endDate, setEndDate ] = useState('');
	const [ applyFilters, setApplyFilters ] = useState(false);
	const tableSettings: TableSetting[] = [
		{
			fieldName: 'id',
			title: words.analysis.tableFields.id,
			type: 'number',
			width: 80,
			center: true
		},
		{
			fieldName: 'name',
			title: words.analysis.tableFields.name,
			type: 'text',
			width: 150,
			center: true
		},
		{
			fieldName: 'totalOrders',
			title: words.analysis.tableFields.totalOrders,
			type: 'formattedNumber',
			width: 150,
			center: true
		},
		{
			fieldName: 'totalQuantity',
			title: words.analysis.tableFields.totalQuantity,
			type: 'formattedNumber',
			width: 150,
			center: true
		},
		{
			fieldName: 'totalEarns',
			title: words.analysis.tableFields.totalEarns,
			type: 'balance',
			width: 150,
			center: true
		}
	];
	useEffect(() => {
		gameLoader.activate();
		usersLoader.activate();
		invoiceLoader.activate();
		orderLoader.activate();
		accessoryLoader.activate();
		new EntityService(gameCardService).find().then(() => {
			gameLoader.disabled();
		});
		new EntityService(adminInvoiceService).find().then(() => {
			invoiceLoader.disabled();
		});
		new EntityService(adminOrderService).find().then(() => {
			orderLoader.disabled();
		});
		new EntityService(adminUserService).find().then(() => {
			usersLoader.disabled();
		});
		new EntityService(accessoryService).find().then(() => {
			accessoryLoader.disabled();
		});
		// eslint-disable-next-line
	}, []);
	const isLoading = gameLoader.isLoading || usersLoader.isLoading
		|| invoiceLoader.isLoading || orderLoader.isLoading || accessoryLoader.isLoading;
	let totalUsers = 0;
	let totalDealersUsers = 0;
	let totalUsersBalance = 0;
	let totalUsersPoints = 0;
	let totalEarns = 0;
	let totalOrders = 0;
	let totalInProgressOrders = 0;
	let totalCompletedOrders = 0;
	let totalGamesInSystem = 0;
	let totalEarnsFromKeyGames = 0;
	let totalEarnsFromChargingGames = 0;
	let totalEarnsFromAccessories = 0;
	let totalAccessoriesInSystem = 0;
	let totalBalanceAddToUsers = 0;
	let totalAccessoriesOrders = 0;
	let totalKeyGamesOrders = 0;
	let totalChargingGamesOrders = 0;
	const gameCardTableItems = [];
	const accessoriesTableItems = [];
	const isDateBetween = (date: any): boolean => {
		return ( new Date(date).getTime() >= new Date(startDate).getTime() ) && ( new Date(date).getTime() <= new Date(endDate).getTime() );
	}
	if (users) {
		totalUsers = users.length;
		totalDealersUsers = users.filter(user => !!user && user.dealer).length;
		totalUsersBalance = users.map(u => u.balance).filter(b => !!b).reduce((counter, num) => counter + num, 0);
		totalUsersPoints = users.map(u => u.points).filter(p => !!p).reduce((counter, num) => counter + num, 0);
	}
	if (invoices) {
		const invoicesList = applyFilters ? invoices.filter(i => i.create_at ? isDateBetween(i.create_at) : false) : invoices;
		totalBalanceAddToUsers = invoicesList.filter(i => i.action === 'A' && !!i.amount).map(i => i.amount).reduce((counter, num) => counter + num, 0);
		}
	if (accessory) {
		totalAccessoriesInSystem = accessory.length;
	}
	if (gameCards) {
		totalGamesInSystem = gameCards.length;
	}
	if (systemOrders) {
		const systemOrdersList = applyFilters ? systemOrders.filter(o => o.create ? isDateBetween(o.create) : false) : systemOrders;
		totalOrders = systemOrdersList.length;
		totalEarns = systemOrdersList.map(i => i.cost).reduce((counter, num) => counter + num, 0);
		
		totalInProgressOrders = systemOrdersList.filter(o => o.state === 'I').length;
		totalCompletedOrders = systemOrdersList.filter(o => o.state === 'C').length;
		totalEarnsFromKeyGames = systemOrdersList.filter(o => !!o.game_card).filter(o => o.game_card.game.type === 'K')
			.map(o => o.cost).reduce((counter, num) => counter + num, 0);
		totalEarnsFromChargingGames = systemOrdersList.filter(o => !!o.game_card).filter(o => o.game_card.game.type === 'C')
			.map(o => o.cost).reduce((counter, num) => counter + num, 0);
		totalEarnsFromAccessories = systemOrdersList.filter(o => !!o.accessory)
			.map(o => o.cost).reduce((counter, num) => counter + num, 0);
		totalAccessoriesOrders = systemOrdersList.filter(o => !!o.accessory).length;
		totalKeyGamesOrders = systemOrdersList.filter(o => !!o.game_card).filter(o => o.game_card.game.type === 'K').length;
		totalChargingGamesOrders = systemOrdersList.filter(o => !!o.game_card).filter(o => o.game_card.game.type === 'C').length;
		if (gameCards) {
			const gameMap = {} as any;
			systemOrdersList.filter(o => !!o.game_card).forEach((order) => {
				const gameCard = gameCards?.filter(g => g.id === order.game_card.id)?.[0];
				if (gameCard) {
					if (gameMap[gameCard.id]) {
						gameMap[gameCard.id].totalEarns += order.cost;
						gameMap[gameCard.id].totalOrders += 1;
						gameMap[gameCard.id].quantity += order.quantity;
					} else {
						gameMap[gameCard.id] = {
							id: gameCard.id,
							name: gameCard.name,
							totalEarns: order.cost,
							totalOrders: 1,
							totalQuantity: order.quantity
						} as ItemStatusView;
					}
				}
			});
			gameCardTableItems.push(...Object.values(gameMap));
		}
		if (accessory) {
			const accMap = {} as any;
			systemOrdersList.filter(o => !!o.accessory).forEach((order) => {
				const acc = accessory?.filter(g => g.id === order.accessory.id)?.[0];
				if (acc) {
					if (accMap[acc.id]) {
						accMap[acc.id].totalEarns += order.cost;
						accMap[acc.id].totalOrders += 1;
						accMap[acc.id].quantity += order.quantity;
					} else {
						accMap[acc.id] = {
							id: acc.id,
							name: acc.name,
							totalEarns: order.cost,
							totalOrders: 1,
							totalQuantity: order.quantity
						} as ItemStatusView;
					}
				}
			});
			accessoriesTableItems.push(...Object.values(accMap));
		}
	}
	return (
		<Wrapper
			loading={ isLoading }
			title={ words.analysis.title }
			icon={ 'chart line' }
		>
			<div className={ 'analysis-container' }>
				<Header as='h3' attached='top'>
					{ words.analysis.dateFilter }
				</Header>
				<Segment attached>
					<Form>
						<Form.Group widths={ 'equal' }>
							<Form.Field>
								<label>{ words.analysis.startDate }</label>
								<input type={ 'date' } value={ startDate } onChange={ (e) => {
									setStartDate(e.target.value);
								} }/>
							</Form.Field>
							<Form.Field>
								<label>{ words.analysis.endDate }</label>
								<input type={ 'date' } value={ endDate as any } onChange={ (e) => {
									setEndDate(e.target.value);
								} }/>
							</Form.Field>
						</Form.Group>
						<Form.Group>
							<Form.Field
								className={ 'sim-margin' }
								control={ Button }
								content={ words.analysis.clearFilters }
								onClick={ () => {
									setStartDate('');
									setEndDate('');
									setTimeout(() => {
										setApplyFilters(false);
									}, 200);
								} }
							/>
							<Form.Field
								className={ 'sim-margin' }
								disabled={ !startDate || !endDate }
								control={ Button }
								content={ words.analysis.applyFilters }
								onClick={ () => {
									setApplyFilters(true);
								} }
							/>
						</Form.Group>
					</Form>
				</Segment>
				<br/>
				<TitleView dir={ dir } hideDivider title={ words.analysis.accessoriesStatus }/>
				<div className={ 'analysis-cards-section' }>
					<ViewBox color={ 'violet' } title={ words.analysis.totalUsers } icon={ 'users' }
					         value={ totalUsers }/>
					<ViewBox color={ 'violet' } title={ words.analysis.totalDealersUsers } icon={ 'users' }
					         value={ totalDealersUsers }/>
					<ViewBox
						color={ 'violet' }
						title={ words.analysis.totalUsersBalance }
						icon={ 'dollar' }
						value={ totalUsersBalance }
					/>
					<ViewBox color={ 'violet' } title={ words.analysis.totalUsersPoints } icon={ 'gift' }
					         value={ totalUsersPoints }/>
				</div>
				<TitleView dir={ dir } hideDivider title={ words.analysis.gamesStatus }/>
				<div className={ 'analysis-cards-section' }>
					<ViewBox color={ 'grey' } title={ words.analysis.totalGamesInSystem } icon={ 'chess' }
					         value={ totalGamesInSystem }/>
					<ViewBox color={ 'grey' } title={ words.analysis.totalAccessoriesInSystem } icon={ 'gem' }
					         value={ totalAccessoriesInSystem }/>
				</div>
				<TitleView dir={ dir } hideDivider title={ words.analysis.earnsStatus }/>
				<div className={ 'analysis-cards-section' }>
					<ViewBox
						color={ 'green' }
						title={ words.analysis.totalEarns }
						icon={ 'chart pie' }
						value={ totalEarns }
					/>
					<ViewBox
						color={ 'green' }
						title={ words.analysis.totalBalanceAddToUsers }
						icon={ 'add' }
						value={ totalBalanceAddToUsers }
					/>
					<ViewBox
						color={ 'green' }
						title={ words.analysis.totalEarnsFromKeyGames }
						icon={ 'key' }
						value={ totalEarnsFromKeyGames }
					/>
					<ViewBox
						color={ 'green' }
						title={ words.analysis.totalEarnsFromChargingGames }
						icon={ 'ticket alternate' }
						value={ totalEarnsFromChargingGames }
					/>
					<ViewBox
						color={ 'green' }
						title={ words.analysis.totalEarnsFromAccessories }
						icon={ 'warehouse' }
						value={ totalEarnsFromAccessories }
					/>
				</div>
				<TitleView dir={ dir } hideDivider title={ words.analysis.ordersStatus }/>
				<div className={ 'analysis-cards-section' }>
					<ViewBox
						color={ 'red' }
						title={ words.analysis.totalOrders }
						icon={ 'cube' }
						value={ totalOrders }
					/>
					<ViewBox
						color={ 'red' }
						title={ words.analysis.totalInProgressOrders }
						icon={ 'clipboard list' }
						value={ totalInProgressOrders }
					/>
					<ViewBox
						color={ 'red' }
						title={ words.analysis.totalCompletedOrders }
						icon={ 'clipboard check' }
						value={ totalCompletedOrders }
					/>
					
					<ViewBox
						color={ 'red' }
						title={ words.analysis.totalChargingGamesOrders }
						icon={ 'shopping basket' }
						value={ totalChargingGamesOrders }
					/>
					<ViewBox
						color={ 'red' }
						title={ words.analysis.totalKeyGamesOrders }
						icon={ 'key' }
						value={ totalKeyGamesOrders }
					/>
					<ViewBox
						color={ 'red' }
						title={ words.analysis.totalAccessoriesOrders }
						icon={ 'shopping basket' }
						value={ totalAccessoriesOrders }
					/>
				</div>
				<br/>
				<TitleView dir={ dir } hideDivider title={ words.analysis.gamesTableStatus }/>
				<br/>
				<Table unStackable settings={tableSettings} data={gameCardTableItems.sort((o1: any, o2: any) => o2.totalEarns - o1.totalEarns) as any}/>
				<br/>
				<TitleView  dir={ dir } hideDivider title={ words.analysis.accessoriesTableStatus }/>
				<br/>
				<Table unStackable settings={tableSettings} data={accessoriesTableItems.sort((o1: any, o2: any) => o2.totalEarns - o1.totalEarns) as any}/>
			</div>
		</Wrapper>
	);
}


export default connect(generateMapStateEntityToProps([
	gameCardService.storeName,
	adminInvoiceService.storeName,
	adminOrderService.storeName,
	adminUserService.storeName,
	accessoryService.storeName
]))(FundAnalysis as any);