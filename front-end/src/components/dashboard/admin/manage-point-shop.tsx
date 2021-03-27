import EntityWrapper, {
	EntityWrapperConfig,
	EntityWrapperProps,
	EntityWrapperState
} from "../../../lib/components/wrapper/entity-wrapprt";
import { pointShopService } from "../../../services/service-config";
import { LanguageSystemWords } from "../../../models/language";
import { Wrapper } from "../../shared/wrapper";
import { TableSetting } from "../../../lib/components/tabels";
import { DFormField } from "../../../lib/components/form/models";
import { getDefaultValidMsg, isEmpty } from "../../../lib/utils/utils";
import { GameCardDTO } from "../../../models/game";
import { connect } from "react-redux";
import { PointShopDTO } from "../../../models/point-shop";
import { StoreState } from "../../../lib/models/application";
import { HomeDTO } from "../../../models/home-details";
import { manipulateHomeData } from "../../../utils/util";


interface ManagePointShopProps extends EntityWrapperProps<PointShopDTO> {
	gameCards: GameCardDTO[];
}

interface ManagePointShopState extends EntityWrapperState<PointShopDTO> {
}


class ManagePointShop extends EntityWrapper<PointShopDTO, ManagePointShopProps, ManagePointShopState> {
	
	constructor(props: ManagePointShopProps) {
		super(props, pointShopService);
	}
	
	init = (): void => {
	}
	
	getConfig(): EntityWrapperConfig {
		const word: LanguageSystemWords = this.word() as LanguageSystemWords;
		return {
			title: word.entities.pointShop.title,
			icon: 'gift',
			showDelete: true
		};
	}
	
	getWrapper = () => {
		return Wrapper;
	}
	
	getSubButtons = () => {
		return null;
	}
	
	getTableSettings(): TableSetting[] {
		const word: LanguageSystemWords = this.word() as LanguageSystemWords;
		return [
			{
				fieldName: 'id',
				title: word.fields.id,
				type: 'text',
				width: 80,
				center: true
			},
			{
				fieldName: 'name',
				title: word.entities.embedGames.fields.name,
				center: true,
				type: 'text',
				width: 150
			},
			{
				fieldName: 'point_cost',
				title: word.entities.pointShop.fields.point_cost,
				center: true,
				type: 'formattedNumber',
				width: 150,
			},
			{
				fieldName: 'quantity',
				title: word.entities.pointShop.fields.quantity,
				center: true,
				type: 'formattedNumber',
				width: 120,
			},
			{
				fieldName: 'money_reword',
				title: word.entities.pointShop.fields.money_reword,
				center: true,
				type: 'balance',
				width: 100,
			},
			{
				fieldName: 'game_card.name',
				title: word.entities.pointShop.fields.game_card,
				type: 'text',
				center: true,
				width: 200
			},
		];
	}
	
	getFormFields(): DFormField[][] {
		let gameCardOptions = this.props.gameCards ?
			this.props.gameCards.map(gc => {
				return {
					text: `[${ gc.id }] ${ gc.name }`,
					value: gc.id,
					key: gc.id
				}
			}) as any[]
			: [];
		gameCardOptions = [ {
			text: `None`,
			value: null,
			key: null
		}, ...gameCardOptions ]
		const words = this.state.word as LanguageSystemWords;
		return [
			[
				{
					fieldName: 'name',
					type: 'text',
					fieldTitle: words.entities.embedGames.fields.name,
					subInputOptions: {length: 64},
					validator: {required: true}
				},
				{
					fieldName: 'game_card',
					type: 'list',
					fieldTitle: words.entities.pointShop.fields.game_card,
					subInputOptions: {listOptions: gameCardOptions}
				},
			],
			[
				{
					fieldName: 'point_cost',
					type: 'number',
					fieldTitle: words.entities.pointShop.fields.point_cost,
					validator: {required: true},
					defaultValue: 1
				},
				{
					fieldName: 'quantity',
					type: 'number',
					fieldTitle: words.entities.pointShop.fields.quantity,
					validator: {required: true},
					defaultValue: 1
				},
			],
			[
				{
					fieldName: 'money_reword',
					type: 'number',
					fieldTitle: words.entities.pointShop.fields.money_reword
				},
			],
		];
	}
	
	public onTableSelect(form: PointShopDTO) {
		this.setState({selectedForm: form ? {...form, game_card: ( form.game_card ? form.game_card.id : null ) as any}: undefined});
	}
	
	getActionToTitleMap(): { [p: string]: string } {
		const words: LanguageSystemWords = this.word() as LanguageSystemWords;
		return {
			'edit': words.entities.pointShop.actions.edit,
			'add': words.entities.pointShop.actions.add,
		};
	}
	
	getMessagesErrorForm(): { code: string; msg: string }[] {
		const words: LanguageSystemWords = this.word() as LanguageSystemWords;
		return [
			...getDefaultValidMsg(words)
		];
	}
	
	showAddButton(): boolean {
		return true;
	}
	
	showEditButton(): boolean {
		return true;
	}
	
}

export default connect((state: StoreState, ownProps) => {
	const entity = state.entity;
	const home: ( HomeDTO | null ) = entity['home'] ? manipulateHomeData(entity['home'] as HomeDTO) : null;
	return {
		...ownProps, [pointShopService.storeName]:
			entity[pointShopService.storeName] ? entity[pointShopService.storeName] : []
		, gameCards: home && !isEmpty(home.gameCards) ? home.gameCards : []
	}
})(ManagePointShop);