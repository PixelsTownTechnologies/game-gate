import { EnumDTO } from "../../../lib/models/enum";
import EntityWrapper, {
	EntityWrapperConfig,
	EntityWrapperProps,
	EntityWrapperState
} from "../../../lib/components/wrapper/entity-wrapprt";
import React from "react";
import { enumsService, homeService } from "../../../services/service-config";
import { LanguageSystemWords } from "../../../models/language";
import { Wrapper } from "../../shared/wrapper";
import { TableSetting } from "../../../lib/components/tabels";
import { DFormField } from "../../../lib/components/form/models";
import { costFormat, generateId, getDefaultValidMsg } from "../../../lib/utils/utils";
import { HomeDetails, SystemEntities } from "../../../models/home-details";
import { Button } from "../../../lib/components/basic";
import { Dropdown, Form, Segment } from "semantic-ui-react";
import { TextArea, TextField } from "../../../lib/components/form/fields";
import Dialog from "../../../lib/components/form/dialog";
import { connect } from "react-redux";
import { generateMapStateEntityToProps } from "../../../lib/store/util";
import { FlexSpace } from "../../../lib/components/containers";
import { EntityService } from "../../../lib/services/entity-service/entity-service";
import { DialogFormActionResult } from "../../../lib/components/form/dialog-form";

interface ManageEnumsProps extends EntityWrapperProps<EnumDTO> {

}

interface ManageEnumsState extends EntityWrapperState<EnumDTO> {
	homeDetails?: HomeDetails;
	gamesOptions: {
		text: string;
		value: number;
		key: string;
	}[];
	gameCardsOptions: {
		text: string;
		value: number;
		key: string;
	}[];
	adsOptions: {
		text: string;
		value: number;
		key: string;
	}[];
	embedGamesOptions: {
		text: string;
		value: number;
		key: string;
	}[];
	accessoriesOptions: {
		text: string;
		value: number;
		key: string;
	}[];
	resourcesOptions: {
		text: string;
		value: number;
		key: string;
	}[];
}


class ManageEnums extends EntityWrapper<EnumDTO, ManageEnumsProps, ManageEnumsState> {
	
	constructor(props: ManageEnumsProps) {
		super(props, enumsService);
	}
	
	init = (): void => {
		this.setState({actionLoading: true});
		new EntityService<any>(homeService).findSingleNoStore().then((data) => {
			const systemEntities = data as SystemEntities;
			const gamesOptions = [] as any[];
			const gameCardsOptions = [] as any[];
			const accessoriesOptions = [] as any[];
			const adsOptions = [] as any[];
			const embedGamesOptions = [] as any[];
			const resourcesOptions = [] as any[];
			if (systemEntities.games) {
				systemEntities.games.forEach(game => {
					gamesOptions.push({
						text: `${ game.id } - ${ game.name }`,
						value: game.id,
						key: game.id
					});
				});
			}
			if (systemEntities.gameCards) {
				systemEntities.gameCards.forEach(gameCard => {
					gameCardsOptions.push({
						text: `${ gameCard.id } - ${ gameCard.name } - ${ costFormat(gameCard.discount) }%`,
						value: gameCard.id,
						key: gameCard.id
					});
				});
			}
			if (systemEntities.accessory) {
				systemEntities.accessory.forEach(acc => {
					accessoriesOptions.push({
						text: `${ acc.id } - ${ acc.name }`,
						value: acc.id,
						key: acc.id
					});
				});
			}
			if (systemEntities.ads) {
				adsOptions.push({
					text: `None`,
					value: 0,
					key: 0
				});
				systemEntities.ads.forEach(ad => {
					adsOptions.push({
						text: `${ ad.id } - ${ ad.name }`,
						value: ad.id,
						key: ad.id
					});
				});
			}
			if (systemEntities.embedGames) {
				systemEntities.embedGames.forEach(eg => {
					embedGamesOptions.push({
						text: `${ eg.id } - ${ eg.name }`,
						value: eg.id,
						key: eg.id
					});
				});
			}
			if (systemEntities.resources) {
				systemEntities.resources.forEach(eg => {
					resourcesOptions.push({
						text: `${ eg.id } - ${ eg.name } - ${ eg.file }`,
						value: eg.file,
						key: eg.file
					});
				});
			}
			this.setState({
				gameCardsOptions,
				gamesOptions,
				embedGamesOptions,
				accessoriesOptions,
				resourcesOptions,
				adsOptions,
				actionLoading: false
			})
		});
	}
	
