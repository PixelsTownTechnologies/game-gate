import { getStoreState, listenStateStore } from "../utils/application-helper";
import React from "react";
import { Unsubscribe } from "redux";

export function useEntityStore<T>(entityName: string): T {
	const storeValue = getStoreState() as any;
	const [ entity, setEntity ] = React.useState(storeValue[entityName]);
	const [ callBack, setCallBack ] = React.useState<Unsubscribe | null>(null);
	React.useEffect(() => {
		if (!callBack) {
			setCallBack(listenStateStore(state => {
				setEntity(state[entityName]);
			}, entityName));
		}
		return () => {
			if (callBack) {
				callBack();
			}
		}
	}, [ entity, callBack, entityName ])
	return entity as T;
}

