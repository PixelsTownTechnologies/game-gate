import React from 'react';

export const useLoader = (): { isLoading: boolean, setLoader: (flag: boolean) => void, activate: () => void, disabled: () => void } => {
    const [ isLoading, setLoader ] = React.useState<any>(false);
    return {isLoading, setLoader, activate: () => setLoader(true), disabled: () => setLoader(false)};
}