import React from 'react';
import { ValidateResult } from "../models/validators";

export const useLoader = (): { isLoading: boolean, setLoader: (flag: boolean) => void, activate: () => void, disabled: () => void } => {
    const [ isLoading, setLoader ] = React.useState<any>(false);
    return {isLoading, setLoader, activate: () => setLoader(true), disabled: () => setLoader(false)};
}

export function useForm<T>(initForm: T): {
    form: T,
    onChange: (form: T) => void,
    onValidate: (result: ValidateResult) => void,
    setForm: (form: T) => void,
    isValid: boolean
} {
    const [ form, setForm ] = React.useState<T>(initForm);
    const [ validationResult, setValidationResult ] = React.useState<ValidateResult | null>(null);
    return {
        form,
        onChange: form1 => setForm({...form, ...form1}),
        onValidate: result => setValidationResult(result),
        setForm,
        isValid: validationResult ? validationResult.valid : true
    };
}
