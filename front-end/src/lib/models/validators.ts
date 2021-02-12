export const VALIDATOR_CODES = {
    NONE: 'NONE',
    NUMBER: 'NUMBER',
    RANGE_NUMBER: 'RANGE_NUMBER',
    REQUIRED_FIELD: 'REQUIRED_FIELD',
    NOT_EQUAL_TO: 'NOT_EQUAL_TO'
}

export interface ValidatorResult {
    valid: boolean;
    errorCode?: string;
    subMsg?: string;
}

export interface ValidateResult {
    valid: boolean;
    results: ValidatorResult[];
}


export function isValidValue<T>(value: T, validators: ValidatorFunction<T>[], validatorInput: any): ValidateResult {
    const results = [];
    for (const validator of validators) {
        results.push(validator(value, validatorInput));
    }
    return {results, valid: results.filter(r => !r.valid).length < 1};
}


export type ValidatorFunction<T> = (value: T, subInput: any) => ValidatorResult;

export const NumberValidator: ValidatorFunction<number> = (value: number | undefined, subInput: any): ValidatorResult => {
    return {errorCode: VALIDATOR_CODES.NUMBER, valid: value !== undefined ? !isNaN(value) : true}
}

export const RangeValidator: ValidatorFunction<number> = (value1: number, subInput: { max: number, min: number }) => {
    return {
        valid: Number(value1) >= subInput.min && Number(value1) <= subInput.max,
        errorCode: VALIDATOR_CODES.RANGE_NUMBER
    }
}

export const StringValidator: ValidatorFunction<string> = (value: string | undefined, subInput: any): ValidatorResult => {
    return {errorCode: VALIDATOR_CODES.NUMBER, valid: value ? /^[a-zA-Z]+$/.test(value) : true}
}

export const EmailValidator: ValidatorFunction<string> = (value: string | undefined, subInput: any): ValidatorResult => {
    return {
        errorCode: VALIDATOR_CODES.NUMBER,
        valid: value ? /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value) : true
    }
}

