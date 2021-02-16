import React from 'react';
import { DFormField, FormDTO } from "./models";
import { BaseComponent, BaseComponentMethods, BaseComponentState } from "../components";
import { EmailInput, ImageField, NumberField, PasswordInput, TextArea, TextField } from "./fields";
import { Checkbox, Dropdown, Form as SForm } from "semantic-ui-react";
import { ValidateResult, VALIDATOR_CODES, ValidatorResult } from "../../models/validators";
import { DIR } from "../../utils/constant";
import { FlexBox, Map } from "../containers";
import { buildCN, isEmpty, isEqual, isUndefined, pxIf } from "../../utils/utils";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";

interface FormState extends BaseComponentState {
    direction: string;
    languageSubscribeID: number;
    initializeForm: boolean;
    validationResult: { field: string, result: ValidatorResult[] }[];
}

export function getDynamicField(config: DFormField, onChange: (value: any) => void, value: any, dir: string = 'auto'): JSX.Element | null {
    if (config.type === 'number') {
        return (
            <NumberField
                className={ config.className }
                dir={ dir }
                placeholder={ config.placeholder }
                onChange={ onChange }
                value={ value }
            />
        );
    }
    if (config.type === 'bigText') {
        return (
            <TextArea
                length={ config.subInputOptions ? config.subInputOptions.length : undefined }
                className={ config.className }
                dir={ dir }
                placeholder={ config.placeholder }
                onChange={ onChange }
                value={ value }
            />
        );
    }
    if (config.type === 'text') {
        return (
            <TextField
                length={ config.subInputOptions ? config.subInputOptions.length : undefined }
                className={ config.className }
                dir={ dir }
                placeholder={ config.placeholder }
                onChange={ onChange }
                value={ value }
            />
        );
    }
    if (config.type === 'range') {
        return (
            <NumberField
                min={ config.subInputOptions ? config.subInputOptions.min : undefined }
                max={ config.subInputOptions ? config.subInputOptions.max : undefined }
                className={ config.className }
                dir={ dir }
                placeholder={ config.placeholder }
                onChange={ onChange }
                value={ value }
            />
        );
    }
    if (config.type === 'password') {
        return (
            <PasswordInput
                className={ config.className }
                dir={ dir }
                length={ config.subInputOptions ? config.subInputOptions.length : undefined }
                placeholder={ config.placeholder }
                onChange={ onChange }
                value={ value }
            />
        );
    }
    if (config.type === 'email') {
        return (
            <EmailInput
                className={ config.className }
                dir={ dir }
                placeholder={ config.placeholder }
                onChange={ onChange }
                value={ value }
            />
        );
    }
    if (config.type === 'boolean') {
        return (
            <Checkbox
                toggle
                direction={ dir === DIR.RTL ? 'right' : 'left' }
                className={ config.className ? config.className : '' }
                checked={ value }
                label={ config.subInputOptions && config.subInputOptions.checkboxLabel ? config.subInputOptions.checkboxLabel : '' }
                onChange={ (e) => {
                    onChange(!value);
                } }
            />
        );
    }
    if (config.type === 'list') {
        return (
            <Dropdown
                fluid
                search
                selection
                direction={ dir === DIR.RTL ? 'right' : 'left' }
                options={ config.subInputOptions ? config.subInputOptions.listOptions : [] }
                className={ config.className ? config.className : '' }
                placeholder={ config.placeholder ? config.placeholder : '' }
                value={ value }
                onChange={ (e, data) => {
                    onChange(data);
                } }
            />
        );
    }
    if (config.type === 'multiSelect') {
        return (
            <Dropdown
                fluid
                search
                multiple
                direction={ dir === DIR.RTL ? 'right' : 'left' }
                selection
                options={ config.subInputOptions ? config.subInputOptions.listOptions : [] }
                className={ config.className ? config.className : '' }
                placeholder={ config.placeholder ? config.placeholder : '' }
                value={ value }
                onChange={ (e, data) => {
                    onChange(data);
                } }
            />
        );
    }
    if (config.type === 'image') {
        return (
            <ImageField
                onChange={ (image, recurse) => {
                    onChange(image);
                } }
                className={ config.className }
                text={ config.subInputOptions ? config.subInputOptions.imageButtonTitle : undefined }
            />
        );
    }
    return null;
}

