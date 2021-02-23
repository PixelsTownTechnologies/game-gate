export interface BaseEntity {
    id: number;
    is_deletable: boolean;
    is_editable: boolean;
}

export interface BaseModelMethods<EntityInterface> {
}

export class BaseModel<EntityInterface extends BaseEntity> {
    id?: number;

    constructor(entity: EntityInterface) {
        this.id = entity.id;
    }
}

export interface FromValidateField {
    filedName: string;
    valid: boolean;
    message?: string;
}

export interface FromValidateResult {
    valid: boolean;
    fields: FromValidateField[];
}


export interface FormMethods<EntityInterface> {
    isFormValid: (form: EntityInterface) => FromValidateResult;
}

export class Form {
    public static generateRequiredError(fieldName: string): string {
        return `${fieldName.toLocaleLowerCase()} filed is required`;
    }

    public static generateNotMatchError(fieldName: string): string {
        return `${fieldName.toLocaleLowerCase()} not match, Please try again`;
    }

    public static generateNotValidError(fieldName: string): string {
        return `${fieldName.toLocaleLowerCase()} field value not valid, Please try again`;
    }
}

export class Model {


}
