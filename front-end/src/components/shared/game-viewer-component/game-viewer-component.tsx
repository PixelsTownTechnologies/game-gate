import './game-viewer-component.css';
import React from 'react';
import { Divider as SDivider, Header, Image } from "semantic-ui-react";
import { clamp, costFormat, isFalse, isNull } from "../../../lib/utils/utils";
import { GameCardDTO, GameDTO } from "../../../models/game";
import { useWindow } from "../../../lib/hooks/screen-change";
import { FlexBox, If } from "../../../lib/components/containers";
import { useLanguage } from "../../../lib/hooks/languageHook";
import ConfirmCart from '../../../assets/icons/cart.png';
import { Button, Link } from "../../../lib/components/basic";
import { ROUTES_URL } from "../../../routes";
import { useLoader } from "../../../lib/hooks/generic";

export function ImageCard(props: { logo: any, title: string }) {
    return (
        <div className={ 'card-view' }>
            <div>
                <Image src={ props.logo }/>
            </div>
            <Header className={ 'px-non-margin' } as={ 'h5' }>{ props.title }</Header>
        </div>
    );
}

export function OrderConfirm({pxIf, gameCard, game, quantity, onCancel, onAccept}: {
    pxIf?: boolean,
    gameCard?: GameCardDTO, game?: GameDTO, quantity?: number, onCancel: () => void, onAccept: () => Promise<boolean | null>
}) {
    const {width, type} = useWindow();
    const {words} = useLanguage();
    const [ error, setError ] = React.useState(false);
    const [ success, setSuccess ] = React.useState(false);
    const loader = useLoader();
    if (isFalse(pxIf) || !gameCard || !game || !quantity) {
        return null;
    }
    const isMobile = type === 'Mobile';
    return (
        <div className={ 'order-confirm-box' }>
            <div className={ 'order-confirm-header' }>
                <FlexBox justifyContent={ 'flex-end' } alignItems={ 'center' }>
                    <Button disabled={ loader.isLoading } size={ 'tiny' } basic
                            color={ 'grey' } onClick={ () => onCancel() }
                            iconSetting={ {name: 'times', attachToButton: true} }/>
                </FlexBox>
                <SDivider hidden/>
                <FlexBox flexDirection={ 'column' } alignItems={ 'center' }
                         justifyContent={ 'center' }>
                    <Header as={ 'h1' } className={ 'white' }>{ words.gameViewer.confirmOrder }</Header>
                    <SDivider hidden/>
                    <Image src={ ConfirmCart }/>
                </FlexBox>
            </div>
            <FlexBox
                className={ 'order-confirm-container' }
                flexDirection={ 'row' }
                alignItems={ isMobile ? 'center' : undefined }
                justifyContent={ isMobile ? 'center' : 'space-between' }
                warp
            >
                <div>
                    <ImageCard logo={ game.logo } title={ game.card_name }/>
                </div>
                <FlexBox
                    justifyContent={ isMobile ? 'center' : undefined }
                    alignItems={ isMobile ? 'center' : undefined }
                    warp flexDirection={ 'column' } padding={ 40 }
                >
                    <Header className={ 'state-info' } as={ 'h2' }>{ gameCard.name }</Header>
                    <FlexBox warp flexDirection={ 'column' } justifyContent={ 'flex-start' }>
                        <Header className={ 'state-info' } as={ 'h3' }>
                            { words.gameViewer.selectQuantity }: { quantity }
                        </Header>
                        <Header className={ 'state-info' } as={ 'h3' }>
                            { words.gameViewer.totalPrice }: <span
                            className={ 'gc-price' }>${ costFormat(quantity * gameCard.total_price) }</span>
                        </Header>
                    </FlexBox>
                </FlexBox>
            </FlexBox>
            <FlexBox
                className={ 'order-confirm-bottom' }
                flexDirection={ 'column' }
                alignItems={ 'center' }
                justifyContent={ 'center' }
                padding={ clamp(20, width * 0.1, 60) }
                warp
            >
                <If flag={ success }>
                    <Header as={ 'h3' }>{ words.gameViewer.orderThanksMsg }
                        <Link to={ ROUTES_URL.USER.ORDER_HISTORY }> { words.gameViewer.orderHistory }</Link>
                    </Header>
                </If>
                <If flag={ !success }>
                    <Header as={ 'h3' }>
                        { words.gameViewer.orderMsgOne }
                    </Header>
                </If>
                <SDivider hidden/>
                <If flag={ error }>
                    <Header as={ 'h4' }>
                        { words.gameViewer.failedMsg }
                    </Header>
                </If>
                <Button
                    loading={ loader.isLoading }
                    disabled={ loader.isLoading }
                    onClick={ () => {
                        if (!success) {
                            loader.activate();
                            onAccept().then((d) => {
                                if (isNull(d)) {
                                    loader.disabled();
                                    return;
                                }
                                if (!d) {
                                    setError(true);
                                } else {
                                    setError(false);
                                    setSuccess(true);
                                }
                                loader.disabled();
                            });
                        } else {
                            onCancel();
                        }
                    } }
                    className={ 'confirm-button' }
                    color={ 'orange' }
                    text={ success ? words.basic.ok : words.gameViewer.continue }
                />
            </FlexBox>
        </div>
    );
}