import { getStoreState, listenStateStore } from "../utils/application-helper";
import React from "react";

export const generateMapStateToProps = (field: string) => {
    return (state: any, ownProps: any) => {
        console.log(state);
        return {...ownProps, [field]: state[field]};
    };
}

export const useStore = <T>(entityName: string): T => {
    const storeValue = getStoreState() as any;
    const [ entity, setEntity ] = React.useState(storeValue[entityName]);
    React.useEffect(() => {
        listenStateStore(state => {
            setEntity(state[entityName]);
        }, entityName);
    })
    return entity as T;
}