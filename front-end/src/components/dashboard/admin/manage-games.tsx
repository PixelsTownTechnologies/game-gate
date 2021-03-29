import EntityWrapper, {
    EntityWrapperConfig,
    EntityWrapperProps,
    EntityWrapperState
} from "../../../lib/components/wrapper/entity-wrapprt";
import { countriesService, gameCardKeysService, gameCardService, gameService } from "../../../services/service-config";
import { LanguageSystemWords } from "../../../models/language";
import { Wrapper } from "../../shared/wrapper";
import { Table, TableSetting } from "../../../lib/components/tabels";
import { DFormField } from "../../../lib/components/form/models";
import { costFormat, getDefaultValidMsg, getEmptyForm, isEmpty, removeEmpty } from "../../../lib/utils/utils";
import {
    GameCardDTO,
    GameDTO,
    gameStateTypeToTypes,
    gameTypes,
    platformTypes,
    platformTypeStateToPlatform
} from "../../../models/game";
import React from 'react';
import { Divider, FlexBox, FlexSpace, If } from "../../../lib/components/containers";
import DialogForm, { DialogFormActionResult } from "../../../lib/components/form/dialog-form";
import { EntityService } from "../../../lib/services/entity-service/entity-service";
import Dialog from "../../../lib/components/form/dialog";
import { TextArea } from "../../../lib/components/form/fields";
import { Button } from "../../../lib/components/basic";
import { generateMapStateEntityToProps } from "../../../lib/store/util";
import { connect } from "react-redux";
import { Divider as SDivider, Form, Header, TextArea as STextArea } from 'semantic-ui-react';
import MDEditor from '@uiw/react-md-editor';
import { CountryDTO } from "../../../lib/models/country";

const ACTIONS = {
    EDIT_GC: 'EDIT_GC',
    ADD_GC: 'ADD_GC',
}

interface ManageGamesProps extends EntityWrapperProps<GameDTO> {
    countries: CountryDTO[];
}

interface ManageGamesState extends EntityWrapperState<GameDTO> {
    selectedGCForm?: GameCardDTO;
    gameCardAction: string;
    subDialogSettings?: {
        show: boolean;
        fieldName: string;
        game: GameDTO;
        type: 'editor' | 'text';
    };
    isSubDialogLoading: boolean;
    subDialogForm: any;
    showKeyDialog: boolean;
    keyForm?: {
        format: string;
        fileContent: string;
        reviewContent: string;
        keysResult: string[];
    };
}


class ManageGames extends EntityWrapper<GameDTO, ManageGamesProps, ManageGamesState> {

    gameCardService: EntityService<GameCardDTO>;

    constructor(props: ManageGamesProps) {
        super(props, gameService);
        this.gameCardService = new EntityService<GameCardDTO>(gameCardService);
    }

    init = (): void => {
        new EntityService(countriesService).find().then();
    }

