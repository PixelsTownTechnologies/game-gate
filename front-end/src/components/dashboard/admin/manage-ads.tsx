import EntityWrapper, {
	EntityWrapperConfig,
	EntityWrapperProps,
	EntityWrapperState
} from "../../../lib/components/wrapper/entity-wrapprt";
import { LanguageSystemWords } from "../../../models/language";
import { Wrapper } from "../../shared/wrapper";
import { TableSetting } from "../../../lib/components/tabels";
import { DFormField } from "../../../lib/components/form/models";
import { getDefaultValidMsg, removeEmpty } from "../../../lib/utils/utils";
import { connect } from "react-redux";
import { generateMapStateEntityToProps } from "../../../lib/store/util";
import { adsService } from "../../../services/service-config";
import { DialogFormActionResult } from "../../../lib/components/form/dialog-form";
import { AdsDTO, adsType } from "../../../models/ads";

interface ManageAdsProps extends EntityWrapperProps<AdsDTO> {
}

interface ManageAdsState extends EntityWrapperState<AdsDTO> {
}


class ManageAds extends EntityWrapper<AdsDTO, ManageAdsProps, ManageAdsState> {
	
	constructor(props: ManageAdsProps) {
		super(props, adsService);
	}
	
	init = (): void => {
	}
	
	getConfig(): EntityWrapperConfig {
		const word: LanguageSystemWords = this.word() as LanguageSystemWords;
		return {
			title: word.entities.ads.title,
			icon: 'bullhorn',
			showDelete: true
		};
	}
	
	async handleSaveAction(form: AdsDTO): Promise<DialogFormActionResult> {
		if (this.state.selectedForm && [ 'edit', 'add' ].includes(this.state.action)) {
			form.cover = form.cover
			&& typeof ( form.cover ) === 'string'
			&& form.cover.split('http').length > 1 ? undefined : form.cover;
			form = removeEmpty(form);
		}
		return super.handleSaveAction(form);
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
				title: word.entities.ads.fields.id,
				type: 'text',
				width: 100,
				center: true
			},
			{
				fieldName: 'name',
				title: word.entities.ads.fields.name,
				type: 'text',
				width: 150
			},
			{
				fieldName: 'show',
				title: word.entities.ads.fields.show,
				type: 'boolean',
				width: 80
			},
			{
				fieldName: 'type',
				title: word.entities.ads.fields.type,
				type: 'text',
				width: 80
			},
			{
				fieldName: 'cover',
				title: word.entities.ads.fields.cover,
				type: 'link',
				width: 70,
				subSetting: {
					linkText: word.basic.show
				}
			},
			{
				fieldName: 'forward_id',
				title: word.entities.ads.fields.forward_id,
				type: 'text',
				width: 120
			},
			{
				fieldName: 'external_link',
				title: word.entities.ads.fields.external_link,
				type: 'text',
				width: 250
			},
		];
	}
	
	getFormFields(): DFormField[][] {
		const words = this.state.word as LanguageSystemWords;
		return [
			[
				{
					fieldName: 'name',
					type: 'text',
					fieldTitle: words.entities.ads.fields.name,
					subInputOptions: {
						length: 128
					}
				},
				{
					fieldName: 'show',
					type: 'boolean',
					fieldTitle: words.entities.ads.fields.show
				}
			],
			[
				{
					fieldName: 'type',
					type: 'list',
					fieldTitle: words.entities.ads.fields.type,
					subInputOptions: {
						listOptions: adsType.map(t => ( {text: t, value: t, key: t} ))
					},
					validator: {
						required: true
					}
				},
				{
					fieldName: 'forward_id',
					type: 'text',
					fieldTitle: words.entities.ads.fields.forward_id,
					subInputOptions: {
						length: 16
					}
				}
			],
			[
				{
					fieldName: 'external_link',
					type: 'bigText',
					fieldTitle: words.entities.ads.fields.external_link
				}
			],
			[
				{
					fieldName: 'cover',
					type: 'image',
					fieldTitle: words.entities.ads.fields.cover
				}
			]
		];
	}
	
	getActionToTitleMap(): { [p: string]: string } {
		const words: LanguageSystemWords = this.word() as LanguageSystemWords;
		return {
			'edit': words.entities.ads.action.edit,
			'add': words.entities.ads.action.add
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

export default connect(generateMapStateEntityToProps([ adsService.storeName ]))(ManageAds);