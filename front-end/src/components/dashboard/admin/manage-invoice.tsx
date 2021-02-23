import EntityWrapper, {
    EntityWrapperConfig,
    EntityWrapperProps,
    EntityWrapperState
} from "../../../lib/components/wrapper/entity-wrapprt";
import { adminInvoiceService, adminUserService } from "../../../services/service-config";
import { LanguageSystemWords } from "../../../models/language";
import { Wrapper } from "../../shared/wrapper";
import { TableSetting } from "../../../lib/components/tabels";
import { DFormField } from "../../../lib/components/form/models";
import { getDefaultValidMsg, getEmptyForm } from "../../../lib/utils/utils";
import { connect } from "react-redux";
import { generateMapStateEntityToProps } from "../../../lib/store/util";
import { InvoiceDTO } from "../../../models/invoices";
import { EntityService } from "../../../lib/services/entity-service/entity-service";
import { UserBaseDTO } from "../../../lib/models/user";
import { Button } from "../../../lib/components/basic";
import React from "react";
import { DialogFormActionResult } from "../../../lib/components/form/dialog-form";

interface ManageInvoicesProps extends EntityWrapperProps<InvoiceDTO> {
    users: UserBaseDTO[];
}

interface ManageInvoicesState extends EntityWrapperState<InvoiceDTO> {
}


class ManageInvoices extends EntityWrapper<InvoiceDTO, ManageInvoicesProps, ManageInvoicesState> {

    userService: EntityService<UserBaseDTO>;

    constructor(props: ManageInvoicesProps) {
        super(props, adminInvoiceService);
        this.userService = new EntityService<UserBaseDTO>(adminUserService);
    }

    init = (): void => {
        this.userService.find().then();
    }

    getConfig(): EntityWrapperConfig {
        const word: LanguageSystemWords = this.word() as LanguageSystemWords;
        return {
            title: word.title.manageInvoice,
            icon: 'paste'
        };
    }

    getWrapper = () => {
        return Wrapper;
    }

    getSubButtons = () => {
        const words = this.state.word as LanguageSystemWords;
        return [
            (
                <Button
                    key={ 1 }
                    onClick={ () => {
                        this.setState({
                            selectedForm: {
                                ...getEmptyForm('addBalance', this.getFormFields())
                                , action: 'A'
                            }
                        });
                        this.setAction('addBalance');
                    } }
                    text={ words.title.actions.addBalance }
                    iconSetting={ {name: 'plus', labelPosition: 'left', attachToButton: true} }
                />
            ),
            (
                <Button
                    key={ 2 }
                    onClick={ () => {
                        this.setState({
                            selectedForm: {
                                ...getEmptyForm('removeBalance', this.getFormFields())
                                , action: 'R'
                            }
                        });
                        this.setAction('removeBalance');
                    } }
                    text={ words.title.actions.removeBalance }
                    iconSetting={ {name: 'minus', labelPosition: 'left', attachToButton: true} }
                />
            ),
            (
                <Button
                    key={ 3 }
                    onClick={ () => {
                        this.setState({
                            selectedForm: {
                                ...getEmptyForm('setBalance', this.getFormFields())
                                , action: 'S'
                            }
                        });
                        this.setAction('setBalance');
                    } }
                    text={ words.title.actions.setBalance }
                    iconSetting={ {name: 'pencil alternate', labelPosition: 'left', attachToButton: true} }
                />
            )
        ];
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
                fieldName: 'user.id',
                title: word.invoice.userId,
                type: 'number',
                width: 100,
                center: true
            },
            {
                fieldName: 'user.username',
                title: word.invoice.userName,
                type: 'text',
                width: 140,
                center: true
            },
            {
                fieldName: 'action',
                title: word.invoice.action,
                type: 'valueMap',
                width: 180,
                valueMap: word.invoice.actionTypes
            },
            {
                fieldName: 'amount',
                title: word.invoice.amount,
                type: 'balance',
                width: 140,
            },
            {
                fieldName: 'details',
                title: word.invoice.details,
                type: 'text',
                width: 250,
            },
            {
                fieldName: 'create_at',
                title: word.invoice.action_date,
                type: 'date',
                width: 120,
            },
            {
                fieldName: 'create_at',
                title: word.invoice.action_time,
                type: 'time',
                width: 120,
            },
        ];
    }

    getFormFields(): DFormField[][] {
        const words = this.state.word as LanguageSystemWords;
        return [
            [
                {
                    fieldName: 'user',
                    type: 'list',
                    fieldTitle: words.invoice.userName,
                    subInputOptions: {
                        listOptions: this.props.users.map(user => ( {
                            text: user.username ? `${ user.id }, ${ user.username }` : `User ID ${ user.id }`,
                            value: `${ user.id }`,
                            key: `${ user.id }`,
                        } ))
                    },
                    validator: {required: true}
                }
            ],
            [
                {
                    fieldName: 'amount',
                    type: 'number',
                    fieldTitle: words.invoice.amount,
                    validator: {required: true}
                }
            ],
            [

                {
                    fieldName: 'details',
                    type: 'bigText',
                    fieldTitle: words.invoice.details
                },
            ]
        ];
    }

    getActionToTitleMap(): { [p: string]: string } {
        const words: LanguageSystemWords = this.word() as LanguageSystemWords;
        return {
            'setBalance': words.title.actions.setBalance,
            'removeBalance': words.title.actions.removeBalance,
            'addBalance': words.title.actions.addBalance,
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

    handleSaveAction = async (form: InvoiceDTO): Promise<DialogFormActionResult> => {
        if (this.state.selectedForm) {
            if ([ 'setBalance', 'removeBalance', 'addBalance' ].includes(this.state.action)) {
                const response = await this.service.createEntity({...this.state.selectedForm, ...form});
                if (response) {
                    this.setState({selectedForm: undefined});
                    this.setAction('');
                    await this.userService.flushStore();
                    await this.userService.find();
                    return {pass: true};
                }
            }
        }
        const words: LanguageSystemWords = this.word() as LanguageSystemWords;
        return {pass: false, errors: [ words.serviceErrors.generalFailed ]};
    }

}

export default connect(generateMapStateEntityToProps([ adminInvoiceService.storeName, adminUserService.storeName ]))(ManageInvoices);