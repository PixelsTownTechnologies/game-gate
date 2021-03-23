import { BaseEntity } from "../../models/base";
import React from "react";
import { EntityService } from "../../services/entity-service/entity-service";
import { ACTIONS, EntityServiceConfig } from "../../services/models/models";
import { DIR } from "../../utils/constant";
import LanguageService from "../../services/language-service";
import { getEmptyForm, isEmpty, isTrueOrUndefined } from "../../utils/utils";
import { FlexSpace, If } from "../containers";
import { Divider, Input } from "semantic-ui-react";
import { Button } from "../basic";
import { Table, TableSetting } from "../tabels";
import { BaseComponentProps, BaseComponentState } from "../components";
import { DFormField } from "../form/models";
import DialogForm, { DialogFormActionResult } from "../form/dialog-form";
import { ENTITY_ACTIONS } from "../../services/models/actions";
import WindowService from "../../services/window.service";


export interface EntityWrapperProps<Entity extends BaseEntity> extends BaseComponentProps {
}

export interface EntityWrapperState<Entity extends BaseEntity> extends BaseComponentState {
	actionLoading: boolean;
	searchValue: string;
	action: string;
	selectedForm?: Entity;
}

export interface EntityWrapperConfig {
	title: string;
	icon?: string;
	showDelete?: boolean;
	showTableContainer?: boolean;
	showSubMenu?: boolean;
	hideTopSections?: boolean;
}

