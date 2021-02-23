import React from 'react';
import { BaseComponent, BaseComponentProps, BaseComponentState } from "../components";
import { DFormField } from "./models";
import { BaseEntity } from "../../models/base";
import Dialog from "./dialog";
import Form from "./form";
import { ValidateResult } from "../../models/validators";
import { isEmpty } from "../../utils/utils";

export interface DialogFormDTO<FormDTO> {
    fields: ( DFormField[] )[];
    form: FormDTO;
    action?: string;
    messages?: { code: string, msg: string }[]
}

export interface DialogFormActionResult {
    pass: boolean;
    errors?: string[];
}

export interface DialogFormProps<FormType extends BaseEntity> extends BaseComponentProps {
    show: boolean;
    title: string;
    formSetting: DialogFormDTO<FormType>;
    hideDeleteButton?: boolean;
    onClose: () => void;
    onDelete: (id: number) => Promise<DialogFormActionResult>;
    onSave: (form: FormType) => Promise<DialogFormActionResult>;
}

interface DialogFormState<FormType extends BaseEntity> extends BaseComponentState {
    form: FormType;
    validationResult: ValidateResult;
    loadingSave: boolean;
    loadingDelete: boolean;
}

class DialogForm<FormType extends BaseEntity> extends BaseComponent<DialogFormProps<FormType>, DialogFormState<FormType>> {

    constructor(props: DialogFormProps<FormType>) {
        super(props);
        this.state = {
            ...this.state,
            form: props.formSetting.form,
            loadingDelete: false,
            loadingSave: false,
            validationResult: {} as any
        };
    }

    destroy(): void {
    }

    initialize(): void {

    }

    onFormValidate = (validationResult: ValidateResult): void => {
        this.setState({validationResult});
    }

    onFormChange = (form: FormType): void => {
        this.setState({form});
    }

    show(props: DialogFormProps<FormType>, state: DialogFormState<FormType>): JSX.Element | null {
        if (isEmpty(state.word)) {
            return null;
        }
        return (
            <Dialog
                open={ props.show }
                onClose={ props.onClose }
                headerText={ props.title }
                closeButtonSetting={
                    {
                        text: state.word.basic.cancel,
                        negative: true,
                        show: true,
                        iconSetting: {name: 'cancel'},
                        onClick: props.onClose,
                        disabled: state.loadingSave || state.loadingDelete
                    }
                }
                saveButtonSetting={
                    {
                        text: state.word.basic.save,
                        positive: true,
                        show: true,
                        disabled: !props.formSetting.form.is_editable
                            || ( !state.validationResult
                                || !state.validationResult.valid ) || state.loadingSave,
                        loading: state.loadingSave,
                        onClick: () => {
                            this.setState({loadingSave: true});
                            props.onSave(state.form).then(result => {
                                if (result.pass) {
                                    setTimeout(() => {
                                        props.onClose();
                                    }, 10);
                                } else {
                                    // View errors
                                }
                                this.setState({loadingSave: false});
                            });
                        }
                    }
                }
                deleteButtonSetting={
                    {
                        text: state.word.basic.delete,
                        show: !props.hideDeleteButton,
                        iconSetting: {name: 'trash'},
                        inverted: true,
                        basic: true,
                        negative: true,
                        disabled: !props.formSetting.form.is_deletable || state.loadingDelete,
                        loading: state.loadingDelete,
                        onClick: () => {
                            if (state.form && ( props.formSetting.form.id || props.formSetting.form.id === 0 ) && !state.loadingDelete) {
                                this.setState({loadingDelete: true});
                                props.onDelete(props.formSetting.form.id).then(result => {
                                    if (result.pass) {
                                        setTimeout(() => {
                                            props.onClose();
                                        }, 10);
                                    } else {
                                        // View errors
                                    }
                                    this.setState({loadingDelete: false});
                                });
                            }
                        }
                    }
                }
            >
                <Form
                    { ...{
                        ...this.props.formSetting,
                        form: state.form,
                        onChange: this.onFormChange,
                        onValidate: this.onFormValidate,
                    } }
                />
            </Dialog>
        );
    }


}

export default DialogForm;
