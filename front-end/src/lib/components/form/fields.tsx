import React from 'react';
import { buildCN, isTrue, pxIf } from "../../utils/utils";
import { isValidValue, NumberValidator, StringValidator, ValidatorResult } from "../../models/validators";
import { NumberPipe, RangePipe } from "../../models/pipes";
import { FlexBox } from "../containers";
import { DIR, MAX_TEXT_LENGTH, MAX_VALUE } from "../../utils/constant";
import {
    EmailInputProps,
    EmailInputState,
    ImageDTO,
    NumberFieldSetting,
    PasswordInputProps,
    PasswordInputState,
    TextAreaDTO,
    TextFieldSetting
} from "./models";
import { Input, TextArea as STextArea } from "semantic-ui-react";
import { Button } from "../basic";


function getValueFromEvent(e: HTMLInputElement) {
    return e.value ? e.value : '';
}

export function TextField(props: TextFieldSetting<any>) {
    const [ error, setError ] = React.useState(false);
    const [ validationResult, setValidationResult ] = React.useState([] as ValidatorResult[]);
    const errorsEnable = props.validators && props.validators.length > 0 ? props.validators : false;
    if (!error && errorsEnable) {
        if (props.liveValidators) {
            if (!isValidValue(props.value, props.liveValidators, props.validatorInput).valid) {
                props.onChange('');
                setError(true);
            }
        }
        if (props.validators) {
            const validateResult = isValidValue(props.value, props.validators, props.validatorInput);
            if (!validateResult.valid) {
                setError(true);
                if (props.onValidate) {
                    props.onValidate(validateResult);
                }
                setValidationResult(validateResult.results);
            }
        }
    }
    return (
        <FlexBox flexDirection={ 'column' }
                 className={ buildCN(pxIf(error, 'ui error input', 'ui input')) }>
            <input
                className={ pxIf(props.dir, props.dir, DIR.AUTO) }
                dir={ pxIf(props.dir, props.dir, DIR.AUTO) } type='text'
                value={ props.livePipe ? props.livePipe(props.value, props.validatorInput) : props.value }
                placeholder={ pxIf(props.placeholder, props.placeholder, '') }
                onChange={
                    (e) => {
                        const maxLength = pxIf(props.length, props.length, MAX_TEXT_LENGTH) as number;
                        const value = getValueFromEvent(e.target);
                        let isValid = value.length <= maxLength;
                        if (errorsEnable && props.liveValidators) {
                            isValid = isValid && isValidValue(value, props.liveValidators, props.validatorInput).valid;
                        }
                        if (isValid) {
                            props.onChange(`${ e.target.value }`);
                        }
                    }
                }
                onBlur={ (e) => {
                    const value = getValueFromEvent(e.target);
                    if (errorsEnable && props.validators) {
                        const validateResult = isValidValue(value, props.validators, props.validatorInput);
                        setError(!validateResult.valid);
                        if (props.onValidate) {
                            props.onValidate(validateResult);
                        }
                        setValidationResult(validateResult.results);
                    }
                    if (props.pipe) {
                        props.onChange(props.pipe(value, props.validatorInput));
                    }
                } }
            />
            {
                validationResult.filter(v => !v.valid).length > 0 && props.errorCodeMap ? (
                    <h6 className={ buildCN('px-non-margin ui header red', pxIf(props.dir, props.dir, DIR.AUTO), 'i-validate-msg') }
                        dir={ pxIf(props.dir, props.dir, DIR.AUTO) }>
                        { validationResult.filter(v => !v.valid)[0] ?
                            ( props.errorCodeMap as any )[validationResult.filter(v => !v.valid)[0].errorCode as any] : '' }
                    </h6>
                ) : null
            }
        </FlexBox>
    );
}

export function NumberField(props: NumberFieldSetting<number>) {
    const validators = props.validators ? [ ...props.validators, NumberValidator ] : [ NumberValidator ];
    const liveValidators = props.liveValidators ? [ ...props.liveValidators, NumberValidator ] : [ NumberValidator ];
    return <TextField { ...{
        ...props,
        liveValidators,
        validators,
        pipe: RangePipe,
        livePipe: props.min && props.max ? NumberPipe : undefined,
        validatorInput: {min: props.min, max: props.max},
        onChange: (value) => {
            props.onChange(value > MAX_VALUE ? MAX_VALUE : value as number);
        }
    } }/>
}

