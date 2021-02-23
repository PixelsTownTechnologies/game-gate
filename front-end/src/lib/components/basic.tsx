import React from "react";
import { Button as SButton, Dimmer, Icon, Loader as SLoader, Message, Modal, SemanticCOLORS } from "semantic-ui-react";
import { buildCN, isFalse, pxIf, pxIfSelf } from "../utils/utils";
import { SemanticSIZES } from "semantic-ui-react/dist/commonjs/generic";
import { Link as DLink, Redirect as DRedirect } from 'react-router-dom';
import { BaseComponentProps } from "./components";

export function Loader(props: { show: boolean }) {
    if (!props.show) {
        return null;
    }
    return (
        <Dimmer active>
            <SLoader/>
        </Dimmer>
    );
}

export interface BaseButton extends BaseComponentProps {
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
    if (isFalse(props.show) || isFalse(props.pxIf)) {
        return null;
    }
    return (
        <SButton
            size={ props.size ? props.size : undefined }
            disabled={ props.disabled || props.loading }
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
            className={ buildCN(props.disablePXButton ? '' : 'px-lib', props.className ? props.className : '') }
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

export function RouteButton(props: LinkButton) {
    return (
        <Link to={ props.url }>
            <Button { ...props.buttonSetting } />
        </Link>
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


export interface LinkProps {
    to: string;
    children: any;
    disabled?: boolean;
    className?: string;
}

export function Link(props: LinkProps) {
    return (
        <DLink
            className={ buildCN('px-lib link', props.className ? props.className : '') }
            onClick={ (e) => {
                if (props.disabled) {
                    e.preventDefault();
                }
            } }
            to={ props.to }
        >
            { props.children }
        </DLink>
    )
}

export function Redirect(props: { flag: boolean, url: string }) {
    if (!props.flag) {
        return null;
    }
    return <DRedirect to={ props.url }/>
}

interface ImageProps {
    src: any;
    border?: boolean;
    center?: boolean;
    width?: number;
    color?: string;
    className?: string;
}

export function Image(props: ImageProps) {
    return (
        <div
            style={ {'--imageWidth': `${ props.width }px`} as any }
            className={ buildCN('px-lib image',
                pxIf(props.border, 'image-boarder', ''),
                pxIfSelf(props.color, ''),
                pxIf(props.center, 'center', ''),
                pxIf(props.className, props.className, '')
            ) }
        >
            <img alt={ '' }
                 src={ props.src }
            />
        </div>
    );
}

export const MessageErrors = (props: {
    show: boolean,
    errorHeaderMsg?: string,
    errors?: string[],
    subErrorMsg?: string,
    modal?: boolean,
    onCloseModal?: () => void
}) => {
    if (!props.show) {
        return null;
    }
    if (( !props.errors || props.errors.length < 1 ) && !props.subErrorMsg) {
        return null;
    }
    if (props.modal) {
        return <Modal size={ 'tiny' } open={ true } onClose={ () => {
            if (props.onCloseModal) {
                props.onCloseModal();
            }
        } }>
            {
                props.subErrorMsg ?
                    <Message
                        floating
                        error
                    >{ props.subErrorMsg }</Message>
                    :
                    <Message
                        floating
                        error
                        header={ props.errorHeaderMsg }
                        list={ props.errors }
                    />
            }
        </Modal>
    }
    if (props.subErrorMsg) {
        return <Message
            floating
            error
        >{ props.subErrorMsg }</Message>;
    }
    return <Message
        floating
        error
        header={ props.errorHeaderMsg }
        list={ props.errors }
    />;
}