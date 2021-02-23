import React from 'react';
import { Wrapper } from "../shared/wrapper";
import { FlexCenter } from "../../lib/components/containers";
import {  RouteButton } from "../../lib/components/basic";
import { ROUTES_URL } from "../../routes";

interface NotFound404Props {

}

interface NotFound404State {
}

class NotFound404Page extends React.Component<NotFound404Props, NotFound404State> {

    render() {
        return (
            <Wrapper hideTitle fitContainer className={'red'} containerCName={'px-non-padding'}>
                <FlexCenter  flexDirection={'column'} className={'px-f-height'}>
                    <h1 style={{fontSize: '3rem'}}>Not Found 404</h1>
                    <RouteButton url={ROUTES_URL.HOME} buttonSetting={{
                        text: 'Back To Home'
                    }}/>
                </FlexCenter>
            </Wrapper>
        );
    }

}

export default NotFound404Page;
