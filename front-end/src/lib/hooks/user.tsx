import { getStoreState, listenStateStore } from "../utils/application-helper";
import React from "react";

export function useStore<T>(entityName: string): T {
    const storeValue = getStoreState() as any;
    const [ entity, setEntity ] = React.useState(storeValue[entityName]);
    React.useEffect(() => {
        listenStateStore(state => {
            setEntity(state[entityName]);
        }, entityName);
    })
    return entity as T;
}