export function StringField(props: TextFieldSetting<string>) {
    const validators = props.validators ? [ ...props.validators, StringValidator ] : [ StringValidator ];
    const liveValidators = props.liveValidators ? [ ...props.liveValidators, StringValidator ] : [ StringValidator ];
    return <TextField { ...{
        ...props,
        liveValidators,
        validators,
    } }/>
}

export class PasswordInput extends React.Component<PasswordInputProps, PasswordInputState> {

    state = {
        passwordType: "password",
        icon: "eye link icon",
    };

    onClickPasswordType = () => {
        if (this.state.passwordType === "password") {
            this.setState({passwordType: "text", icon: "eye slash link icon"});
        } else {
            this.setState({passwordType: "password", icon: "eye link icon"});
        }
    };

    renderPlaceHolder = () => {
        if (this.props.placeholder !== undefined) {
            return this.props.placeholder;
        } else {
            return "";
        }
    };

    render() {
        return (
            <div dir={ this.props.dir ? this.props.dir : 'auto' }
                 className={ `ui icon input ${ this.props.className ? this.props.className : '' }` }>
                <Input type={ this.state.passwordType }
                       name="password"
                       autoComplete="off"
                       placeholder={ this.renderPlaceHolder() }
                       error={ this.props.error }
                       { ...this.props }
                       onChange={ (e) => {
                           const value = `${ e.target.value }`;
                           if (( this.props.length && this.props.length > value.length ) || !this.props.length) {
                               this.props.onChange(value);
                           }
                       } }
                       dir={ this.props.dir ? this.props.dir : 'auto' }
                />
                <i className={ this.state.icon } onClick={ this.onClickPasswordType }/>
            </div>
        );
    }
}

export class EmailInput extends React.Component<EmailInputProps, EmailInputState> {

    state = {
        error: '',
        touched: false
    };

    renderStyleInput = () => {
        if (this.state.error && this.state.touched) {
            return {borderColor: "rgba(200,50,50,0.5)", backgroundColor: "rgba(200,50,50,0.2)"};
        } else {
            return {};
        }
    };

    render() {
        return (
            <div className={ `ui icon input ${ this.props.className ? this.props.className : '' }` }>
                <Input { ...this.props }
                       disabled={ isTrue(this.props.disabled) }
                       error={ this.props.error }
                       type='text'
                       name='email'
                       autoComplete='on'
                       placeholder={ this.props.placeholder ? this.props.placeholder : 'Email' }
                       style={ this.renderStyleInput() }
                       onChange={ (e) => {
                           this.props.onChange(e.target.value);
                       } }
                />
                <i className='user circle icon'/>
            </div>
        );
    }
}

export function TextArea(props: TextAreaDTO) {
    return (
        <STextArea
            value={ props.value }
            className={ props.className ? props.className : '' }
            placeholder={ props.placeholder ? props.placeholder : '' }
            dir={ props.dir ? props.dir : 'auto' }
            onChange={ (e) => {
                const value = `${ e.target.value }`;
                if (( props.length && value.length <= props.length ) || !props.length) {
                    props.onChange(value);
                }
            } }

        />
    );
}

export function ImageField(props: ImageDTO) {
    let inputRef: any;
    return (
        <div>
            <Button { ...( props.buttonSetting ? props.buttonSetting : {} ) } iconSetting={ {name: 'camera'} }
                    text={ pxIf(props.text, ' ' + props.text + ' ', 'Upload') } onClick={ () => {
                if (!!inputRef) {
                    inputRef.click();
                }
            } }/>
            <input
                className={ 'file-input' }
                ref={ (input) => inputRef = input }
                type="file"
                onChange={ (event) => {
                    if (props.onChange && event.target.files) {
                        const image = event.target.files[0];
                        if (image && ( image.type === 'image/jpeg'
                            || image.type === 'image/png' || image.type === 'image/jpg' )) {
                            props.onChange(image, URL.createObjectURL(image));
                        } else {
                            if (props.onError) {
                                props.onError();
                            }
                        }
                    }
                } }
            />
        </div>
    );
}