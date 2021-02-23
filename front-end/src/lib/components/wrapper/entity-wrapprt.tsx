import { BaseEntity } from "../../models/base";
import React from "react";
import { EntityService } from "../../services/entity-service/entity-service";
import { ACTIONS, EntityServiceConfig } from "../../services/models/models";
import { DIR } from "../../utils/constant";
import LanguageService from "../../services/language-service";
import { getEmptyForm, isEmpty, isTrueOrUndefined } from "../../utils/utils";
import { FlexSpace } from "../containers";
import { Divider, Input } from "semantic-ui-react";
import { Button } from "../basic";
import { Table, TableSetting } from "../tabels";
import { BaseComponentProps, BaseComponentState } from "../components";
import { DFormField } from "../form/models";
import DialogForm, { DialogFormActionResult } from "../form/dialog-form";


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
}

abstract class EntityWrapper<Entity extends BaseEntity,
    EntityProps extends EntityWrapperProps<Entity>,
    EntityState extends EntityWrapperState<Entity>> extends React.Component<EntityProps, EntityState> {

    service: EntityService<Entity>;
    loaderId?: number;
    private languageServiceID?: number;

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

    componentDidMount = () => {
        this.languageServiceID = LanguageService.subscribe((setting) => {
            if (this) {
                this.setState({direction: setting.direction, word: setting.words});
            }
        });
        this.initialize();
    }

    componentWillUnmount = () => {
        if (this.languageServiceID) {
            LanguageService.unsubscribe(this.languageServiceID);
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
        this.service.find().then();
        this.init();
    }

    showForm = () => {
        if (this.state.action && this.state.selectedForm) {
            const words = this.state.word;
            const actionTitle = this.getActionToTitleMap()[this.state.action];
            return (
                <DialogForm
                    show={ !!this.state.action }
                    title={ actionTitle }
                    hideDeleteButton={ true }
                    formSetting={ {
                        action: this.state.action,
                        form: this.state.selectedForm as any,
                        fields: this.getFormFields(),
                        messages: this.getMessagesErrorForm()
                    } }
                    onClose={
                        () => {
                            this.setAction('');
                        }
                    }
                    onDelete={ async (id: number) => {
                        if (id) {
                            await this.service.deleteEntity(id);
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
            <Wrapper title={ config.title } icon={config.icon} loading={ state.actionLoading }>
                <FlexSpace>
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
                            pxIf={this.showEditButton()}
                            color={ 'grey' }
                            onClick={ () => this.setAction('edit') }
                            disabled={ !state.selectedForm }
                            text={ state.word.basic.edit }
                            iconSetting={ {name: 'edit', labelPosition: 'left', attachToButton: true} }
                        />
                        <Button
                            pxIf={this.showAddButton()}
                            onClick={ () => {
                                this.setState({selectedForm: getEmptyForm('add', this.getFormFields())});
                                this.setAction('add');
                            } }
                            text={ state.word.basic.add }
                            iconSetting={ {name: 'plus', labelPosition: 'left', attachToButton: true} }
                        />
                    </div>
                </FlexSpace>
                <Divider hidden/>
                <Table onSelect={ (form: Entity) => {
                    this.setState({selectedForm: form});
                } } showContainer selectable unStackable onRefresh={ async () => {
                    this.setState({selectedForm: undefined});
                    this.service.flushStore();
                    await this.service.find();
                } } settings={ tableSettings } data={ this.getFilteredData() }/>
                { this.showForm() }
            </Wrapper>
        );
    }

    public async handleSaveAction (form: Entity): Promise<DialogFormActionResult>  {
        if (this.state.selectedForm) {
            if (this.state.action === 'edit') {
                const response = await this.service.updateEntity(this.state.selectedForm.id, form);
                if (response) {
                    this.setState({selectedForm: undefined});
                    return {pass: true};
                }
            }
            if (this.state.action === 'add') {
                const response = await this.service.createEntity(form);
                if (response) {
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

    public getData (): Entity[] {
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
}

export default EntityWrapper;