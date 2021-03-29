import EntityWrapper, {
	EntityWrapperConfig,
	EntityWrapperProps,
	EntityWrapperState
} from "../../../lib/components/wrapper/entity-wrapprt";
import { adminOrderService } from "../../../services/service-config";
import { LanguageSystemWords } from "../../../models/language";
import { Wrapper } from "../../shared/wrapper";
import { TableSetting } from "../../../lib/components/tabels";
import { DFormField } from "../../../lib/components/form/models";
import { getDefaultValidMsg } from "../../../lib/utils/utils";
import { connect } from "react-redux";
import { generateMapStateEntityToProps } from "../../../lib/store/util";
import { UserBaseDTO } from "../../../lib/models/user";
import { OrderDTO } from "../../../models/game";

interface ManageOrdersProps extends EntityWrapperProps<OrderDTO> {
	user: UserBaseDTO;
}

interface ManageOrdersState extends EntityWrapperState<OrderDTO> {
}

class ManageReviews extends EntityWrapper<OrderDTO, ManageOrdersProps, ManageOrdersState> {

	constructor(props: ManageOrdersProps) {
		super(props, adminOrderService);
	}
	
	init = (): void => {
	}
	
	getConfig(): EntityWrapperConfig {
		const word: LanguageSystemWords = this.word() as LanguageSystemWords;
		return {
			title: word.entities.order.reviewTitle,
			icon: 'star outline'
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
				fieldName: 'review_star',
				title: word.entities.order.review_star,
				type: 'rating',
				width: 100,
				center: true
			},
			{
				fieldName: 'review_date',
				title: word.entities.order.reviewDate,
				type: 'date',
				width: 80,
				center: true
			},
			{
				fieldName: 'hide_review',
				title: word.entities.order.hide_review,
				type: 'boolean',
				width: 80,
				center: true
			},
			{
				fieldName: 'review_description',
				title: word.entities.order.review_description,
				type: 'text',
				width: 500
			},
		];
	}
	
	getFormFields(): DFormField[][] {
		const words = this.state.word as LanguageSystemWords;
		return [
			[
				{
					fieldName: 'hide_review',
					type: 'boolean',
					defaultValue: false,
					fieldTitle: words.entities.order.hide_review
				},
			]
		];
	}
	
	getActionToTitleMap(): { [p: string]: string } {
		const words: LanguageSystemWords = this.word() as LanguageSystemWords;
		return {
			'edit': words.entities.order.actions.edit,
		};
	}
	
	getMessagesErrorForm(): { code: string; msg: string }[] {
		const words: LanguageSystemWords = this.word() as LanguageSystemWords;
		return [
			...getDefaultValidMsg(words)
		];
	}
	
	showAddButton(): boolean {
		return false;
	}
	
	showEditButton(): boolean {
		return true;
	}
	
}

export default connect(generateMapStateEntityToProps([ adminOrderService.storeName ]))(ManageReviews);