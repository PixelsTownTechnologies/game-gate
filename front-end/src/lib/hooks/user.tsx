import { getStoreState, listenStateStore } from "../utils/application-helper";
import React from "react";
import { Unsubscribe } from "redux";

export function useEntityStore<T>(entityName: string): T {
    const storeValue = getStoreState() as any;
    const [ entity, setEntity ] = React.useState(storeValue[entityName]);
    const [ callBack, setCallBack ] = React.useState<Unsubscribe | null>(null);
    const [ cleanSubscribe, setCleanSubscribe ] = React.useState<boolean>(false);
    React.useEffect(() => {
        if (!cleanSubscribe && !callBack) {
            setCallBack(listenStateStore(state => {
                setEntity(state[entityName]);
            }, entityName));
        }
        return () => {
            if (callBack) {
                setCleanSubscribe(true);
                callBack();
            }
        }
        // eslint-disable-next-line
    }, [ callBack, cleanSubscribe ])
    return entity as T;
}

