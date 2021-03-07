import { ButtonSetting } from "../basic";
import { ValidateResult, ValidatorFunction } from "../../models/validators";
import { PipeFunction } from "../../models/pipes";
import { BaseComponentProps } from "../components";

export interface ListOption {
    key: string;
    text: string;
    value: string;
}

export interface PasswordInputProps {
    placeholder?: string;
    className?: string;
    value: string;
    disabled?: boolean;
    error?: boolean;
    dir?: string;
    length?: number;
    onChange: (value: string) => void;
}

export interface PasswordInputState {
    passwordType: string;
    icon: string;
}

export interface EmailInputProps {
    onChange: ( (value: string) => void );
    value: string;
    placeholder?: string;
    className?: string;
    error?: boolean;
    dir?: string;
    disabled?: boolean;
}

export interface EmailInputState {
    error: string;
    touched: boolean;
}

export interface NumberFieldSetting<ValueType> {
    onChange: (value: ValueType) => void;
    onValidate?: (result: ValidateResult) => void;
    value: ValueType;
    disablePX?: boolean;
    placeholder?: string;
    className?: string;
    dir?: string;
    validatorInput?: any;
    validators?: ValidatorFunction<ValueType>[];
    liveValidators?: ValidatorFunction<ValueType>[];
    errorCodeMap?: {
        [code: string]: string
    }
    max?: number;
    min?: number;
}

export interface TextFieldSetting<ValueType> {
    onChange: (value: ValueType) => void;
    onValidate?: (result: ValidateResult) => void;
    value: ValueType;
    disablePX?: boolean;
    placeholder?: string;
    className?: string;
    length?: number;
    dir?: string;
    validatorInput?: any;
    validators?: ValidatorFunction<ValueType>[];
    liveValidators?: ValidatorFunction<ValueType>[];
    livePipe?: PipeFunction<ValueType>;
    pipe?: PipeFunction<ValueType>;
    errorCodeMap?: {
        [code: string]: string
    };
    icon?: string;
}

export interface TextAreaDTO {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    dir?: string;
    placeholder?: string;
    length?: number;
}

export interface ImageDTO {
    onChange: (image: File, recurse?: any) => void;
    onError?: () => void;
    className?: string;
    text?: string;
    buttonSetting?: ButtonSetting;
}

export interface DialogDTO {
    size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
    open: boolean;
    scrollingContent?: boolean;
    onClose: () => void;
    headerText: string;
    closeButtonSetting: ButtonSetting;
    saveButtonSetting: ButtonSetting;
    deleteButtonSetting: ButtonSetting;
}

export type DFormFieldType =
    'input'
    | 'text'
    | 'number'
    | 'range'
    | 'rating'
    | 'image'
    | 'boolean'
    | 'date'
    | 'password'
    | 'email'
    | 'bigText'
    | 'list'
    | 'multiSelect';

export interface DFormFieldOptions {
    listOptions?: ListOption[];
    length?: number;
    min?: number;
    max?: number;
    boxIcon?: string;
    checkboxLabel?: string;
    imageButtonTitle?: string;
}

export interface DFormField {
    fieldTitle: string;
    fieldName: string;
    type: DFormFieldType;
    className?: string;
    placeholder?: string;
    hideOnAction?: string[];
    disabled?: boolean;
    subInputOptions?: DFormFieldOptions;
    onChange?: (form: any, value: any) => any; // return new form
    validator?: { required?: boolean, equalToField?: string, validators?: ValidatorFunction<any>[], validatorInput?: any }
    defaultValue?: any;
    showErrorOnField?: boolean;
    hideRequiredMark?: boolean;
}

type FormAction = 'add' | 'edit' | 'delete';

export interface FormDTO<FormEntity> extends BaseComponentProps {
    fields: ( DFormField[] )[];
    onChange: (form: FormEntity) => void;
    form: FormEntity;
    action?: string;
    onValidate: (validationResult: ValidateResult) => void;
    messages?: { code: string, msg: string }[];
    className?: string;
}