	getConfig(): EntityWrapperConfig {
		const word: LanguageSystemWords = this.word() as LanguageSystemWords;
		return {
			title: word.title.manageEnums,
			icon: 'list alternate'
		};
	}
	
	getWrapper = () => {
		return Wrapper;
	}
	
	getSubButtons = () => {
		return (
			<Button
				onClick={ () => this.setState({homeDetails: this.getHomeConfigObject()}) }
				text={ ( this.word() as LanguageSystemWords ).homeSettings.editConfig }
				iconSetting={ {name: 'edit', labelPosition: 'left', attachToButton: true} }
			/>
		);
	}
	
	getTableSettings(): TableSetting[] {
		const word: LanguageSystemWords = this.word() as LanguageSystemWords;
		return [
			{
				fieldName: 'id',
				title: word.fields.id,
				type: 'text',
				width: 100,
				center: true
			},
			{
				fieldName: 'name',
				title: word.fields.name,
				type: 'text',
				width: 120
			},
			{
				fieldName: 'data',
				title: word.fields.value,
				type: 'text',
				width: 220
			},
		];
	}
	
	getFormFields(): DFormField[][] {
		const words = this.state.word;
		const selectedEnum = this.state.selectedForm;
		if (!selectedEnum) {
			return [];
		}
		return [
			[
				{
					fieldName: 'data',
					type: selectedEnum.type,
					fieldTitle: words.fields.value,
					subInputOptions: {min: 0, max: selectedEnum.max_value ? selectedEnum.max_value : 999999999999}
				}
			]
		];
	}
	
