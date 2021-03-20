import React from "react";
import AppLogo from '../../assets/logo/logo.png';
import { Dimmer, Divider, Image } from "semantic-ui-react";
import { SemanticSIZES } from "semantic-ui-react/dist/commonjs/generic";

export function Logo(props: { size?: SemanticSIZES }) {
    return (
        <Image src={ AppLogo } size={ props.size ? props.size : 'small' }/>
    );
}

export function Loader(props: { show: boolean }) {
    if (!props.show) {
        return null;
    }
    return (
        <Dimmer page active className={'main-app-loader'}>
            <Logo/>
            <Divider hidden/>
            <Divider hidden/>
            <Divider hidden/>
            <div className="lds-facebook">
                <div/>
                <div/>
                <div/>
            </div>
        </Dimmer>
    );
}
