import { Button, Divider, Icon, Image, Label } from "semantic-ui-react";
import React, { useState } from "react";
import { GameCardDTO, GameDTO } from "../../../models/game";
import './games-components.css';
import { Link } from "../../../lib/components/basic";
import { URL_ROUTES } from "../../../routes";
import { FlexBox, FlexCenter, If } from "../../../lib/components/containers";
import { buildCN, costFormat, isEmpty } from "../../../lib/utils/utils";
import Logo from '../../../assets/logo/logo-bg-w.jpg';
import { ImageCard } from "../game-viewer-component/game-viewer-component";
import { useWindow } from "../../../lib/hooks/screen-change";
import { DIR } from "../../../lib/utils/constant";
import { useLanguage } from "../../../lib/hooks/languageHook";

export function GameCard(props: { gameCard?: GameCardDTO, game: GameDTO }) {
    const style = props.game.bg_card ? {'--headerBGImageURL': `url(${ props.game.bg_card })`} : {};
    return (
        <Link to={ URL_ROUTES.GAME_VIEWER + '/' + props.game.id + ( props.gameCard ? `/${ props.gameCard.id }` : '' ) }>
            <div className={ 'vvg vvg-container' }>
                <div style={ style as any } className={ 'vvg-header-container' }>
                    <div className={ 'vvg-index vvg-logo' }>
                        <Image src={ props.game.logo ? props.game.logo : Logo }/>
                    </div>
                    <div className={ 'vvg-index vvg-name' }>
                        <h5 className={ 'text-w px-non-margin' }>{ props.gameCard?.name ? props.gameCard.name : props.game.name }</h5>
                    </div>
                </div>
                <If flag={ !!props.gameCard }>
                    <div className={ 'vvg-price-container' }>
                        <div className={ 'price-discount-s' }>
                            <h5 className={ buildCN(!!props.gameCard?.discount ? 'line-price' : null, 'text-b px-non-margin') }>
                                ${ costFormat(props.gameCard ? props.gameCard.price : 0) }
                            </h5>
                            <If flag={ !!props.gameCard?.discount }>
                                <h5 className={ 'text-b px-non-margin' }> ${ costFormat(props.gameCard ? props.gameCard.total_price : 0) } </h5>
                            </If>
                        </div>
                        <div>
                            <If flag={ !!props.gameCard?.discount }>
                                <Label className={ 'text-w game-discount-l' } color='purple' tag>
                                    -{ props.gameCard?.discount }%
                                </Label>
                            </If>
                        </div>
                    </div>
                </If>
            </div>
        </Link>
    );
}


export function GameCardBig(props: { gameCard?: GameCardDTO, game: GameDTO }) {
    //const style = props.game.bg_card ? {'--headerBGImageURL': `url(${ props.game.bg_card })`} : {};
    return (
        <Link to={ URL_ROUTES.GAME_VIEWER + '/' + props.game.id + ( props.gameCard ? `/${ props.gameCard.id }` : '' ) }>
            <div className={ 'gcv-container' }>
                <ImageCard
                    className={ 'gcv-card-box' }
                    logo={ props.game.logo ? props.game.logo : Logo }
                    title={ props.game.card_name }
                />
                <div className={ 'gcv-name-box' }>
                    <h5 className={ 'text-b px-non-margin' }>{ props.gameCard?.name ? props.gameCard.name : props.game.name }</h5>
                </div>
            </div>
        </Link>
    );
}


export function ScrollCardView(props: { list?: any[], title?: string, description?: string }) {
    const sectionRef = React.useRef<HTMLDivElement>(null);
    const [ scrollX, setScrollX ] = useState(0);
    const {isMobile} = useWindow();
    const language = useLanguage();
    const ScrollConstant = 120;
    if(isEmpty(props.list)){
        return null;
    }
    return (
        <div className={ 'scroll-card-view-box' }>
            <FlexBox dir={language.dir} flexDirection={ 'column' }
                     justifyContent={ !isMobile ? 'flex-start' : 'center' }
                     alignItems={ isMobile ? 'center' : undefined }>
                <h1 className={ 'grey-text' }> {props.title ? props.title : ''} </h1>
                <h4 className={ 'grey-text px-non-margin' }> {props.description ? props.description : ''} </h4>
            </FlexBox>
            <Divider hidden/>
            <div dir={DIR.LTR} ref={ sectionRef } className={ 'scroll-card-view-container' }>
                {
                    props.list
                }
            </div>
            <FlexCenter className={ 'cv-button-box' }>
                <div/>
                <Divider horizontal>
                    <Button.Group basic size='small' className={ 'cv-scroll-button' }>
                        <Button
                            className={ 'px-lib' } color={ 'orange' } icon
                            onClick={
                                () => {
                                    if (sectionRef.current) {
                                        sectionRef.current.scroll(( scrollX - ScrollConstant ) < 0 ? 0 : ( scrollX - ScrollConstant ), 0)
                                        setScrollX(( scrollX - ScrollConstant ) < 0 ? 0 : ( scrollX - ScrollConstant ));
                                    }
                                }
                            }>
                            <Icon name='angle left'/>
                        </Button>
                        <Button
                            className={ 'px-lib' } color={ 'orange' } icon
                            onClick={
                                () => {
                                    if (sectionRef.current) {
                                        const newScrollX = ( scrollX + ScrollConstant ) > sectionRef.current.scrollWidth - sectionRef.current.offsetWidth
                                            ? sectionRef.current.scrollWidth - sectionRef.current.offsetWidth : ( scrollX + ScrollConstant );

                                        sectionRef.current.scroll(newScrollX, 0);
                                        setScrollX(newScrollX);
                                    }
                                }
                            }>
                            <Icon name='angle right'/>
                        </Button>
                    </Button.Group>
                </Divider>
            </FlexCenter>
        </div>
    );
}