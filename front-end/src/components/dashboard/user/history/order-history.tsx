import { connect } from "react-redux";
import React from "react";
import EntityWrapper, {
    EntityWrapperConfig,
    EntityWrapperProps,
    EntityWrapperState
} from "../../../../lib/components/wrapper/entity-wrapprt";
import { GameDTO, OrderDTO } from "../../../../models/game";
import { UserBaseDTO } from "../../../../lib/models/user";
import { userOrderService } from "../../../../services/service-config";
import { TableSetting } from "../../../../lib/components/tabels";
import { DFormField } from "../../../../lib/components/form/models";
import { LanguageSystemWords } from "../../../../models/language";
import { Wrapper } from "../../../shared/wrapper";
import { costFormat, getDefaultValidMsg } from "../../../../lib/utils/utils";
import { generateMapStateEntityToProps } from "../../../../lib/store/util";
import { Button, IconButton, Link } from "../../../../lib/components/basic";
import { DialogFormActionResult } from "../../../../lib/components/form/dialog-form";
import Dialog from "../../../../lib/components/form/dialog";
import { Form, Label, TextArea } from "semantic-ui-react";
import { URL_ROUTES } from "../../../../routes";

interface OrderHistoryProps extends EntityWrapperProps<OrderDTO> {
    user: UserBaseDTO;
}

interface OrderHistoryState extends EntityWrapperState<OrderDTO> {
    showKeysDialog: boolean;
}

class OrderHistory extends EntityWrapper<OrderDTO, OrderHistoryProps, OrderHistoryState> {

    constructor(props: OrderHistoryProps) {
        super(props, userOrderService);
        this.state = {
            ...this.state,
            showKeysDialog: false
        }
    }

    init = (): void => {
    }

    getConfig(): EntityWrapperConfig {
        const word: LanguageSystemWords = this.word() as LanguageSystemWords;
        return {
            title: word.entities.order.orderHistory,
            icon: 'clipboard',
            showTableContainer: false,
            showSubMenu: true,
            hideTopSections: true
        };
    }

    getWrapper = () => {
        return Wrapper;
    }

    getTableSettings(): TableSetting[] {
        const word: LanguageSystemWords = this.word() as LanguageSystemWords;
        return [
            {
                fieldName: 'state',
                title: word.entities.order.state,
                type: 'valueMap',
                width: 100,
                center: true,
                valueMap: word.entities.order.stateMap,
                displayValue: (row) => {
                    const colorMap = {
                        'I': 'teal',
                        'E': 'red',
                        'C': 'green'
                    } as any;
                    return (
                        <Label color={colorMap[row.state]}>{(word.entities.order.stateMap as any)[row.state]}</Label>
                    );
                }
            },
            {
                fieldName: 'id',
                title: word.fields.id,
                type: 'link',
                width: 80,
                center: true,
                displayValue: (row) => {
                    return (
                        <Link
                            to={ URL_ROUTES.USER.ORDER_HISTORY_VIEW + '/' + row.id }>{ row.id.toPrecision(8).split('.').reverse().join('') }</Link>
                    )
                }
            },
            {
                fieldName: 'quantity',
                title: word.entities.order.quantity,
                type: 'number',
                width: 100,
                center: true
            },
            {
                fieldName: 'cost',
                title: word.entities.order.cost,
                type: 'formattedNumber',
                width: 100,
                center: true,
                displayValue: (row) => {
                    return `$${costFormat(row.cost)}` as any;
                }
            },
            {
                fieldName: 'create',
                title: word.entities.order.orderDate,
                type: 'date',
                width: 100,
                center: true
            },
            {
                fieldName: '',
                title: word.basic.edit,
                type: 'editButton',
                width: 100,
                center: true,
                displayValue: (row) =>{
                    return (
                        <IconButton
                            name={ 'edit' }
                            size={'mini'}
                            disabled={row.state !== 'E'}
                            onClick={ () => {
                                if(row.state === 'E'){
                                    this.setState({selectedForm: row, action: 'edit'});
                                }
                            } }
                        />
                    );
                }
            },
        ];
    }