class Form<FormEntityDTO> extends BaseComponent<FormDTO<FormEntityDTO>, FormState> implements BaseComponentMethods<FormDTO<FormEntityDTO>, FormState> {

    constructor(props: FormDTO<FormEntityDTO>) {
        super(props);
        this.state = {
            ...this.state,
            validationResult: []
        };
    }

    showField = (config: DFormField) => {
        return !( ( this.props.action && config.hideOnAction && config.hideOnAction.includes(this.props.action) )
            || ( !config.type || !config.fieldName || !config.fieldTitle ) );
    }

    getFields = (): DFormField[] => {
        let list = [] as DFormField[];
        if (this.props.fields) {
            this.props.fields.forEach(row => {
                list = [ ...list, ...row ? row : [] ];
            });
        }
        return list.filter(field => this.showField(field));
    }

    getFilterFields = (): ( DFormField[] )[] => {
        const list = [] as ( DFormField[] )[];
        this.props.fields.forEach(row => {
            const subList = row.filter(field => this.showField(field));
            if (subList.length > 0) {
                list.push(subList);
            }
        })
        return list;
    }

    getMessageForCode = (errorCode: string): string => {
        if (!this.props.messages) {
            return '';
        }
        const messagesList = this.props.messages.filter(row => row.code === errorCode);
        return messagesList && messagesList.length > 0 ? messagesList[0].msg : '';
    }

    buildMessageErrorField = (fieldTitle: string, codeError: string, fieldTitle2?: string) => {
        return `${ fieldTitle }${ fieldTitle2 ? ', ' + fieldTitle2 : '' }: ${ this.getMessageForCode(codeError) }`
    }

    validateForm = (form: any): ValidateResult => {
        const fields = this.getFields();
        const validateResult: ValidatorResult[] = [];
        const fieldValidationResult = [] as { field: string, result: ValidatorResult[] }[];
        Object.keys(form).forEach((fieldName: string) => {
            const fieldValue: any = form[fieldName];
            const fieldSettings: DFormField = fields.filter(f => f.fieldName === fieldName)[0];
            if (fieldSettings.validator) {
                if (fieldSettings.validator.required && isEmpty(fieldValue)) {
                    const validationResult = {
                        valid: false,
                        errorCode: VALIDATOR_CODES.REQUIRED_FIELD,
                        subMsg: this.buildMessageErrorField(fieldSettings.fieldTitle, VALIDATOR_CODES.REQUIRED_FIELD)
                    };
                    validateResult.push(validationResult);
                    fieldValidationResult.push({
                        result: [ validationResult ],
                        field: fieldSettings.fieldName
                    });
                }
                if (fieldSettings.validator.equalToField && !isEqual(fieldValue, form[fieldSettings.validator.equalToField])) {
                    const otherField = fields.filter(f => f.fieldName === fieldSettings?.validator?.equalToField);
                    const validationResult = {
                        valid: false,
                        errorCode: VALIDATOR_CODES.NOT_EQUAL_TO,
                        subMsg: this.buildMessageErrorField(fieldSettings.fieldTitle,
                            VALIDATOR_CODES.NOT_EQUAL_TO,
                            otherField.length > 0 ? otherField[0].fieldTitle : '')
                    };
                    validateResult.push(validationResult);
                    fieldValidationResult.push({
                        result: [ validationResult ],
                        field: fieldSettings.fieldName
                    });
                }
                if (fieldSettings.validator.validators) {
                    fieldSettings.validator.validators.forEach(validateFunction => {
                        const validatorResult = validateFunction(fieldValue, fieldSettings.validator?.validatorInput);
                        if (!validatorResult.valid) {
                            const validResult = {
                                ...validatorResult,
                                subMsg: validatorResult.subMsg ? validatorResult.subMsg
                                    : this.buildMessageErrorField(fieldSettings.fieldTitle, validatorResult.errorCode
                                        ? validatorResult.errorCode : VALIDATOR_CODES.NONE)
                            };
                            validateResult.push(validResult);
                            fieldValidationResult.push({
                                result: [ validResult ],
                                field: fieldSettings.fieldName
                            });
                        }
                    })
                }
            }
        });
        this.setState({validationResult: fieldValidationResult});
        return {valid: validateResult.length < 1, results: validateResult};
    }

