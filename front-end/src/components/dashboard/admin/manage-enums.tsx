import { EnumDTO } from "../../../lib/models/enum";
import EntityWrapper, {
    EntityWrapperConfig,
    EntityWrapperProps,
    EntityWrapperState
} from "../../../lib/components/wrapper/entity-wrapprt";
import React from "react";
import { enumsService, gameService, homeService } from "../../../services/service-config";
import { LanguageSystemWords } from "../../../models/language";
import { Wrapper } from "../../shared/wrapper";
import { TableSetting } from "../../../lib/components/tabels";
import { DFormField } from "../../../lib/components/form/models";
import { costFormat, generateId, getDefaultValidMsg } from "../../../lib/utils/utils";
import { HomeDetails } from "../../../models/home-details";
import { Button } from "../../../lib/components/basic";
import { Dropdown, Form, Segment } from "semantic-ui-react";
import { TextArea } from "../../../lib/components/form/fields";
import Dialog from "../../../lib/components/form/dialog";
import { connect } from "react-redux";
import { generateMapStateEntityToProps } from "../../../lib/store/util";
import { FlexSpace } from "../../../lib/components/containers";
import { EntityService } from "../../../lib/services/entity-service/entity-service";
import { GameDTO } from "../../../models/game";
import { DialogFormActionResult } from "../../../lib/components/form/dialog-form";

interface ManageEnumsProps extends EntityWrapperProps<EnumDTO> {

}

interface ManageEnumsState extends EntityWrapperState<EnumDTO> {
    homeDetails?: HomeDetails;
    gamesOption: {
        text: string;
        value: number;
        key: string;
    }[];
    gameCardsOption: {
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
        new EntityService<GameDTO>(gameService).find().then((data) => {
            if (data) {
                const games = data as GameDTO[];
                const gamesOption = [] as any[];
                const gameCardsOption = [] as any[];
                games.forEach(game => {
                    gamesOption.push({
                        text: `${ game.id } - ${ game.name }`,
                        value: game.id,
                        key: game.id
                    });
                    game?.game_cards?.forEach(gameCard => {
                        gameCardsOption.push({
                            text: `${ gameCard.id } - ${ gameCard.name } - ${ costFormat(gameCard.discount) }%`,
                            value: gameCard.id,
                            key: gameCard.id
                        });
                    });
                });
                this.setState({
                    gameCardsOption,
                    gamesOption
                })
            }
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
            mainText: {
                ar: '',
                en: ''
            },
            sections: [],
            specialDeals: {
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
        };
    }

    renderMainHomeText = (homeDetails: HomeDetails, words: LanguageSystemWords) => {
        return (
            <Segment.Group>
                <Segment>{ words.homeSettings.mainText }</Segment>
                <Segment>
                    <Form>
                        <Form.Field>
                            <label>{ words.homeSettings.ArText }</label>
                            <TextArea
                                onChange={ (value) => {
                                    const newHomeDetails = homeDetails;
                                    homeDetails.mainText.ar = value;
                                    this.setState({homeDetails: newHomeDetails});
                                } }
                                value={ homeDetails.mainText.ar }
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>{ words.homeSettings.EnText }</label>
                            <TextArea
                                onChange={ (value) => {
                                    const newHomeDetails = homeDetails;
                                    homeDetails.mainText.en = value;
                                    this.setState({homeDetails: newHomeDetails});
                                } }
                                value={ homeDetails.mainText.en }
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
                                    <TextArea
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
                                    <TextArea
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
                                    options={ this.state.gameCardsOption }
                                    value={ homeDetails.specialDeals.gameCards as number[] }
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
                                        <Segment.Group>
                                            <Segment>{ words.homeSettings.sectionTitle } </Segment>
                                            <Segment>
                                                <Form>
                                                    <Form.Field>
                                                        <label>{ words.homeSettings.ArText }</label>
                                                        <TextArea
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
                                                        <TextArea
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
                                                        options={ this.state.gamesOption }
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
                                                        options={ this.state.gameCardsOption }
                                                        value={ section.gameCards as number[] }
                                                    />
                                                </Form.Field>
                                            </Form>
                                        </Segment>
                                    </Segment.Group>
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
                            this.setState({selectedForm: this.getHomeConfigEnum()});
                            if (this.state.homeDetails && this.state.selectedForm) {
                                this.setState({actionLoading: true});
                                this.service.updateEntity(this.state.selectedForm?.id,
                                    {values: JSON.stringify(this.state.homeDetails) as any}).then(data => {
                                    if (data) {
                                        this.setState({
                                            selectedForm: this.getData()?.filter(e => e.id === this.state.selectedForm?.id)?.[0]
                                        });
                                        this.setState({
                                            actionLoading: false,
                                            selectedForm: undefined,
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