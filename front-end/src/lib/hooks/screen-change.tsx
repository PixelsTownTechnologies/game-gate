import React from 'react';
import WindowService, { SizeChangeResult } from "../services/window.service";
import { pxIf } from "../utils/utils";

export const useWindow = (mobileValue?: any, computerValue?: any, tabletValue?: any): {
    sizeSetting: SizeChangeResult, type: "Mobile" | "Computer" | "Tablet",
    value: any, width: number, height: number, isMobile: boolean, isComputer: boolean
} => {
    const [ sizeSetting, setSizeSetting ] = React.useState<SizeChangeResult>(WindowService.getSetting());
    const [ callBackID, setCallBackID ] = React.useState<number | null>(null);
    const [ cleanSubscribe, setCleanSubscribe ] = React.useState<boolean>(false);
    React.useEffect(() => {
        if (!callBackID && !cleanSubscribe) {
            setCallBackID(WindowService.subscribe((settings) => {
                if (settings.width !== sizeSetting.width || settings.height !== sizeSetting.height) {
                    setSizeSetting(settings);
                }
            }));
        }
        return () => {
            if (callBackID) {
                setCleanSubscribe(true);
                WindowService.unsubscribe(callBackID);
                setCallBackID(null);
            }
        }
        // eslint-disable-next-line
    }, [ callBackID, cleanSubscribe ]);
    return {
        sizeSetting,
        width: sizeSetting.width,
        height: sizeSetting.height,
        type: sizeSetting.type,
        value: pxIf(sizeSetting.type === 'Mobile', mobileValue,
            pxIf(sizeSetting.type === 'Computer', computerValue ? computerValue : tabletValue, tabletValue ? tabletValue : computerValue)
        ) as any,
        isMobile: sizeSetting.type === 'Mobile',
        isComputer: sizeSetting.type === 'Computer',
    };
}