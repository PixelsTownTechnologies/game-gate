import React from 'react';
import { Wrapper } from "../shared/wrapper";
import { FlexCenter } from "../../lib/components/containers";
import { RouteButton } from "../../lib/components/basic";
import { ROUTES_URL } from "../../routes";
import { useLanguage } from "../../lib/hooks/languageHook";

interface NotFound404Props {

}

interface NotFound404State {
}

export function NotFoundWidget(props: { message?: string }) {
    const {words} = useLanguage();
    return (
        <FlexCenter flexDirection={ 'column' } className={ 'px-f-height' }>
            <h1 style={ {fontSize: '3rem'} }>{ props.message ? props.message : words.basic.notFound } 404</h1>
            <RouteButton
                url={ ROUTES_URL.HOME }
                buttonSetting={ {
                    text: words.basic.backToHome
                } }
            />
        </FlexCenter>
    );
}

class NotFound404Page extends React.Component<NotFound404Props, NotFound404State> {

    render() {
        return (
            <Wrapper hideTitle fitContainer className={ 'red' } containerCName={ 'px-non-padding' }>
                <NotFoundWidget/>
            </Wrapper>
        );
    }

}

export default NotFound404Page;
