import { StoreState } from "../models/application";

export const generateMapStateToProps = (field: string) => {
    return (state: any, ownProps: any) => {
        return {...ownProps, [field]: state[field]};
    };
}

export const generateMapStateEntityToProps = (fields: string[]) => {
    return (state: StoreState, ownProps: any) => {
        const map = {...ownProps} as any;
        fields.forEach(fieldName => {
            map[fieldName] = state.entity && state.entity[fieldName] ? state.entity[fieldName] : [];
        })
        map.user = state.user;
        return map;
    };
}
