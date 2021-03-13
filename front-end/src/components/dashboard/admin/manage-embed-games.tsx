import EntityWrapper, {
    EntityWrapperConfig,
    EntityWrapperProps,
    EntityWrapperState
} from "../../../lib/components/wrapper/entity-wrapprt";
import { embedGamesService } from "../../../services/service-config";
import { LanguageSystemWords } from "../../../models/language";
import { Wrapper } from "../../shared/wrapper";
import { TableSetting } from "../../../lib/components/tabels";
import { DFormField } from "../../../lib/components/form/models";
import { getDefaultValidMsg, removeEmpty } from "../../../lib/utils/utils";
import { GameDTO } from "../../../models/game";
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
import { EmbedGameDTO, embedGameTypes } from "../../../models/embed-game";


interface ManageEmbedGameProps extends EntityWrapperProps<EmbedGameDTO> {
    countries: CountryDTO[];
}

interface ManageEmbedGameState extends EntityWrapperState<EmbedGameDTO> {
    subDialogSettings?: {
        show: boolean;
        fieldName: string;
        game: GameDTO;
        type: 'editor' | 'text';
    };
    isSubDialogLoading: boolean;
    subDialogForm: any;
}


class ManageEmbedGame extends EntityWrapper<EmbedGameDTO, ManageEmbedGameProps, ManageEmbedGameState> {

    constructor(props: ManageEmbedGameProps) {
        super(props, embedGamesService);
    }

    init = (): void => {
    }

    getConfig(): EntityWrapperConfig {
        const word: LanguageSystemWords = this.word() as LanguageSystemWords;
        return {
            title: word.entities.embedGames.title,
            icon: 'rocket',
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
                fieldName: 'src',
                title: word.entities.embedGames.fields.src,
                center: true,
                type: 'link',
                width: 150,
            },
            {
                fieldName: 'type',
                title: word.entities.embedGames.fields.type,
                type: 'text',
                center: true,
                width: 100
            },
            {
                fieldName: 'details',
                title: word.entities.embedGames.fields.details,
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
                title: word.entities.embedGames.fields.video,
                type: 'text',
                center: true,
                width: 120
            },
            {
                fieldName: 'logo',
                title: word.entities.embedGames.fields.logo,
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
        const typeOptions = embedGameTypes.map(v => {
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
                    fieldTitle: words.entities.embedGames.fields.name,
                    subInputOptions: {length: 64},
                    validator: {required: true}
                },
                {
                    fieldName: 'type',
                    type: 'list',
                    fieldTitle: words.entities.embedGames.fields.type,
                    subInputOptions: {listOptions: typeOptions},
                    validator: {required: true}
                }
            ],
            [
                {
                    fieldName: 'details',
                    type: 'bigText',
                    fieldTitle: words.entities.embedGames.fields.details,
                    subInputOptions: {length: 255},
                    disabled: true,
                    defaultValue: 'No Details To View Here'
                }
            ],
            [
                {
                    fieldName: 'src',
                    type: 'bigText',
                    fieldTitle: words.entities.embedGames.fields.src,
                    subInputOptions: {length: 500}
                }
            ],
            [
                {
                    fieldName: 'video',
                    type: 'text',
                    fieldTitle: words.entities.embedGames.fields.video,
                    subInputOptions: {length: 32}
                },
                {
                    fieldName: 'logo',
                    type: 'image',
                    fieldTitle: words.entities.embedGames.fields.logo
                },
            ],
        ];
    }

    getActionToTitleMap(): { [p: string]: string } {
        const words: LanguageSystemWords = this.word() as LanguageSystemWords;
        return {
            'edit': words.entities.embedGames.actions.edit,
            'add': words.entities.embedGames.actions.add,
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

    async handleSaveAction(form: EmbedGameDTO): Promise<DialogFormActionResult> {
        if (this.state.selectedForm && [ 'edit', 'add' ].includes(this.state.action)) {
            [ 'logo' ].forEach(imageField => {
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

export default connect(generateMapStateEntityToProps([ embedGamesService.storeName ]))(ManageEmbedGame);