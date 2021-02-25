import EntityWrapper, {
    EntityWrapperConfig,
    EntityWrapperProps,
    EntityWrapperState
} from "../../../lib/components/wrapper/entity-wrapprt";
import { gameCardService, gameService } from "../../../services/service-config";
import { LanguageSystemWords } from "../../../models/language";
import { Wrapper } from "../../shared/wrapper";
import { Table, TableSetting } from "../../../lib/components/tabels";
import { DFormField } from "../../../lib/components/form/models";
import { costFormat, getDefaultValidMsg, getEmptyForm, removeEmpty } from "../../../lib/utils/utils";
import { connect } from "react-redux";
import { generateMapStateEntityToProps } from "../../../lib/store/util";
import { GameCardDTO, GameDTO, gameStateTypeToTypes, gameTypes, platformTypes } from "../../../models/game";
import React from 'react';
import { Divider, FlexBox, FlexSpace } from "../../../lib/components/containers";
import { Divider as SDivider, Header } from "semantic-ui-react";
import { Button } from "../../../lib/components/basic";
import DialogForm, { DialogFormActionResult } from "../../../lib/components/form/dialog-form";
import { EntityService } from "../../../lib/services/entity-service/entity-service";

const ACTIONS = {
    EDIT_GC: 'EDIT_GC',
    ADD_GC: 'ADD_GC',
}

interface ManageGamesProps extends EntityWrapperProps<GameDTO> {
}

interface ManageGamesState extends EntityWrapperState<GameDTO> {
    selectedGCForm?: GameCardDTO;
    gameCardAction: string;
}


class ManageGames extends EntityWrapper<GameDTO, ManageGamesProps, ManageGamesState> {

    gameCardService: EntityService<GameCardDTO>;

    constructor(props: ManageGamesProps) {
        super(props, gameService);
        this.gameCardService = new EntityService<GameCardDTO>(gameCardService);
    }

    init = (): void => {
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
                width: 120
            },
            {
                fieldName: 'show',
                title: word.entities.game.fields.show,
                center: true,
                type: 'boolean',
                width: 80
            },
            {
                fieldName: 'type',
                title: word.entities.game.fields.type,
                type: 'valueMap',
                center: true,
                width: 80,
                valueMap: gameStateTypeToTypes
            },
            {
                fieldName: 'details',
                title: word.entities.game.fields.details,
                type: 'viewButton',
                center: true,
                width: 80,
                onClick: (row) => {
                    console.log(row);
                }
            },
            {
                fieldName: 'about',
                title: word.entities.game.fields.about,
                type: 'viewButton',
                center: true,
                width: 80,
                onClick: (row) => {
                    console.log(row);
                }
            },
            {
                fieldName: 'notes',
                title: word.entities.game.fields.notes,
                type: 'viewButton',
                center: true,
                width: 80,
                onClick: (row) => {
                    console.log(row);
                }
            },
            {
                fieldName: 'video',
                title: word.entities.game.fields.video,
                type: 'link',
                center: true,
                width: 80,
                subSetting: {
                    linkText: word.basic.goTo
                }
            },
            {
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
            },
            {
                fieldName: 'bg_card',
                title: word.entities.game.fields.bg_card,
                type: 'link',
                center: true,
                width: 60,
                subSetting: {
                    linkText: word.basic.show
                }
            },
            {
                fieldName: 'bg_cover',
                title: word.entities.game.fields.bg_cover,
                type: 'link',
                center: true,
                width: 60,
                subSetting: {
                    linkText: word.basic.show
                }
            },
            {
                fieldName: 'logo',
                title: word.entities.game.fields.logo,
                type: 'link',
                center: true,
                width: 60,
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
        const words = this.state.word as LanguageSystemWords;
        return [
            [
                {
                    fieldName: 'name',
                    type: 'text',
                    fieldTitle: words.entities.game.fields.name,
                    subInputOptions: {length: 32},
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
                    fieldName: 'notes',
                    type: 'bigText',
                    fieldTitle: words.entities.game.fields.notes,
                    subInputOptions: {length: 255}
                }
            ],
            [
                {
                    fieldName: 'about',
                    type: 'bigText',
                    fieldTitle: words.entities.game.fields.about,
                    subInputOptions: {length: 255}
                }
            ],
            [
                {
                    fieldName: 'details',
                    type: 'bigText',
                    fieldTitle: words.entities.game.fields.details,
                    subInputOptions: {length: 255}
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
            [
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
            ],
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
        return true;
    }

    showEditButton(): boolean {
        return true;
    }

    onTableSelect = (form: GameDTO) =>{
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
                    this.setState({selectedGCForm: this.state.selectedForm.game_cards
                            .filter(gc => gc.id === this.state.selectedGCForm?.id)[0]});
                    return {pass: true};
                }
            }
        }
        return super.handleSaveAction(form as GameDTO);
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
                fieldName: 'price',
                title: word.entities.gameCard.fields.price,
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
                    fieldName: 'max',
                    type: 'range',
                    fieldTitle: words.entities.gameCard.fields.max,
                    defaultValue: 1,
                    subInputOptions: {max: 9999999999, min: 1}
                },
                {
                    fieldName: 'min',
                    type: 'range',
                    fieldTitle: words.entities.gameCard.fields.min,
                    defaultValue: 0,
                    subInputOptions: {max: 9999999999, min: 0}
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
            const actionTitle = this.getActionToTitleMap()[this.state.action];
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
                            color={ 'grey' }
                            onClick={ () => this.setState({gameCardAction: ACTIONS.EDIT_GC }) }
                            disabled={ !state.selectedGCForm || state.gameCardAction === ACTIONS.ADD_GC }
                            text={ state.word.basic.edit }
                            iconSetting={ {name: 'edit', labelPosition: 'left', attachToButton: true} }
                        />
                        <Button
                            disabled={ !state.selectedForm }
                            onClick={ () => {
                                this.setState({selectedGCForm: getEmptyForm(ACTIONS.ADD_GC, this.getGameCardFormFields())});
                                this.setState({gameCardAction: ACTIONS.ADD_GC });
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
                    settings={ this.getGameCardTableSetting() }
                    data={ state.selectedForm && state.selectedForm.game_cards ? state.selectedForm.game_cards : [] }
                    onSelect={ (form: GameCardDTO) => {
                        this.setState({selectedGCForm: form});
                    } }
                />
                {this.showGameCardForm()}
            </FlexBox>
        );
    }

}

export default connect(generateMapStateEntityToProps([ gameService.storeName ]))(ManageGames);