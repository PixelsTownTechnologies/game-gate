import React from "react";
import { Button as SButton, Dimmer, Icon, Loader as SLoader, SemanticCOLORS } from "semantic-ui-react";
import { classNameHelper } from "../utils/utils";
import { SemanticSIZES } from "semantic-ui-react/dist/commonjs/generic";


export function Loader(props: { show: boolean }) {
    if (!props.show) {
        return null;
    }
    return (
        <Dimmer inverted active>
            <SLoader inverted/>
        </Dimmer>
    );
}

export interface BaseButton {
    size?: SemanticSIZES;
    loading?: boolean;
    disabled?: boolean;
    show?: boolean;
    circular?: boolean;
    onClick?: () => void;
    color?:
        | SemanticCOLORS
        | 'facebook'
        | 'google plus'
        | 'vk'
        | 'twitter'
        | 'linkedin'
        | 'instagram'
        | 'youtube';
    positive?: boolean;
    negative?: boolean;
    basic?: boolean;
    className?: string;
    inverted?: boolean;
    disablePXButton?: boolean;
}

export interface ButtonSetting extends BaseButton {
    text?: string;
    iconSetting?: { name: string, attachToButton?: boolean, labelPosition?: 'left' | 'right' };
}

export interface LinkButton {
    url: string;
    buttonSetting?: ButtonSetting;
    type?: 'blank' | 'self';
}

export function Button(props: ButtonSetting) {
    if (props.show === false) {
        return null;
    }
    return (
        <SButton
            size={ props.size ? props.size : undefined }
            disabled={ props.disabled }
            loading={ props.loading }
            positive={ props.positive }
            negative={ props.negative }
            color={ props.color ? props.color : undefined }
            onClick={ () => {
                if (!props.disabled && props.onClick) {
                    props.onClick();
                }
            } }
            basic={ props.basic }
            inverted={ props.inverted }
            circular={ props.circular }
            labelPosition={ props.iconSetting && props.iconSetting.labelPosition ? props.iconSetting.labelPosition : undefined }
            className={ classNameHelper(props.disablePXButton ? '' : 'px-lib', props.className ? props.className : '') }
            icon={ props.iconSetting && props.iconSetting.attachToButton }
        >
            {
                props.iconSetting ? (
                    <Icon name={ props.iconSetting.name as any }/>
                ) : null
            } { props.text ? props.text : null }
        </SButton>
    );
}

export function LinkButton(props: LinkButton) {
    return (
        <a target={ props.type ? `_${ props.type }` : '_blank' } href={ props.url }>
            <Button { ...props.buttonSetting } />
        </a>
    ) as any;
}

interface IconButton extends BaseButton {
    name: string;
}

export function IconButton(props: IconButton) {
    return <Button { ...{...props, iconSetting: {name: props.name, attachToButton: true}} }/>
}

interface IconTextButton extends IconButton {
    attach?: 'left' | 'right';
    text?: string;
    children?: string;
}

export function IconTextButton(props: IconTextButton) {
    return <Button { ...{
        ...props,
        iconSetting: {
            name: props.name,
            attachToButton: true,
            labelPosition: props.attach ? props.attach : 'left'
        },
        text: props.text ? props.text : ( props.children ? props.children : '' )
    } }/>
}