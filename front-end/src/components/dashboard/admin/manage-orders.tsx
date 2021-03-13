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
import { costFormat, getDefaultValidMsg } from "../../../lib/utils/utils";
import { connect } from "react-redux";
import { generateMapStateEntityToProps } from "../../../lib/store/util";
import { UserBaseDTO } from "../../../lib/models/user";
import React from "react";
import { OrderDTO } from "../../../models/game";
import { Button, Dropdown, Label } from "semantic-ui-react";
import { OrderWidgetView } from "../user/history/single-order-viewer";

interface ManageOrdersProps extends EntityWrapperProps<OrderDTO> {
	user: UserBaseDTO;
}

interface ManageOrdersState extends EntityWrapperState<OrderDTO> {
}

const actions = {
	convertToComplete: 'convertToComplete',
	convertToInProgress: 'convertToInProgress',
	convertToError: 'convertToError'
};

class ManageOrders extends EntityWrapper<OrderDTO, ManageOrdersProps, ManageOrdersState> {
	
	divRef: any;
	
	constructor(props: ManageOrdersProps) {
		super(props, adminOrderService);
	}
	
	init = (): void => {
	}
	
	getConfig(): EntityWrapperConfig {
		const word: LanguageSystemWords = this.word() as LanguageSystemWords;
		return {
			title: word.title.manageOrders,
			icon: 'first order'
		};
	}
	
	getWrapper = () => {
		return Wrapper;
	}
	
	getSubButtons = () => {
		const words = this.state.word as LanguageSystemWords;
		const isDisabled = !this.state.selectedForm || this.state.actionLoading;
		return (
			<Button.Group dir={ this.state.direction } className={ 'px-lib button-list' } color={ 'grey' }>
				<Button
					loading={ this.state.actionLoading }
					onClick={ () => this.setAction('edit') }
					disabled={ isDisabled }
				>
					{ words.entities.order.actions.edit }
				</Button>
				<Dropdown
					className='button icon'
					floating
					loading={ this.state.actionLoading }
					disabled={ isDisabled }
				>
					<Dropdown.Menu>
						<Dropdown.Item
							onClick={ () => this.handleStateChange(actions.convertToComplete) }
							disabled={ isDisabled }>{ words.entities.order.actions.convertToComplete }</Dropdown.Item>
						<Dropdown.Item
							onClick={ () => this.handleStateChange(actions.convertToInProgress) }
							disabled={ isDisabled }>{ words.entities.order.actions.convertToInProgress }</Dropdown.Item>
						<Dropdown.Item
							onClick={ () => this.handleStateChange(actions.convertToError) }
							disabled={ isDisabled }>{ words.entities.order.actions.convertToError }</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Button.Group>
		);
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
				fieldName: 'state',
				title: word.entities.order.state,
				type: 'valueMap',
				width: 100,
				center: true,
				displayValue: (row) => {
					const colorMap = {
						'I': 'teal',
						'E': 'red',
						'C': 'green'
					} as any;
					return (
						<Label
							color={ colorMap[row.state] }>{ ( word.entities.order.stateMap as any )[row.state] }</Label>
					);
				}
			},
			{
				fieldName: 'quantity',
				title: word.entities.order.quantity,
				type: 'number',
				width: 100,
				center: true
			},
			{
				fieldName: 'cost',
				title: word.entities.order.cost,
				type: 'formattedNumber',
				width: 100,
				center: true,
				displayValue: (row) => {
					return `$${ costFormat(row.cost) }` as any;
				}
			},
			{
				fieldName: 'owner.id',
				title: word.entities.order.ownerId,
				type: 'text',
				width: 100,
				center: true
			},
			{
				fieldName: 'owner.username',
				title: word.entities.order.ownerUsername,
				type: 'text',
				width: 120,
				center: true
			},
			{
				fieldName: 'create',
				title: word.entities.order.orderDate,
				type: 'date',
				width: 100,
				center: true
			},
			{
				fieldName: 'error_msg',
				title: word.entities.order.error_msg,
				type: 'text',
				width: 200,
				center: true
			},
			{
				fieldName: 'account_id',
				title: word.entities.order.account_id,
				type: 'text',
				width: 150,
				center: true
			},
			{
				fieldName: 'extra_info',
				title: word.entities.order.extra_info,
				type: 'text',
				width: 150
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
				width: 120,
				center: true
			},
			{
				fieldName: 'review_description',
				title: word.entities.order.review_description,
				type: 'text',
				width: 320
			},
		];
	}
	
	getFormFields(): DFormField[][] {
		const words = this.state.word as LanguageSystemWords;
		return [
			[
				{
					fieldName: 'error_msg',
					type: 'bigText',
					defaultValue: '',
					fieldTitle: words.entities.order.error_msg
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
		return false;
	}
	
	onTableSelect(form: OrderDTO) {
		super.onTableSelect(form);
		setTimeout(() => {
			if (this.divRef) {
				this.divRef.scrollIntoView({behavior: "smooth"});
			}
		}, 100);
	}
	
	handleStateChange = (state: string) => {
		if (this.state.selectedForm && state) {
			const form = {
				state: state === actions.convertToError
					? 'E' : ( state === actions.convertToInProgress ? 'I' : 'C' )
			};
			this.setState({actionLoading: true});
			this.service.updateEntity(this.state.selectedForm.id, form).then(data => {
				if (data) {
					this.setState({
						selectedForm: this.getData()
							?.filter(e => e.id === this.state.selectedForm?.id)?.[0], actionLoading: false
					});
				}
			});
			
		}
	}
	
	showExtraElement(): any {
		if (!this.state.selectedForm) {
			return null;
		}
		return (
			<div className={ 'white-bg' } ref={ (el) => {
				this.divRef = el;
			} }>
				<OrderWidgetView orderView={ this.state.selectedForm } hideKeySection hideReviewSection/>
			</div>
		);
	}
	
}

export default connect(generateMapStateEntityToProps([ adminOrderService.storeName ]))(ManageOrders);