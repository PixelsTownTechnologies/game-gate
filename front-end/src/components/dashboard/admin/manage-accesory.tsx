import EntityWrapper, {
	EntityWrapperConfig,
	EntityWrapperProps,
	EntityWrapperState
} from "../../../lib/components/wrapper/entity-wrapprt";
import { accessoryService } from "../../../services/service-config";
import { LanguageSystemWords } from "../../../models/language";
import { Wrapper } from "../../shared/wrapper";
import { TableSetting } from "../../../lib/components/tabels";
import { DFormField } from "../../../lib/components/form/models";
import { costFormat, getDefaultValidMsg, removeEmpty } from "../../../lib/utils/utils";
import { AccessoryDTO, GameDTO } from "../../../models/game";
import React from 'react';
import { If } from "../../../lib/components/containers";
import { DialogFormActionResult } from "../../../lib/components/form/dialog-form";
import Dialog from "../../../lib/components/form/dialog";
import { TextArea } from "../../../lib/components/form/fields";
import { generateMapStateEntityToProps } from "../../../lib/store/util";
import { connect } from "react-redux";
import { Form } from 'semantic-ui-react';
import MDEditor from '@uiw/react-md-editor';
import { CountryDTO } from "../../../lib/models/country";


interface ManageAccessoryProps extends EntityWrapperProps<AccessoryDTO> {
	countries: CountryDTO[];
}

interface ManageAccessoryState extends EntityWrapperState<AccessoryDTO> {
	subDialogSettings?: {
		show: boolean;
		fieldName: string;
		game: GameDTO;
		type: 'editor' | 'text';
	};
	isSubDialogLoading: boolean;
	subDialogForm: any;
}


class ManageAccessory extends EntityWrapper<AccessoryDTO, ManageAccessoryProps, ManageAccessoryState> {
	
	constructor(props: ManageAccessoryProps) {
		super(props, accessoryService);
	}
	
	init = (): void => {
	}
	