abstract class EntityWrapper<Entity extends BaseEntity,
	EntityProps extends EntityWrapperProps<Entity>,
	EntityState extends EntityWrapperState<Entity>> extends React.Component<EntityProps, EntityState> {
	
	tableRef: any;
	service: EntityService<Entity>;
	loaderId?: number;
	private languageServiceID?: number;
	private timerSubscribeID?: number;
	
	protected constructor(props: EntityProps, serviceConfig: EntityServiceConfig) {
		super(props);
		this.service = new EntityService<Entity>(serviceConfig);
		this.state = {
			direction: DIR.AUTO,
			word: {} as any,
			actionLoading: false,
			searchValue: '',
			action: ''
		} as EntityState;
		this.getData.bind(this);
		this.onTableSelect.bind(this);
		this.reloadContent.bind(this);
		this.handleSaveAction.bind(this);
	}
	
	setAction = (action: string) => {
		this.setState({action});
	}
	
	word = () => {
		return this.state.word;
	}
	
	direction = () => {
		return this.state.direction;
	}
	
	refreshData = () => {
		this.service.reload().then();
		this.setState({actionLoading: false});
	}
	
	public async reloadContent() {
		await this.service.reload();
		this.loaderId = this.service.loaderSubscribe(Object.values(ENTITY_ACTIONS), loading => {
			this.setState({actionLoading: loading});
		});
		if (this.state.selectedForm && this.state.selectedForm.id) {
			const list = this.getData().filter(e => e.id === this.state.selectedForm?.id);
			if (list && list.length > 0) {
				this.onTableSelect(list[0]);
			}
		}
	}
	
	public scrollToTable = () => {
		setTimeout(() => {
			if (this.tableRef) {
				this.tableRef?.scrollIntoView?.({behavior: "smooth"});
			}
		}, 200);
	}
	
	componentDidMount = () => {
		this.languageServiceID = LanguageService.subscribe((setting) => {
			if (this) {
				this.setState({direction: setting.direction, word: setting.words});
			}
		});
		this.timerSubscribeID = WindowService.timerSubscribe(() => {
			this.refreshData();
		});
		this.initialize();
	}
	
	componentWillUnmount = () => {
		if (this.languageServiceID) {
			LanguageService.unsubscribe(this.languageServiceID);
		}
		if (this.timerSubscribeID) {
			WindowService.timerUnsubscribe(this.timerSubscribeID);
		}
		this.destroy()
	}
	
	render() {
		return isTrueOrUndefined(this.props.pxIf) && !isEmpty(this.state.word) ?
			this.show(this.props, this.state)
			: null;
	}
	
	loaderSubscribe = (isLoading: boolean) => {
		this.setState({actionLoading: isLoading});
	}
	
	destroy = (): void => {
		if (this.loaderId) {
			this.service.loaderUnSubscribe(this.loaderId);
		}
	}
	
	initialize = (): void => {
		this.loaderId = this.service.loaderSubscribe(Object.values(ACTIONS), this.loaderSubscribe);
		this.service.find().then(() => {
			this.scrollToTable();
		});
		this.init();
	}
	
	showForm = () => {
		if (this.state.action && this.state.selectedForm) {
			const words = this.state.word;
			const actionTitle = this.getActionToTitleMap()[this.state.action];
			const config = this.getConfig();
			return (
				<DialogForm
					show={ !!this.state.action }
					title={ actionTitle }
					hideDeleteButton={ !config.showDelete }
					formSetting={ {
						action: this.state.action,
						form: this.state.selectedForm as any,
						fields: this.getFormFields(),
						messages: this.getMessagesErrorForm(),
					} }
					onClose={
						() => {
							if (this.state.action === 'add') {
								this.onTableSelect(undefined);
							}
							this.setAction('');
						}
					}
					onDelete={ async (id: number) => {
						if (id) {
							await this.service.deleteEntity(id);
							this.setAction('');
							this.onTableSelect(undefined);
						}
						return {pass: false, errors: [ words.serviceErrors.invalidId ]};
					} }
					onSave={ async (form) => {
						if (this.state.selectedForm) {
							return await this.handleSaveAction(form);
						}
						return {pass: false, errors: [ words.serviceErrors.generalFailed ]};
					} }
				/>
			);
		}
		return null;
	}
	
	show = (props: EntityProps, state: EntityState): JSX.Element | null => {
		const config = this.getConfig();
		const Wrapper = this.getWrapper();
		const tableSettings = this.getTableSettings();
		return (
			<Wrapper showSubMenu={ config.showSubMenu } title={ config.title } icon={ config.icon }
			         loading={ state.actionLoading }>
				<FlexSpace pxIf={ !config.hideTopSections }>
					<div className={ 'px-stp-5' }>
						<Input
							value={ this.state.searchValue }
							onChange={ (e) => {
								this.setState({searchValue: e.target.value});
							} }
							icon='search'
							placeholder={ state.word.basic.search }
						/>
					</div>
					<div className={ 'px-stp-5' }>
						{ this.getSubButtons() }
						<Button
							pxIf={ this.showEditButton() }
							color={ 'grey' }
							onClick={ () => this.setAction('edit') }
							disabled={ !state.selectedForm || state.action === 'add' }
							text={ state.word.basic.edit }
							iconSetting={ {name: 'edit', labelPosition: 'left', attachToButton: true} }
						/>
						<Button
							pxIf={ this.showAddButton() }
							onClick={ () => {
								this.onTableSelect(getEmptyForm('add', this.getFormFields()));
								this.setAction('add');
							} }
							text={ state.word.basic.add }
							iconSetting={ {name: 'plus', labelPosition: 'left', attachToButton: true} }
						/>
					</div>
				</FlexSpace>
				<Divider hidden/>
				<Table
					loadRef={ (el) => {
						this.tableRef = el;
					} }
					selectedId={ this.state.selectedForm?.id } onSelect={ (form: Entity) => this.onTableSelect(form) }
					showContainer={ isTrueOrUndefined(config.showTableContainer) } selectable unStackable
					onRefresh={ async () => {
						await this.reloadContent();
					} } settings={ tableSettings } data={ this.getFilteredData() }/>
				<If flag={ this.showExtraElement() }>
					<Divider hidden/>
					{ this.showExtraElement() }
				</If>
				{ this.showForm() }
			</Wrapper>
		);
	}
	
	public onTableSelect(form?: Entity) {
		this.setState({selectedForm: form});
	}
	
	public async handleSaveAction(form: Entity): Promise<DialogFormActionResult> {
		if (this.state.selectedForm) {
			if (this.state.action === 'edit') {
				const response = await this.service.updateEntity(this.state.selectedForm.id, form);
				if (response) {
					this.onTableSelect(this.getData()?.filter(e => e.id === this.state.selectedForm?.id)?.[0])
					return {pass: true};
				}
			}
			if (this.state.action === 'add') {
				const response = await this.service.createEntity(form);
				if (response) {
					this.onTableSelect(undefined);
					return {pass: true};
				}
			}
		}
		return {pass: false};
	}
	
	public getFilteredData = () => {
		return ( this.getData().filter((data: any) => {
			return Object.keys(data).filter(key => {
				const date = new Date(`${ data[key] }`).toLocaleDateString();
				if (date !== 'Invalid Date') {
					return date.includes(this.state.searchValue ? this.state.searchValue : '');
				}
				return `${ data[key] }`.includes(this.state.searchValue ? this.state.searchValue : '');
			}).length > 0
		}) ).sort((e1, e2) => e2.id - e1.id);
	}
	
	public getData(): Entity[] {
		return ( this.props as any )[this.service.entityConfig.storeName]
			? ( this.props as any )[this.service.entityConfig.storeName] as Entity[] : [];
	}
	
	abstract init(): void;
	
	abstract getConfig(): EntityWrapperConfig;
	
	abstract getWrapper(): React.ComponentType<any>;
	
	abstract getTableSettings(): TableSetting[];
	
	abstract getSubButtons(): any;
	
	abstract getFormFields(): DFormField[][];
	
	abstract getActionToTitleMap(): { [action: string]: string };
	
	abstract getMessagesErrorForm(): { code: string, msg: string }[];
	
	abstract showAddButton(): boolean;
	
	abstract showEditButton(): boolean;
	
	public showExtraElement(): any {
		return null;
	}
}

export default EntityWrapper;