	getActionToTitleMap(): { [p: string]: string } {
		const words: LanguageSystemWords = this.word() as LanguageSystemWords;
		return {
			'edit': words.title.actions.editEnums,
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
	
	getData(): EnumDTO[] {
		return super.getData().filter(e => e.name !== 'Home Config');
	}
	
	getHomeConfigEnum = (): EnumDTO => {
		return super.getData()?.filter(e => e.name === 'Home Config')?.[0];
	}
	
	getHomeConfigObject = (): HomeDetails => {
		const homeConfigValue = super.getData()?.filter(e => e.name === 'Home Config')?.[0]?.values;
		return homeConfigValue ? JSON.parse(homeConfigValue) : {
			mainAds1: 0,
			mainAds2: 0,
			dialogAds: 0,
			homeVideo: '',
			accessorySection: {
				accessories: [],
				description: {
					en: '',
					ar: ''
				},
				id: generateId(),
				title: {
					en: '',
					ar: ''
				}
			},
			embedGameSection: {
				embedGames: [],
				description: {
					en: '',
					ar: ''
				},
				id: generateId(),
				title: {
					en: '',
					ar: ''
				}
			},
			mainImages: [],
			sections: [],
			specialDeals: {
				id: generateId(),
				description: {
					en: '',
					ar: ''
				},
				gameCards: [],
				games: [],
				title: {
					en: '',
					ar: ''
				},
			}
		} as HomeDetails;
	}
	
	renderMainHomeText = (homeDetails: HomeDetails, words: LanguageSystemWords) => {
		return (
			<Segment.Group>
				<Segment>
					<Form>
						<Form.Field>
							<label>{ words.homeSettings.homeAds1 }</label>
							<Dropdown
								placeholder='Ads'
								fluid
								search
								selection
								onChange={ (e, {value}) => {
									const newHomeDetails = homeDetails;
									newHomeDetails.mainAds1 = value as number;
									this.setState({homeDetails: newHomeDetails});
								} }
								options={ this.state.adsOptions }
								value={ homeDetails?.mainAds1 ? homeDetails?.mainAds1 as number : 0 }
							/>
						</Form.Field>
						<Form.Field>
							<label>{ words.homeSettings.homeAds2 }</label>
							<Dropdown
								placeholder='Ads'
								fluid
								search
								selection
								onChange={ (e, {value}) => {
									const newHomeDetails = homeDetails;
									newHomeDetails.mainAds2 = value as number;
									this.setState({homeDetails: newHomeDetails});
								} }
								options={ this.state.adsOptions }
								value={ homeDetails.mainAds2 ? homeDetails.mainAds2 as number : 0 }
							/>
						</Form.Field>
						<Form.Field>
							<label>{ words.homeSettings.dialogAds }</label>
							<Dropdown
								placeholder='Ads'
								fluid
								search
								selection
								onChange={ (e, {value}) => {
									const newHomeDetails = homeDetails;
									newHomeDetails.dialogAds = value as number;
									this.setState({homeDetails: newHomeDetails});
								} }
								options={ this.state.adsOptions }
								value={ homeDetails.dialogAds ? homeDetails.dialogAds as number : 0 }
							/>
						</Form.Field>
						<Form.Field>
							<label>{ words.homeSettings.homeImages }</label>
							<Dropdown
								placeholder={ words.homeSettings.homeImages }
								fluid
								search
								multiple
								selection
								onChange={ (e, {value}) => {
									const newHomeDetails = homeDetails;
									newHomeDetails.mainImages = value as any[];
									this.setState({homeDetails: newHomeDetails});
								} }
								options={ this.state.resourcesOptions }
								value={ homeDetails.mainImages }
							/>
						</Form.Field>
						<Form.Field>
							<label>{ words.homeSettings.homeVideoId }</label>
							<TextField
								onChange={ (value) => {
									const newHomeDetails = homeDetails;
									newHomeDetails.homeVideo = value;
									this.setState({homeDetails: newHomeDetails});
								} }
								value={ homeDetails.homeVideo }
							/>
						</Form.Field>
					</Form>
				</Segment>
			</Segment.Group>
		);
	}
	
	renderSpecialDealsText = (homeDetails: HomeDetails, words: LanguageSystemWords) => {
		return (
			<Segment.Group>
				<Segment>{ words.homeSettings.specialDeals }</Segment>
				<Segment.Group>
					<Segment.Group>
						<Segment>{ words.homeSettings.sectionTitle } </Segment>
						<Segment>
							<Form>
								<Form.Field>
									<label>{ words.homeSettings.ArText }</label>
									<TextField
										onChange={ (value) => {
											const newHomeDetails = homeDetails;
											homeDetails.specialDeals.title.ar = value;
											this.setState({homeDetails: newHomeDetails});
										} }
										value={ homeDetails.specialDeals.title.ar }
									/>
								</Form.Field>
								<Form.Field>
									<label>{ words.homeSettings.EnText }</label>
									<TextField
										onChange={ (value) => {
											const newHomeDetails = homeDetails;
											homeDetails.specialDeals.title.en = value;
											this.setState({homeDetails: newHomeDetails});
										} }
										value={ homeDetails.specialDeals.title.en }
									/>
								</Form.Field>
							</Form>
						</Segment>
					</Segment.Group>
					<Segment.Group>
						<Segment>{ words.homeSettings.sectionDescription }</Segment>
						<Segment>
							<Form>
								<Form.Field>
									<label>{ words.homeSettings.ArText }</label>
									<TextArea
										onChange={ (value) => {
											const newHomeDetails = homeDetails;
											newHomeDetails.specialDeals.description.ar = value;
											this.setState({homeDetails: newHomeDetails});
										} }
										value={ homeDetails.specialDeals.description.ar }
									/>
								</Form.Field>
								<Form.Field>
									<label>{ words.homeSettings.EnText }</label>
									<TextArea
										onChange={ (value) => {
											const newHomeDetails = homeDetails;
											homeDetails.specialDeals.description.en = value;
											this.setState({homeDetails: newHomeDetails});
										} }
										value={ homeDetails.specialDeals.description.en }
									/>
								</Form.Field>
							</Form>
						</Segment>
					</Segment.Group>
					<Segment>
						<Form>
							<Form.Field>
								<label>{ words.homeSettings.selectedGameCards }</label>
								<Dropdown
									placeholder='Game Cards'
									fluid
									multiple
									search
									selection
									onChange={ (e, {value}) => {
										const newHomeDetails = homeDetails;
										newHomeDetails.specialDeals.gameCards = value as number[]
										this.setState({homeDetails: newHomeDetails});
									} }
									options={ this.state.gameCardsOptions }
									value={ homeDetails.specialDeals.gameCards as number[] }
								/>
							</Form.Field>
						</Form>
					</Segment>
				</Segment.Group>
			</Segment.Group>
		);
	}
	
	renderAccessoryDealsText = (homeDetails: HomeDetails, words: LanguageSystemWords) => {
		return (
			<Segment.Group>
				<Segment>{ words.homeSettings.accessorySection }</Segment>
				<Segment.Group>
					<Segment.Group>
						<Segment>{ words.homeSettings.sectionTitle } </Segment>
						<Segment>
							<Form>
								<Form.Field>
									<label>{ words.homeSettings.ArText }</label>
									<TextField
										onChange={ (value) => {
											const newHomeDetails = homeDetails;
											homeDetails.accessorySection.title.ar = value;
											this.setState({homeDetails: newHomeDetails});
										} }
										value={ homeDetails.accessorySection.title.ar }
									/>
								</Form.Field>
								<Form.Field>
									<label>{ words.homeSettings.EnText }</label>
									<TextField
										onChange={ (value) => {
											const newHomeDetails = homeDetails;
											homeDetails.accessorySection.title.en = value;
											this.setState({homeDetails: newHomeDetails});
										} }
										value={ homeDetails.accessorySection.title.en }
									/>
								</Form.Field>
							</Form>
						</Segment>
					</Segment.Group>
					<Segment.Group>
						<Segment>{ words.homeSettings.sectionDescription }</Segment>
						<Segment>
							<Form>
								<Form.Field>
									<label>{ words.homeSettings.ArText }</label>
									<TextArea
										onChange={ (value) => {
											const newHomeDetails = homeDetails;
											newHomeDetails.accessorySection.description.ar = value;
											this.setState({homeDetails: newHomeDetails});
										} }
										value={ homeDetails.accessorySection.description.ar }
									/>
								</Form.Field>
								<Form.Field>
									<label>{ words.homeSettings.EnText }</label>
									<TextArea
										onChange={ (value) => {
											const newHomeDetails = homeDetails;
											homeDetails.accessorySection.description.en = value;
											this.setState({homeDetails: newHomeDetails});
										} }
										value={ homeDetails.accessorySection.description.en }
									/>
								</Form.Field>
							</Form>
						</Segment>
					</Segment.Group>
					<Segment>
						<Form>
							<Form.Field>
								<label>{ words.homeSettings.selectedAccessory }</label>
								<Dropdown
									placeholder='Accessories'
									fluid
									multiple
									search
									selection
									onChange={ (e, {value}) => {
										const newHomeDetails = homeDetails;
										newHomeDetails.accessorySection.accessories = value as number[]
										this.setState({homeDetails: newHomeDetails});
									} }
									options={ this.state.accessoriesOptions }
									value={ homeDetails.accessorySection.accessories as number[] }
								/>
							</Form.Field>
						</Form>
					</Segment>
				</Segment.Group>
			</Segment.Group>
		);
	}
	
	renderEmbedGamesDealsText = (homeDetails: HomeDetails, words: LanguageSystemWords) => {
		return (
			<Segment.Group>
				<Segment>{ words.homeSettings.embedGameSection }</Segment>
				<Segment.Group>
					<Segment.Group>
						<Segment>{ words.homeSettings.sectionTitle } </Segment>
						<Segment>
							<Form>
								<Form.Field>
									<label>{ words.homeSettings.ArText }</label>
									<TextField
										onChange={ (value) => {
											const newHomeDetails = homeDetails;
											homeDetails.embedGameSection.title.ar = value;
											this.setState({homeDetails: newHomeDetails});
										} }
										value={ homeDetails.embedGameSection.title.ar }
									/>
								</Form.Field>
								<Form.Field>
									<label>{ words.homeSettings.EnText }</label>
									<TextField
										onChange={ (value) => {
											const newHomeDetails = homeDetails;
											homeDetails.embedGameSection.title.en = value;
											this.setState({homeDetails: newHomeDetails});
										} }
										value={ homeDetails.embedGameSection.title.en }
									/>
								</Form.Field>
							</Form>
						</Segment>
					</Segment.Group>
					<Segment.Group>
						<Segment>{ words.homeSettings.sectionDescription }</Segment>
						<Segment>
							<Form>
								<Form.Field>
									<label>{ words.homeSettings.ArText }</label>
									<TextArea
										onChange={ (value) => {
											const newHomeDetails = homeDetails;
											newHomeDetails.embedGameSection.description.ar = value;
											this.setState({homeDetails: newHomeDetails});
										} }
										value={ homeDetails.embedGameSection.description.ar }
									/>
								</Form.Field>
								<Form.Field>
									<label>{ words.homeSettings.EnText }</label>
									<TextArea
										onChange={ (value) => {
											const newHomeDetails = homeDetails;
											homeDetails.embedGameSection.description.en = value;
											this.setState({homeDetails: newHomeDetails});
										} }
										value={ homeDetails.embedGameSection.description.en }
									/>
								</Form.Field>
							</Form>
						</Segment>
					</Segment.Group>
					<Segment>
						<Form>
							<Form.Field>
								<label>{ words.homeSettings.selectedEmbedGames }</label>
								<Dropdown
									placeholder='Embed Games'
									fluid
									multiple
									search
									selection
									onChange={ (e, {value}) => {
										const newHomeDetails = homeDetails;
										newHomeDetails.embedGameSection.embedGames = value as number[]
										this.setState({homeDetails: newHomeDetails});
									} }
									options={ this.state.embedGamesOptions }
									value={ homeDetails.embedGameSection.embedGames as number[] }
								/>
							</Form.Field>
						</Form>
					</Segment>
				</Segment.Group>
			</Segment.Group>
		);
	}
	
	renderSections = (homeDetails: HomeDetails, words: LanguageSystemWords) => {
		return (
			<Segment.Group>
				<Segment>{ words.homeSettings.sections }</Segment>
				<Segment>
					{
						( homeDetails.sections ? homeDetails.sections : [] )
							.sort((a, b) => a.id - b.id)
							.map((section, index) => {
								return (
									<Segment.Group key={ section.id }>
										<Segment>{ words.homeSettings.sectionConfig } { index + 1 }</Segment>
										<Segment.Group>
											<Segment>{ words.homeSettings.sectionTitle } </Segment>
											<Segment>
												<Form>
													<Form.Field>
														<label>{ words.homeSettings.ArText }</label>
														<TextField
															onChange={ (value) => {
																const newHomeDetails = homeDetails;
																section.title.ar = value;
																newHomeDetails.sections =
																	[ ...newHomeDetails.sections.filter(sec => sec.id !== section.id), section ];
																this.setState({homeDetails: newHomeDetails});
															} }
															value={ section.title.ar }
														/>
													</Form.Field>
													<Form.Field>
														<label>{ words.homeSettings.EnText }</label>
														<TextField
															onChange={ (value) => {
																const newHomeDetails = homeDetails;
																section.title.en = value;
																newHomeDetails.sections =
																	[ ...newHomeDetails.sections.filter(sec => sec.id !== section.id), section ];
																this.setState({homeDetails: newHomeDetails});
															} }
															value={ section.title.en }
														/>
													</Form.Field>
												</Form>
											</Segment>
										</Segment.Group>
										<Segment.Group>
											<Segment>{ words.homeSettings.sectionDescription }</Segment>
											<Segment>
												<Form>
													<Form.Field>
														<label>{ words.homeSettings.ArText }</label>
														<TextArea
															onChange={ (value) => {
																const newHomeDetails = homeDetails;
																section.description.ar = value;
																newHomeDetails.sections =
																	[ ...newHomeDetails.sections.filter(sec => sec.id !== section.id), section ];
																this.setState({homeDetails: newHomeDetails});
															} }
															value={ section.description.ar }
														/>
													</Form.Field>
													<Form.Field>
														<label>{ words.homeSettings.EnText }</label>
														<TextArea
															onChange={ (value) => {
																const newHomeDetails = homeDetails;
																section.description.en = value;
																newHomeDetails.sections =
																	[ ...newHomeDetails.sections.filter(sec => sec.id !== section.id), section ];
																this.setState({homeDetails: newHomeDetails});
															} }
															value={ section.description.en }
														/>
													</Form.Field>
												</Form>
											</Segment>
										</Segment.Group>
										<Segment>
											<Form>
												<Form.Field>
													<label>{ words.homeSettings.selectedGames }</label>
													<Dropdown
														placeholder='Games'
														fluid
														multiple
														search
														selection
														onChange={ (e, {value}) => {
															const newHomeDetails = homeDetails;
															section.games = value as number[];
															newHomeDetails.sections =
																[ ...newHomeDetails.sections.filter(sec => sec.id !== section.id), section ];
															this.setState({homeDetails: newHomeDetails});
														} }
														options={ this.state.gamesOptions }
														value={ section.games as number[] }
													/>
												</Form.Field>
											</Form>
										</Segment>
										<Segment>
											<Form>
												<Form.Field>
													<label>{ words.homeSettings.selectedGameCards }</label>
													<Dropdown
														placeholder='Game Cards'
														fluid
														multiple
														search
														selection
														onChange={ (e, {value}) => {
															const newHomeDetails = homeDetails;
															section.gameCards = value as number[];
															newHomeDetails.sections =
																[ ...newHomeDetails.sections.filter(sec => sec.id !== section.id), section ];
															this.setState({homeDetails: newHomeDetails});
														} }
														options={ this.state.gameCardsOptions }
														value={ section.gameCards as number[] }
													/>
												</Form.Field>
											</Form>
										</Segment>
										<Segment>
											<FlexSpace>
												<div/>
												<div>
													<Button
														text={ words.basic.delete }
														iconSetting={ {name: 'trash'} }
														inverted
														basic
														negative
														onClick={ () => {
															const newHomeDetails = homeDetails;
															newHomeDetails.sections = newHomeDetails.sections.filter(s => s.id !== section.id);
															this.setState({homeDetails: newHomeDetails});
														} }
													/>
												</div>
											</FlexSpace>
										</Segment>
									</Segment.Group>
								);
							})
					}
				</Segment>
				<Segment>
					<FlexSpace>
						<div/>
						<div>
							<Button
								text={ words.homeSettings.addSection }
								iconSetting={ {name: 'plus'} }
								onClick={ () => {
									const newHomeDetails = homeDetails;
									homeDetails.sections = homeDetails.sections ? homeDetails.sections : [];
									let id = 1;
									homeDetails.sections.forEach(r => id = id + r.id)
									homeDetails.sections.push({
										description: {
											ar: '',
											en: ''
										},
										title: {
											ar: '',
											en: ''
										},
										games: [],
										gameCards: [],
										id: id
									});
									this.setState({homeDetails: newHomeDetails});
								} }
							/>
						</div>
					</FlexSpace>
				</Segment>
			</Segment.Group>
		);
	}
	
	showExtraElement(): any {
		const words = this.word() as LanguageSystemWords;
		const homeDetails = this.state.homeDetails;
		if (!homeDetails) {
			return null;
		}
		return (
			<Dialog
				open={ !!this.state.homeDetails }
				onClose={ () => {
					this.setState({homeDetails: undefined});
				} }
				size={ 'large' }
				headerText={ words.homeSettings.editConfig }
				scrollingContent
				closeButtonSetting={
					{
						text: words.basic.cancel,
						negative: true,
						show: true,
						iconSetting: {name: 'cancel'},
						onClick: () => {
							this.setState({homeDetails: undefined});
						},
						disabled: this.state.actionLoading
					}
				}
				saveButtonSetting={
					{
						text: words.basic.save,
						positive: true,
						show: true,
						disabled: this.state.actionLoading,
						loading: this.state.actionLoading,
						onClick: () => {
							const selectedForm = this.getHomeConfigEnum();
							if (this.state.homeDetails && selectedForm) {
								this.setState({actionLoading: true});
								this.service.updateEntity(selectedForm?.id,
									{values: JSON.stringify(this.state.homeDetails) as any}).then(data => {
									if (data) {
										this.setState({
											selectedForm: this.getData()?.filter(e => e.id === this.state.selectedForm?.id)?.[0]
										});
										this.setState({
											actionLoading: false,
											homeDetails: undefined
										});
										return {pass: true};
									}
								});
							}
						}
					}
				}
				deleteButtonSetting={
					{
						show: false
					}
				}
			>
				{ this.renderMainHomeText(homeDetails, words) }
				{ this.renderSpecialDealsText(homeDetails, words) }
				{ this.renderAccessoryDealsText(homeDetails, words) }
				{ this.renderEmbedGamesDealsText(homeDetails, words) }
				{ this.renderSections(homeDetails, words) }
			</Dialog>
		);
	}
	
	async handleSaveAction(form: EnumDTO): Promise<DialogFormActionResult> {
		const result = super.handleSaveAction(form);
		await new EntityService(homeService).reload();
		return result;
	}
	
}

export default connect(generateMapStateEntityToProps([ enumsService.storeName ]))(ManageEnums);