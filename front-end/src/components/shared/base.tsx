import React from "react";
import AppLogo from '../../assets/logo/logo.png';
import { Image } from "semantic-ui-react";
import { SemanticSIZES } from "semantic-ui-react/dist/commonjs/generic";

export function Logo(props: { size?: SemanticSIZES }) {
    return (
        <Image src={ AppLogo } size={ props.size ? props.size : 'small' }/>
    );
}