    getFormFields(): DFormField[][] {
        const words = this.state.word as LanguageSystemWords;
        return [
            [
                {
                    fieldName: 'account_id',
                    type: 'text',
                    fieldTitle: words.entities.order.account_id,
                    defaultValue: '',
                    hideOnAction: [ 'review' ]
                },
            ],
            [
                {
                    fieldName: 'extra_info',
                    type: 'bigText',
                    fieldTitle: words.entities.order.extra_info,
                    defaultValue: '',
                    hideOnAction: [ 'review' ]
                },
            ],
            [
                {
                    fieldName: 'review_star',
                    type: 'rating',
                    fieldTitle: words.entities.order.review_star,
                    defaultValue: 1,
                    hideOnAction: [ 'edit' ]
                },
            ],
            [
                {
                    fieldName: 'review_description',
                    type: 'bigText',
                    fieldTitle: words.entities.order.review_description,
                    defaultValue: '',
                    hideOnAction: [ 'edit' ]
                },
            ]
        ];
    }

    getActionToTitleMap(): { [p: string]: string } {
        const words: LanguageSystemWords = this.word() as LanguageSystemWords;
        return {
            'edit': words.entities.order.actions.edit,
            'review': words.entities.order.actions.review
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

    getSubButtons(): any {
        const words = this.state.word as LanguageSystemWords;
        return (
            [
                <Button
                    key={ 1 }
                    color={ 'grey' }
                    onClick={ () => {
                        this.setAction('edit');
                    } }
                    disabled={ !this.state.selectedForm
                    || this.state.action === 'add'
                    || this.state.selectedForm?.state !== "E" }
                    text={ this.state.word.basic.edit }
                    iconSetting={ {name: 'edit', labelPosition: 'left', attachToButton: true} }
                />,
                <Button
                    key={ 2 }
                    color={ 'orange' }
                    onClick={ () => {
                        this.setState({showKeysDialog: true});
                    } }
                    disabled={ !this.state.selectedForm || ( this.state.selectedForm?.game_card?.game as GameDTO )?.type !== 'K' }
                    text={ words.entities.order.actions.showKeys }
                    iconSetting={ {name: 'key', labelPosition: 'left', attachToButton: true} }
                />,
                <Button
                    key={ 3 }
                    color={ 'yellow' }
                    onClick={ () => this.setAction('review') }
                    disabled={ !this.state.selectedForm
                    || this.state.action === 'add'
                    || this.state.selectedForm?.state !== "C" || !!this.state.selectedForm.review_star }
                    text={ words.entities.order.actions.review }
                    iconSetting={ {name: 'star', labelPosition: 'left', attachToButton: true} }
                />
            ]
        );
    }

    showExtraElement(): any {
        return this.showKeysDialog();
    }

    showKeysDialog = () => {
        const words = this.state.word as LanguageSystemWords;
        return (
            <Dialog
                open={ !!this.state.selectedForm && this.state.showKeysDialog }
                onClose={ () => {
                    this.setState({showKeysDialog: false});
                } }
                headerText={ words.entities.order.orderKeys }
                size={ 'small' }
                closeButtonSetting={
                    {
                        show: false
                    }
                }
                saveButtonSetting={
                    {
                        show: false
                    }
                }
                deleteButtonSetting={
                    {
                        show: false
                    }
                }
            >
                <Form>
                    <TextArea
                        rows={ 15 }
                        value={
                            this.state.selectedForm?.order_keys?.map(k => k.description).join('\n------------------------------------\n')
                        }
                    />
                </Form>
            </Dialog>
        );
    }

    public async handleSaveAction(form: OrderDTO): Promise<DialogFormActionResult> {
        if (this.state.selectedForm) {
            if (this.state.action === 'edit') {
                const response = await this.service.updateEntity(this.state.selectedForm.id, {
                    ...form,
                    state: 'I'
                } as any);
                if (response) {
                    this.setState({selectedForm: this.getData()?.filter(e => e.id === this.state.selectedForm?.id)?.[0]});
                    return {pass: true};
                }
            }
            if (this.state.action === 'review'
                && this.state.selectedForm.state === 'C'
                && !this.state.selectedForm.review_star
            ) {
                const response = await this.service.updateEntity(this.state.selectedForm.id, {
                    ...form,
                    review_date: new Date(Date.now()).toLocaleDateString()
                });
                if (response) {
                    this.setState({selectedForm: this.getData()?.filter(e => e.id === this.state.selectedForm?.id)?.[0]});
                    return {pass: true};
                }
            }
        }
        return {pass: false};
    }

}

export default connect(generateMapStateEntityToProps([ userOrderService.storeName ]))(OrderHistory);