    getConfig(): EntityWrapperConfig {
        const word: LanguageSystemWords = this.word() as LanguageSystemWords;
        return {
            title: word.entities.game.title,
            icon: 'game',
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
                title: word.fields.name,
                center: true,
                type: 'text',
                width: 250
            },
            {
                fieldName: 'card_name',
                title: word.entities.game.fields.card_name,
                center: true,
                type: 'text',
                width: 150
            },
            {
                fieldName: 'show',
                title: word.entities.game.fields.show,
                center: true,
                type: 'boolean',
                width: 100
            },
            {
                fieldName: 'type',
                title: word.entities.game.fields.type,
                type: 'valueMap',
                center: true,
                width: 100,
                valueMap: gameStateTypeToTypes
            },
            {
                fieldName: 'country',
                title: word.entities.game.fields.country,
                type: 'text',
                center: true,
                width: 140
            },
            {
                fieldName: 'platform',
                title: word.entities.game.fields.platform,
                type: 'valueMap',
                center: true,
                width: 120,
                valueMap: platformTypeStateToPlatform
            },
            {
                fieldName: 'details',
                title: word.entities.game.fields.details,
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
            /*{
                fieldName: 'about',
                title: word.entities.game.fields.about,
                type: 'viewButton',
                center: true,
                width: 80,
                onClick: (row) => {
                    this.setState({
                        subDialogSettings: {
                            show: true,
                            fieldName: 'about',
                            game: row,
                            type:"editor"
                        }
                    });
                }
            },*/
            {
                fieldName: 'notes',
                title: word.entities.game.fields.notes,
                type: 'viewButton',
                center: true,
                width: 80,
                onClick: (row) => {
                    this.setState({
                        subDialogSettings: {
                            show: true,
                            fieldName: 'notes',
                            game: row,
                            type: "text"
                        },
                        subDialogForm: {notes: row['notes']}
                    });
                }
            },
            {
                fieldName: 'video',
                title: word.entities.game.fields.video,
                type: 'text',
                center: true,
                width: 120
            },
            /*{
                fieldName: 'facebook',
                title: word.entities.game.fields.facebook,
                type: 'link',
                center: true,
                width: 80,
                subSetting: {
                    linkText: word.basic.goTo
                }
            },
            {
                fieldName: 'website',
                title: word.entities.game.fields.website,
                type: 'link',
                center: true,
                width: 80,
                subSetting: {
                    linkText: word.basic.goTo
                }
            },
            {
                fieldName: 'youtube',
                title: word.entities.game.fields.youtube,
                type: 'link',
                center: true,
                width: 80,
                subSetting: {
                    linkText: word.basic.goTo
                }
            },*/
            {
                fieldName: 'bg_card',
                title: word.entities.game.fields.bg_card,
                type: 'link',
                center: true,
                width: 120,
                subSetting: {
                    linkText: word.basic.show
                }
            },
            {
                fieldName: 'bg_cover',
                title: word.entities.game.fields.bg_cover,
                type: 'link',
                center: true,
                width: 120,
                subSetting: {
                    linkText: word.basic.show
                }
            },
            {
                fieldName: 'logo',
                title: word.entities.game.fields.logo,
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
        //const gameTypeOptions = [] as any[];
        const typeOptions = Object.keys(gameTypes).map(key => ( {
            text: key,
            value: ( gameTypes as any )[key],
            key: ( gameTypes as any )[key]
        } ));
        const platformOptions = Object.keys(platformTypes).map(key => ( {
            text: key,
            value: ( platformTypes as any )[key],
            key: ( platformTypes as any )[key]
        } ));
        let countriesOptions = [ {text: 'Global', value: 'Global', key: 'Global'} ];
        countriesOptions = this.props.countries ? [ ...countriesOptions, ...this.props.countries.map(c => ( {
            text: c.name,
            value: c.name,
            key: c.name,
        } )) ] : countriesOptions;
        const words = this.state.word as LanguageSystemWords;
        return [
            [
                {
                    fieldName: 'name',
                    type: 'text',
                    fieldTitle: words.entities.game.fields.name,
                    subInputOptions: {length: 64},
                    validator: {required: true}
                },
                {
                    fieldName: 'country',
                    type: 'list',
                    fieldTitle: words.entities.game.fields.country,
                    subInputOptions: {listOptions: countriesOptions}
                }
            ],
            [
                {
                    fieldName: 'type',
                    type: 'list',
                    fieldTitle: words.entities.game.fields.type,
                    subInputOptions: {listOptions: typeOptions},
                    validator: {required: true}
                },
                {
                    fieldName: 'platform',
                    type: 'list',
                    fieldTitle: words.entities.game.fields.platform,
                    subInputOptions: {listOptions: platformOptions}
                }
            ],
            [
                {
                    fieldName: 'card_name',
                    type: 'text',
                    fieldTitle: words.entities.game.fields.card_name,
                    subInputOptions: {length: 64},
                    validator: {required: true}
                },
                {
                    fieldName: 'show',
                    type: 'boolean',
                    fieldTitle: words.entities.game.fields.show,
                    defaultValue: true
                }
            ],
            [
                {
                    fieldName: 'notes',
                    type: 'bigText',
                    fieldTitle: words.entities.game.fields.notes,
                    subInputOptions: {length: 255}
                }
            ],
            /* [
                 {
                     fieldName: 'about',
                     type: 'bigText',
                     fieldTitle: words.entities.game.fields.about,
                     subInputOptions: {length: 255}
                 }
             ],*/
            [
                {
                    fieldName: 'details',
                    type: 'bigText',
                    fieldTitle: words.entities.game.fields.details,
                    subInputOptions: {length: 255},
                    disabled: true,
                    defaultValue: 'No Details To View Here'
                }
            ],
            [
                {
                    fieldName: 'video',
                    type: 'text',
                    fieldTitle: words.entities.game.fields.video,
                    subInputOptions: {length: 255}
                }
            ],
            /*[
                {
                    fieldName: 'facebook',
                    type: 'text',
                    fieldTitle: words.entities.game.fields.facebook,
                    subInputOptions: {length: 255}
                }
            ],
            [
                {
                    fieldName: 'website',
                    type: 'text',
                    fieldTitle: words.entities.game.fields.website,
                    subInputOptions: {length: 255}
                }
            ],
            [
                {
                    fieldName: 'youtube',
                    type: 'text',
                    fieldTitle: words.entities.game.fields.youtube,
                    subInputOptions: {length: 255}
                }
            ],*/
            [
                {
                    fieldName: 'bg_card',
                    type: 'image',
                    fieldTitle: words.entities.game.fields.bg_card
                },
                {
                    fieldName: 'bg_cover',
                    type: 'image',
                    fieldTitle: words.entities.game.fields.bg_cover
                },
                {
                    fieldName: 'logo',
                    type: 'image',
                    fieldTitle: words.entities.game.fields.logo
                }
            ]
        ];
    }

    getActionToTitleMap(): { [p: string]: string } {
        const words: LanguageSystemWords = this.word() as LanguageSystemWords;
        return {
            'edit': words.entities.game.actions.edit,
            'add': words.entities.game.actions.add,
            [ACTIONS.EDIT_GC]: words.entities.gameCard.actions.edit,
            [ACTIONS.ADD_GC]: words.entities.gameCard.actions.add
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

    onTableSelect = (form: GameDTO) => {
        super.onTableSelect(form);
        this.setState({gameCardAction: '', selectedGCForm: undefined});
    }

    async handleSaveAction(form: GameDTO | GameCardDTO): Promise<DialogFormActionResult> {
        if (this.state.selectedForm && [ 'edit', 'add' ].includes(this.state.action)) {
            form = form as GameDTO;
            form.bg_card = form.bg_card
            && typeof ( form.bg_card ) === 'string'
            && form.bg_card.split('http').length > 1 ? undefined : form.bg_card;

            form.bg_cover = form.bg_cover
            && typeof ( form.bg_cover ) === 'string'
            && form.bg_cover.split('http').length > 1 ? undefined : form.bg_cover;

            form.logo = form.logo
            && typeof ( form.logo ) === 'string'
            && form.logo.split('http').length > 1 ? undefined : form.logo;
            form = removeEmpty(form);
        }
        if (this.state.selectedForm && this.state.selectedGCForm) {
            form = form as GameCardDTO;
            form.game = this.state.selectedForm.id;
            form = removeEmpty(form);
            if (this.state.gameCardAction === ACTIONS.ADD_GC) {
                const response = await this.gameCardService.createEntity(form);
                if (response) {
                    await this.reloadContent();
                    return {pass: true};
                }
            }
            if (this.state.gameCardAction === ACTIONS.EDIT_GC) {
                const response = await this.gameCardService.updateEntity(this.state.selectedGCForm.id, form);
                if (response) {
                    await this.reloadContent();
                    this.setState({
                        selectedGCForm: this.state.selectedForm.game_cards
                            .filter(gc => gc.id === this.state.selectedGCForm?.id)[0]
                    });
                    return {pass: true};
                }
            }
        }
        if (this.state.subDialogSettings) {
            const response = await this.service.updateEntity(this.state.subDialogSettings.game.id, form);
            if (response) {
                this.setState({selectedForm: this.getData()?.filter(e => e.id === this.state.selectedForm?.id)?.[0]});
                return {pass: true};
            }
        }
        return super.handleSaveAction(form as GameDTO);
    }

    public async reloadContent() {
        await super.reloadContent();
        this.setState({
            selectedGCForm: this.state.selectedForm?.game_cards
                .filter(gc => gc.id === this.state.selectedGCForm?.id)[0]
        });
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

    getGameCardTableSetting = (): TableSetting[] => {
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
                title: word.fields.name,
                center: true,
                type: 'text',
                width: 120
            },
            {
                fieldName: 'show',
                title: word.entities.gameCard.fields.show,
                center: true,
                type: 'boolean',
                width: 80
            },
            {
                fieldName: 'sold_flag',
                title: word.entities.gameCard.fields.sold_flag,
                center: true,
                type: 'boolean',
                width: 80
            },
            {
                fieldName: 'available_keys',
                title: word.entities.gameCard.fields.available_keys,
                center: true,
                type: 'number',
                width: 100
            },
            {
                fieldName: 'quantity_notification',
                title: word.entities.gameCard.fields.quantity_notification,
                center: true,
                type: 'number',
                width: 120
            },
            {
                fieldName: 'price',
                title: word.entities.gameCard.fields.price,
                center: true,
                type: 'balance',
                width: 120
            },
            {
                fieldName: 'dealer_price',
                title: word.entities.gameCard.fields.dealer_price,
                center: true,
                type: 'balance',
                width: 120
            },
            {
                fieldName: 'discount',
                title: word.entities.gameCard.fields.discount,
                center: true,
                type: 'float',
                width: 120,
                displayValue: (value) => {
                    return ( <div>{ `${ costFormat(value.discount) }%` }</div> );
                }
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
                fieldName: 'points',
                title: word.entities.gameCard.fields.points,
                center: true,
                type: 'number',
                width: 120
            }
        ];
    }

    getGameCardFormFields(): DFormField[][] {
        const words = this.state.word as LanguageSystemWords;
        return [
            [
                {
                    fieldName: 'name',
                    type: 'text',
                    fieldTitle: words.entities.game.fields.name,
                    subInputOptions: {length: 32},
                    validator: {required: true},
                    defaultValue: this.state.selectedForm?.name
                }
            ],
            [
                {
                    fieldName: 'price',
                    type: 'range',
                    fieldTitle: words.entities.gameCard.fields.price,
                    defaultValue: 5,
                    subInputOptions: {max: 9999999999, min: 0}
                },
                {
                    fieldName: 'discount',
                    type: 'range',
                    fieldTitle: words.entities.gameCard.fields.discount,
                    defaultValue: 0,
                    subInputOptions: {max: 100, min: 0}
                }
            ],
            [
                {
                    fieldName: 'dealer_price',
                    type: 'range',
                    fieldTitle: words.entities.gameCard.fields.dealer_price,
                    defaultValue: 5,
                    subInputOptions: {max: 9999999999, min: 0}
                },
                {
                    fieldName: 'quantity_notification',
                    type: 'range',
                    fieldTitle: words.entities.gameCard.fields.quantity_notification,
                    defaultValue: 0,
                    subInputOptions: {max: 100, min: 0}
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
                    fieldName: 'points',
                    type: 'number',
                    fieldTitle: words.entities.gameCard.fields.points,
                    defaultValue: 0
                }
            ],
            [
                {
                    fieldName: 'sold_flag',
                    type: 'boolean',
                    fieldTitle: words.entities.gameCard.fields.sold_flag,
                    defaultValue: false
                },
                {
                    fieldName: 'show',
                    type: 'boolean',
                    fieldTitle: words.entities.gameCard.fields.show,
                    defaultValue: true
                }
            ]
        ];
    }

    showGameCardForm = () => {
        if (this.state.gameCardAction && this.state.selectedGCForm && this.state.selectedForm) {
            const words = this.state.word;
            const actionTitle = this.getActionToTitleMap()[this.state.gameCardAction];
            const config = this.getConfig();
            return (
                <DialogForm
                    show={ !!this.state.gameCardAction }
                    title={ actionTitle }
                    hideDeleteButton={ !config.showDelete }
                    formSetting={ {
                        action: this.state.gameCardAction,
                        form: this.state.selectedGCForm as any,
                        fields: this.getGameCardFormFields(),
                        messages: this.getMessagesErrorForm(),
                    } }
                    onClose={
                        () => {
                            this.setState({gameCardAction: ''});
                        }
                    }
                    onDelete={ async (id: number) => {
                        if (id) {
                            await this.gameCardService.deleteEntity(id);
                            await this.reloadContent();
                            this.setState({gameCardAction: ''});
                            this.setState({selectedGCForm: undefined});
                        }
                        return {pass: false, errors: [ words.serviceErrors.invalidId ]};
                    } }
                    onSave={ async (form) => {
                        if (this.state.selectedGCForm) {
                            return await this.handleSaveAction(form);
                        }
                        return {pass: false, errors: [ words.serviceErrors.generalFailed ]};
                    } }
                />
            );
        }
        return null;
    }

    showExtraElement = () => {
        const state = this.state;
        const word: LanguageSystemWords = this.word() as LanguageSystemWords;
        return (
            <FlexBox flexDirection={ 'column' }>
                <FlexSpace>
                    <div className={ 'px-stp-5' }>
                        <Header className={ 'px-non-margin' } as={ 'h2' }>{ word.entities.gameCard.title }</Header>
                    </div>
                    <div className={ 'px-stp-5' }>
                        <Button
                            text={ word.entities.game.keys.addKeys }
                            disabled={
                                !state.selectedGCForm
                                || state.gameCardAction === ACTIONS.ADD_GC
                                || !state.selectedForm
                                || state.selectedForm.type === gameTypes.Charging
                            }
                            color={'black'}
                            onClick={ () => {
                                this.setState({
                                    showKeyDialog: true, keyForm: {
                                        fileContent: '',
                                        format: 'Code : value\n' +
                                            'Serial : value',
                                        reviewContent: '',
                                        keysResult: []
                                    }
                                });
                            } }
                            iconSetting={ {name: 'key', attachToButton: true, labelPosition: 'left'} }
                        />
                        <Button
                            color={ 'grey' }
                            onClick={ () => this.setState({gameCardAction: ACTIONS.EDIT_GC}) }
                            disabled={
                                !state.selectedGCForm
                                || state.gameCardAction === ACTIONS.ADD_GC
                                || !state.selectedForm
                            }
                            text={ state.word.basic.edit }
                            iconSetting={ {name: 'edit', labelPosition: 'left', attachToButton: true} }
                        />
                        <Button
                            disabled={ !state.selectedForm }
                            onClick={ () => {
                                this.setState({selectedGCForm: getEmptyForm(ACTIONS.ADD_GC, this.getGameCardFormFields())});
                                this.setState({gameCardAction: ACTIONS.ADD_GC});
                            } }
                            text={ state.word.basic.add }
                            iconSetting={ {name: 'plus', labelPosition: 'left', attachToButton: true} }
                        />
                    </div>
                </FlexSpace>
                <Divider className={ 'simple' }/>
                <SDivider hidden/>
                <Table
                    showContainer
                    selectable
                    unStackable
                    selectedId={ this.state.selectedGCForm?.id }
                    settings={ this.getGameCardTableSetting() }
                    data={ state.selectedForm && state.selectedForm.game_cards ? state.selectedForm.game_cards : [] }
                    onSelect={ (form: GameCardDTO) => {
                        this.setState({selectedGCForm: form});
                    } }
                />
                { this.showGameCardForm() }
                { this.showDetailsDialog() }
                { this.showKeysForm() }
            </FlexBox>
        );
    }

    showKeysForm = () => {
        if (this.state.showKeyDialog && this.state.keyForm) {
            const words = this.state.word as LanguageSystemWords;
            return (
                <Dialog
                    open={ this.state.showKeyDialog }
                    headerText={ words.entities.game.keys.addKeys }
                    onClose={
                        () => {
                            this.setState({showKeyDialog: false, keyForm: undefined});
                        }
                    }
                    closeButtonSetting={ {
                        text: words.entities.game.keys.viewKeys,
                        disabled: this.state.isSubDialogLoading,
                        onClick: () => {
                            if (this.state.keyForm) {
                                const formatList = this.state.keyForm.format.split('\n').map(line => {
                                    const list = line.split('value');
                                    return list.length > 0 && isEmpty(list?.[1]) ? list[0] : null;
                                }).filter(v => !!v);
                                if (formatList && formatList.length > 0) {
                                    const fileLines = this.state.keyForm?.fileContent.split('\n').filter(l => {
                                        let isMatch = false;
                                        formatList.forEach((format, index) => {
                                            isMatch = isMatch || l.split(format as string).length > 1;
                                        });
                                        return isMatch;
                                    });
                                    const keysList = [];
                                    if (fileLines) {
                                        for (let i = 0; fileLines.length >= i; i = i + formatList.length) {
                                            let key = '';
                                            formatList.forEach((format, index) => {
                                                if (format && fileLines[i + index] && fileLines[i + index].split(format)?.[1]) {
                                                    key = key + ( index > 0 ? '\n' : '' ) + format + fileLines[i + index].split(format)[1];
                                                }
                                            });
                                            if (!isEmpty(key)) {
                                                keysList.push(key);
                                            }
                                        }
                                    }
                                    this.setState({keyForm: {...this.state.keyForm, keysResult: keysList}});
                                }
                            }
                        }
                    } }
                    saveButtonSetting={ {
                        disabled: this.state.keyForm?.keysResult?.length < 1,
                        text: words.entities.game.keys.saveGeneratedKeys,
                        loading: this.state.isSubDialogLoading,
                        onClick: () => {
                            if (this.state.keyForm?.keysResult && this.state.selectedGCForm) {
                                const form = {
                                    keys: this.state.keyForm?.keysResult,
                                    game_card_id: this.state.selectedGCForm.id
                                };
                                this.setState({isSubDialogLoading: true});
                                new EntityService(gameCardKeysService).createEntity(form).then(data => {
                                    if (data) {
                                        this.reloadContent().then(data => {
                                            this.setState({
                                                selectedGCForm: this.state?.selectedForm?.game_cards
                                                    .filter(gc => gc.id === this.state.selectedGCForm?.id)[0]
                                            });
                                        });
                                        this.setState({
                                            isSubDialogLoading: false,
                                            showKeyDialog: false,
                                            keyForm: undefined
                                        });
                                    }
                                })
                            }
                        }
                    } }
                    deleteButtonSetting={ {
                        inverted: true,
                        color: 'grey',
                        text: words.basic.cancel,
                        disabled: this.state.isSubDialogLoading,
                        onClick: () => {
                            this.setState({
                                showKeyDialog: false,
                                keyForm: undefined,
                                selectedGCForm: this.state.gameCardAction === ACTIONS.ADD_GC ? undefined : this.state.selectedGCForm
                            });
                        }
                    } }
                    scrollingContent
                >
                    <Form>
                        <Form.Field>
                            <label>{ words.entities.game.keys.fileFormat }</label>
                            <STextArea
                                rows={ 5 }
                                value={ this.state.keyForm.format }
                                placeholder={ 'Code : value\nSerial Number : value' }
                                onChange={ (value) => {
                                    this.setState({
                                        keyForm: {
                                            ...this.state.keyForm, format: value.target.value
                                        } as any
                                    });
                                } }
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>{ words.entities.game.keys.file }</label>
                            <input type={ 'file' } onChange={ async (e: any) => {
                                e.preventDefault()
                                const reader = new FileReader()
                                reader.onload = async (e1: any) => {
                                    const text = ( e1.target.result )
                                    this.setState({
                                        keyForm: {
                                            ...this.state.keyForm, fileContent: text
                                        } as any
                                    });
                                };
                                reader.readAsText(e.target.files[0])
                            } }/>
                        </Form.Field>
                        <If flag={ !isEmpty(this.state.keyForm.fileContent) }>
                            <Form.Field>
                                <label>{ words.entities.game.keys.fileContent }</label>
                                <STextArea
                                    rows={ 10 }
                                    value={ this.state.keyForm.fileContent }
                                    onChange={ (value) => {
                                        this.setState({
                                            keyForm: {
                                                ...this.state.keyForm, fileContent: value.target.value
                                            } as any
                                        });
                                    } }
                                />
                            </Form.Field>
                        </If>
                        <If flag={ !isEmpty(this.state.keyForm.keysResult) }>
                            <Form.Field>
                                <label>{ words.entities.game.keys.fileContent }</label>
                                <STextArea
                                    rows={ this.state.keyForm.keysResult.length > 40 ? 30 : 20 }
                                    value={
                                        `Number Of Keys: ${ this.state.keyForm.keysResult.length }\n--------------- Keys Data ---------------\n${ this.state.keyForm.keysResult
                                            .map((key, index) => `[${ index + 1 }]\n---------------\n${ key }\n---------------\n`)
                                            .join('\n').trim() }`
                                    }
                                />
                            </Form.Field>
                        </If>
                    </Form>
                </Dialog>
            );
        }
        return null;
    }

}

export default connect(generateMapStateEntityToProps([ gameService.storeName, countriesService.storeName ]))(ManageGames);