    destroy(): void {
    }

    initialize(): void {
        const {form, onChange} = this.props;
        const newForm = {} as any;
        const fields = this.getFields();
        if (onChange && fields) {
            fields.forEach(field => {
                if (form && ( form as any )[field.fieldName] !== undefined) {
                    newForm[field.fieldName] = ( form as any )[field.fieldName];
                } else {
                    newForm[field.fieldName] = field.defaultValue;
                }
            });
            if (onChange) {
                onChange(newForm);
            }
        }
        this.props.onValidate(this.validateForm(newForm));
        this.setState({initializeForm: true});
    }

    updateForm = (value: any, field: string) => {
        const form = {...this.props.form} as any;
        form[field] = value;
        this.props.onChange(form);
        this.props.onValidate(this.validateForm(form));
    }

    show({form}: FormDTO<FormEntityDTO>, state: FormState): JSX.Element | null {
        if (!state.initializeForm) {
            return null;
        }
        return (
            <SForm>
                <Map
                    list={ this.getFilterFields() }
                    mapper={ (row: DFormField[][], key) => {
                        return (
                            <SForm.Group key={ key } widths='equal'>
                                <Map
                                    list={ row }
                                    mapper={ (row1: DFormField, key1) => {
                                        const fieldValidators = this.state.validationResult.filter(v => v.field === row1.fieldName);
                                        let validateMessage = null;
                                        if (isUndefined(row1.showErrorOnField) || row1.showErrorOnField) {
                                            if (fieldValidators && fieldValidators.length > 0
                                                && fieldValidators[0].result && fieldValidators[0].result.length > 0) {
                                                if (this.props.messages) {
                                                    const filterMessages = this.props.messages.filter(m => m.code === fieldValidators[0].result[0].errorCode);
                                                    if (!isEmpty(filterMessages)) {
                                                        validateMessage = filterMessages[0].msg;
                                                    } else {
                                                        validateMessage = fieldValidators[0].result[0].subMsg;
                                                    }
                                                } else {
                                                    validateMessage = fieldValidators[0].result[0].subMsg;
                                                }
                                            }
                                        }
                                        return (
                                            <SForm.Field className={ buildCN(
                                                pxIf(state.direction, state.direction, DIR.AUTO)) }
                                                         disabled={ row1.disabled } key={ key1 }>
                                                <label dir={ pxIf(state.direction, state.direction, DIR.AUTO) }
                                                       style={ {display: 'flex'} }>{ row1.fieldTitle }
                                                    {
                                                        row1.validator && row1.validator.required ? (
                                                            <Icon size={ 'tiny' } name={ 'asterisk' } color={ 'red' }/>
                                                        ) : null
                                                    }
                                                </label>
                                                <FlexBox flexDirection={ 'column' }
                                                         dir={ pxIf(state.direction, state.direction, DIR.AUTO) }>
                                                    {
                                                        getDynamicField(row1, value => {
                                                            this.updateForm(value, row1.fieldName);
                                                        }, ( form as any )[row1.fieldName], this.state.direction)
                                                    }
                                                    { validateMessage ?
                                                        <h6 className={ buildCN('px-non-margin ui header red',
                                                            pxIf(state.direction, state.direction, DIR.AUTO)) }
                                                            dir={ pxIf(state.direction, state.direction, DIR.AUTO) }>
                                                            { validateMessage }
                                                        </h6> : null
                                                    }
                                                </FlexBox>
                                            </SForm.Field>
                                        );
                                    } }/>
                            </SForm.Group>
                        );
                    } }/>
            </SForm>
        );
    }

}

export default Form;
