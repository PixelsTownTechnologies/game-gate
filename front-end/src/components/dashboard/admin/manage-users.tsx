import { GroupBaseDTO, UserBaseDTO } from "../../../lib/models/user";
import { adminUserService, groupsService } from "../../../services/service-config";
import { connect } from "react-redux";
import { generateMapStateEntityToProps } from "../../../lib/store/util";
import { LanguageSystemWords } from "../../../models/language";
import { Wrapper } from "../../shared/wrapper";
import { TableSetting } from "../../../lib/components/tabels";
import EntityWrapper, {
    EntityWrapperConfig,
    EntityWrapperProps,
    EntityWrapperState
} from "../../../lib/components/wrapper/entity-wrapprt";
import { DFormField } from "../../../lib/components/form/models";
import { getDefaultValidMsg } from "../../../lib/utils/utils";
import { VALIDATOR_CODES } from "../../../lib/models/validators";
import { EntityService } from "../../../lib/services/entity-service/entity-service";
import { DialogFormActionResult } from "../../../lib/components/form/dialog-form";
import { Button } from "../../../lib/components/basic";
import React from "react";

interface ManageUsersProps extends EntityWrapperProps<UserBaseDTO> {
    groups: GroupBaseDTO[];
}

interface ManageUsersState extends EntityWrapperState<UserBaseDTO> {
}


class ManageUsers extends EntityWrapper<UserBaseDTO, ManageUsersProps, ManageUsersState> {

    groupService: EntityService<GroupBaseDTO>;

    constructor(props: ManageUsersProps) {
        super(props, adminUserService);
        this.groupService = new EntityService<GroupBaseDTO>(groupsService);
    }

    init = (): void => {
        this.groupService.find().then();
    }

    getConfig(): EntityWrapperConfig {
        const word: LanguageSystemWords = this.word() as LanguageSystemWords;
        return {
            title: word.title.manageUsers,
            icon: 'users'
        };
    }

    getWrapper = () => {
        return Wrapper;
    }

    getSubButtons = () => {
        const word: LanguageSystemWords = this.word() as LanguageSystemWords;
        return (
            <Button
                color={ 'grey' }
                onClick={ () => this.setAction('editPermission') }
                disabled={ !this.state.selectedForm }
                text={ word.title.actions.permissions }
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
                width: 80,
                center: true
            },
            {
                fieldName: 'username',
                title: word.userFields.userName,
                type: 'text',
                width: 120,
                center: true
            },
            {
                fieldName: 'email',
                title: word.userFields.email,
                type: 'text',
                width: 200,
                center: true
            },
            {
                fieldName: 'address_one',
                title: word.userFields.addressOne,
                type: 'text',
                width: 200,
                center: true
            },
            {
                fieldName: 'balance',
                title: word.userFields.balance,
                type: 'balance',
                width: 120,
                center: true
            },
            {
                fieldName: 'points',
                title: word.entities.user.points,
                type: 'formattedNumber',
                width: 120,
                center: true
            },
            {
                fieldName: 'total_orders',
                title: word.entities.user.numberOfOrders,
                type: 'formattedNumber',
                width: 120,
                center: true
            },
        ];
    }

    getFormFields(): DFormField[][] {
        const words = this.state.word;
        return [
            [
                {
                    fieldName: 'email',
                    type: 'email',
                    validator: {required: true},
                    subInputOptions: {length: 128},
                    fieldTitle: words.userFields.email,
                    hideOnAction: [ 'edit', 'editPermission' ]
                },
                {
                    fieldName: 'username',
                    type: 'text',
                    validator: {required: true},
                    subInputOptions: {length: 64},
                    fieldTitle: this.state.word.userFields.userName,
                    hideOnAction: [ 'editPermission' ]

                }
            ],
            [
            {
                fieldName: 'address_one',
                type: 'text',
                subInputOptions: {length: 128},
                fieldTitle: this.state.word.userFields.addressOne

            }
        ],
            [
                {
                    fieldName: 'password',
                    fieldTitle: words.userFields.newPassword,
                    type: 'password',
                    validator: {required: true},
                    hideRequiredMark: true,
                    hideOnAction: [ 'edit', 'editPermission' ]
                }
            ],
            [
                {
                    fieldName: 'confirmPassword',
                    fieldTitle: words.userFields.confirmPassword,
                    type: 'password',
                    validator: {required: true, equalToField: 'password'},
                    hideOnAction: [ 'edit', 'editPermission' ]
                }
            ],
            [
                {
                    fieldName: 'groups',
                    fieldTitle: words.userFields.groups,
                    type: 'multiSelect',
                    hideOnAction: [ 'add', 'edit' ],
                    subInputOptions: {
                        listOptions: this.props.groups.map(g => ( {key: g.name, value: g.name, text: g.name} ))
                    },

                }
            ]
        ];
    }

    getActionToTitleMap(): { [p: string]: string } {
        const words: LanguageSystemWords = this.word() as LanguageSystemWords;
        return {
            'edit': words.title.actions.editUser,
            'add': words.title.actions.addUser,
            'editPermission': words.title.actions.changePermissions
        };
    }

    getMessagesErrorForm(): { code: string; msg: string }[] {
        const words: LanguageSystemWords = this.word() as LanguageSystemWords;
        return [
            ...getDefaultValidMsg(words),
            {code: VALIDATOR_CODES.NOT_EQUAL_TO, msg: words.errors.passwordAndConfirmPassword}
        ];
    }

    async handleSaveAction(form: UserBaseDTO | { groups: string[] }): Promise<DialogFormActionResult> {
        if (this.state.selectedForm) {
            if (this.state.action === 'editPermission') {
                const response = await this.groupService.updateEntity(this.state.selectedForm.id, {groups: this.props.groups.filter(g => g && form.groups.includes(g.name as any)).map(g => g.id)});
                if (response) {
                    await this.service.flushStore();
                    await this.service.find();
                    this.setState({selectedForm: undefined});
                    return {pass: true};
                } else {
                    const words: LanguageSystemWords = this.word() as LanguageSystemWords;
                    return {pass: false, errors: [ words.serviceErrors.generalFailed ]};
                }
            }
        }
        return super.handleSaveAction(form as UserBaseDTO);
    }

    getData = (): any[] => {
        return super.getData().map(user => ( {...user, groups: user.groups.map(g => g.name)} ));
    }

    showAddButton(): boolean {
        return true;
    }

    showEditButton(): boolean {
        return true;
    }

}

export default connect(generateMapStateEntityToProps([ adminUserService.storeName, groupsService.storeName ]))(ManageUsers);