	getConfig(): EntityWrapperConfig {
		const word: LanguageSystemWords = this.word() as LanguageSystemWords;
		return {
			title: word.entities.accessory.title,
			icon: 'life ring',
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
				title: word.entities.accessory.fields.name,
				center: true,
				type: 'text',
				width: 220
			},
			{
				fieldName: 'price',
				title: word.entities.accessory.fields.price,
				center: true,
				type: 'balance',
				width: 120
			},
			{
				fieldName: 'discount',
				title: word.entities.accessory.fields.discount,
				center: true,
				type: 'float',
				width: 120,
				displayValue: (value) => {
					return ( <div>{ `${ costFormat(value.discount) }%` }</div> );
				}
			},
			{
				fieldName: 'points',
				title: word.entities.accessory.fields.points,
				center: true,
				type: 'formattedNumber',
				width: 120
			},
			{
				fieldName: 'system_quantity',
				title: word.entities.accessory.fields.system_quantity,
				center: true,
				type: 'float',
				width: 120
			},
			{
				fieldName: 'max',
				title: word.entities.gameCard.fields.max,
				center: true,
				type: 'number',
				width: 120
			},
			{
				fieldName: 'min',
				title: word.entities.gameCard.fields.min,
				center: true,
				type: 'number',
				width: 120
			},
			{
				fieldName: 'show',
				title: word.entities.accessory.fields.show,
				center: true,
				type: 'boolean',
				width: 100
			},
			{
				fieldName: 'sold_flag',
				title: word.entities.accessory.fields.sold_flag,
				center: true,
				type: 'boolean',
				width: 80
			},
			{
				fieldName: 'type',
				title: word.entities.accessory.fields.type,
				type: 'text',
				center: true,
				width: 100
			},
			{
				fieldName: 'short_description',
				title: word.entities.accessory.fields.shortDescription,
				type: 'text',
				center: true,
				width: 300
			},
			{
				fieldName: 'details',
				title: word.entities.accessory.fields.details,
				type: 'viewButton',
				center: true,
				width: 80,
				onClick: (row) => {
					this.setState({
						subDialogSettings: {
							show: true,
							fieldName: 'details',
							game: row,
							type: "editor"
						},
						subDialogForm: {details: row['details']}
					});
				}
			},
			{
				fieldName: 'video',
				title: word.entities.accessory.fields.video,
				type: 'text',
				center: true,
				width: 120
			},
			{
				fieldName: 'logo',
				title: word.entities.accessory.fields.logo,
				type: 'link',
				center: true,
				width: 100,
				subSetting: {
					linkText: word.basic.show
				}
			},
		];
	}
	
	getFormFields(): DFormField[][] {
		const typeOptions = [ 'Computer',
			'Mobile', 'XBox', 'Laptops', 'Playstation', 'Apple', 'Android', 'Microsoft', 'Anime',
			'iPhone', 'PUBG', 'FIFA', 'Minecraft', 'Games', 'Other' ].map(v => {
			return (
				{
					text: v,
					value: v,
					key: v
				}
			);
		});
		const words = this.state.word as LanguageSystemWords;
		return [
			[
				{
					fieldName: 'name',
					type: 'text',
					fieldTitle: words.entities.accessory.fields.name,
					subInputOptions: {length: 64},
					validator: {required: true}
				},
				{
					fieldName: 'type',
					type: 'list',
					fieldTitle: words.entities.accessory.fields.type,
					subInputOptions: {listOptions: typeOptions},
					validator: {required: true}
				}
			],
			
			[
				{
					fieldName: 'price',
					type: 'range',
					fieldTitle: words.entities.accessory.fields.price,
					defaultValue: 5,
					subInputOptions: {max: 9999999999, min: 0.1}
				},
				{
					fieldName: 'discount',
					type: 'range',
					fieldTitle: words.entities.accessory.fields.discount,
					defaultValue: 0,
					subInputOptions: {max: 100, min: 0}
				}
			],
			[
				{
					fieldName: 'system_quantity',
					type: 'range',
					fieldTitle: words.entities.accessory.fields.system_quantity,
					defaultValue: 5,
					subInputOptions: {max: 9999999999, min: 0}
				},
				{
					fieldName: 'points',
					type: 'range',
					fieldTitle: words.entities.accessory.fields.points,
					defaultValue: 10,
					subInputOptions: {max: 9999999999, min: 0}
				}
			],
			[
				{
					fieldName: 'max',
					type: 'range',
					fieldTitle: words.entities.gameCard.fields.max,
					defaultValue: 10,
					subInputOptions: {max: 9999999999, min: 1}
				},
				{
					fieldName: 'min',
					type: 'range',
					fieldTitle: words.entities.gameCard.fields.min,
					defaultValue: 1,
					subInputOptions: {max: 9999999999, min: 1}
				}
			],
			[
				{
					fieldName: 'show',
					type: 'boolean',
					fieldTitle: words.entities.accessory.fields.show,
					defaultValue: true
				},
				{
					fieldName: 'sold_flag',
					type: 'boolean',
					fieldTitle: words.entities.accessory.fields.sold_flag,
					defaultValue: false
				}
			],
			[
				{
					fieldName: 'short_description',
					type: 'bigText',
					fieldTitle: words.entities.accessory.fields.shortDescription,
					subInputOptions: {length: 255}
				}
			],
			[
				{
					fieldName: 'details',
					type: 'bigText',
					fieldTitle: words.entities.accessory.fields.details,
					subInputOptions: {length: 255},
					disabled: true,
					defaultValue: 'No Details To View Here'
				}
			],
			[
				{
					fieldName: 'video',
					type: 'text',
					fieldTitle: words.entities.accessory.fields.video,
					subInputOptions: {length: 32}
				},
				{
					fieldName: 'logo',
					type: 'image',
					fieldTitle: words.entities.accessory.fields.logo
				},
			],
			[
				
				{
					fieldName: 'image1',
					type: 'image',
					fieldTitle: words.entities.accessory.fields.image1
				},
				{
					fieldName: 'image2',
					type: 'image',
					fieldTitle: words.entities.accessory.fields.image2
				},
				{
					fieldName: 'image3',
					type: 'image',
					fieldTitle: words.entities.accessory.fields.image3
				},
				{
					fieldName: 'image4',
					type: 'image',
					fieldTitle: words.entities.accessory.fields.image4
				}
			]
		];
	}
	
	getActionToTitleMap(): { [p: string]: string } {
		const words: LanguageSystemWords = this.word() as LanguageSystemWords;
		return {
			'edit': words.entities.accessory.actions.edit,
			'add': words.entities.accessory.actions.add,
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
	
	async handleSaveAction(form: AccessoryDTO): Promise<DialogFormActionResult> {
		if (this.state.selectedForm && [ 'edit', 'add' ].includes(this.state.action)) {
			[ 'logo', 'image1', 'image2', 'image3', 'image4' ].forEach(imageField => {
				( form as any )[imageField] = ( form as any )[imageField]
				&& typeof ( ( form as any )[imageField] ) === 'string'
				&& ( form as any )[imageField].split('http').length > 1 ? undefined : ( form as any )[imageField];
			})
			form = removeEmpty(form);
		}
		if (this.state.subDialogSettings) {
			const response = await this.service.updateEntity(this.state.subDialogSettings.game.id, form);
			if (response) {
				this.setState({selectedForm: this.getData()?.filter(e => e.id === this.state.selectedForm?.id)?.[0]});
				return {pass: true};
			}
		}
		return super.handleSaveAction(form);
	}
	
	showExtraElement(): any {
		return this.showDetailsDialog();
	}
	
	showDetailsDialog = () => {
		const words = this.state.word as LanguageSystemWords;
		const subDialogSettings = this.state.subDialogSettings;
		if (!subDialogSettings) {
			return null;
		}
		return (
			<Dialog
				open={ !!this.state.subDialogSettings && this.state.subDialogSettings.show }
				onClose={ () => {
					this.setState({subDialogSettings: undefined});
				} }
				headerText={ words.entities.game.actions.editSubData }
				size={ 'large' }
				closeButtonSetting={ {
					show: true,
					disabled: this.state.isSubDialogLoading,
					text: words.basic.cancel,
					onClick: () => {
						this.setState({subDialogSettings: undefined});
					}
				} }
				saveButtonSetting={
					{
						show: true,
						text: words.basic.save,
						loading: this.state.isSubDialogLoading,
						onClick: () => {
							this.setState({isSubDialogLoading: true});
							this.handleSaveAction(this.state.subDialogForm as any).then(d => {
								if (d) {
									this.setState({isSubDialogLoading: false, subDialogSettings: undefined});
								}
							});
						}
					}
				}
				deleteButtonSetting={ {
					show: false
				} }
			>
				<If flag={ subDialogSettings.type === 'editor' }>
					<MDEditor
						value={ this.state.subDialogForm[subDialogSettings.fieldName] }
						onChange={ (e) => {
							this.setState({subDialogForm: {[subDialogSettings.fieldName]: e}});
						} }
					/>
				</If>
				<If flag={ subDialogSettings.type === 'text' }>
					<Form>
						<TextArea
							value={ this.state.subDialogForm[subDialogSettings.fieldName] }
							length={ 255 }
							onChange={ (e) => {
								this.setState({subDialogForm: {[subDialogSettings.fieldName]: e}});
							} }
						/>
					</Form>
				</If>
			</Dialog>
		);
	}
}

export default connect(generateMapStateEntityToProps([ accessoryService.storeName ]))(ManageAccessory);