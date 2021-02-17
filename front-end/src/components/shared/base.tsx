import React from "react";
import AppLogo from '../../assets/logo/logo.png';
import { Dimmer, Divider, Image, Loader as SLoader } from "semantic-ui-react";
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
        <Dimmer active>
            <Logo/>
            <Divider hidden/>
            <Divider hidden/>
            <Divider hidden/>
            <SLoader />
        </Dimmer>
    );
}
