import './home.css';
import './glitch-effect.css';
import { Wrapper } from "../../../shared/wrapper";
import React, { useEffect, useState } from 'react';
import { Divider, Header, Image, Input } from "semantic-ui-react";
import AppLogo from "../../../../assets/logo/logo.png";
import { FlexBox, If } from "../../../../lib/components/containers";
import { useWindow } from "../../../../lib/hooks/screen-change";
import { EntityService } from "../../../../lib/services/entity-service/entity-service";
import { gameService, homeService } from "../../../../services/service-config";
import { GameCardDTO, GameDTO } from "../../../../models/game";
import { GameCard, GameCardBig, ScrollCardView } from "../../../shared/games-components/games-components";
import { DIR } from "../../../../lib/utils/constant";
import { HomeDetails, HomeDTO } from "../../../../models/home-details";
import { useLoader } from "../../../../lib/hooks/generic";
import { useLanguage } from "../../../../lib/hooks/languageHook";
import { endPoint } from "../../../../constant";
import { isEmpty } from "../../../../lib/utils/utils";

function HomeSection2(props: {
    isMobile: boolean, list?: GameCardDTO[], dir: string,
    maxSpecialView: number, title?: string, description?: string
}) {
    if (!props.list) {
        return null;
    }
    return (
        <div className={ 'home-section2' }>
            <FlexBox dir={ props.dir } className={ 'home-h1' } flexDirection={ 'column' }
                     justifyContent={ !props.isMobile ? 'flex-start' : 'center' }
                     alignItems={ props.isMobile ? 'center' : undefined }>
                <h1 className={ 'grey-text' }> { props.title ? props.title : '' } </h1>
                <h4 className={ 'grey-text px-non-margin' }>{ props.description ? props.description : '' }</h4>
            </FlexBox>
            <Divider hidden/>
            <FlexBox warp justifyContent={ !props.isMobile ? 'flex-start' : 'center' }
                     alignItems={ 'center' }>
                {
                    props.list ? props.list.slice(0, props.maxSpecialView).map((gameCard, index) => {
                        return (
                            <GameCard gameCard={ gameCard } game={ gameCard.game as GameDTO }
                                      key={ index }/>
                        );
                    }) : null
                }
            </FlexBox>
        </div>
    );
}


export function HomeWidget() {
    const {width, type} = useWindow();
    const [ list, setList ] = useState<GameDTO[]>([]);
    const language = useLanguage();
    const [ isHomeLoading, setHomeLoading ] = useState<boolean>(false);
    const [ homeConfig, setHomeConfig ] = useState<HomeDetails | null>(null);
    const languageFlag = language.language.flag;
    const loader = useLoader();
    new EntityService<GameDTO>(gameService).find().then(data => {
        setList(data as GameDTO[]);
    })
    const isMobile = type === 'Mobile';
    useEffect(() => {
        if (!loader.isLoading && !isHomeLoading) {
            loader.activate();
            new EntityService(homeService).find().then((data) => {
                const homeData: HomeDTO = data as any;
                const games = ( homeData?.games ? homeData.games : [] ).map(g => {
                    return {
                        ...g,
                        logo: (
                            !isEmpty(g.logo)
                                ? (
                                    g.logo.includes('http')
                                        ? g.logo : `${ endPoint.dev }${ g.logo.slice(1, g.logo.length) }`
                                ) : null
                        ),
                        bg_card: (
                            !isEmpty(g.bg_card)
                                ? (
                                    g.bg_card.includes('http')
                                        ? g.bg_card : `${ endPoint.dev }${ g.bg_card.slice(1, g.bg_card.length) }`
                                ) : null
                        ),
                        bg_cover: (
                            !isEmpty(g.bg_cover)
                                ? (
                                    g.bg_cover.includes('http')
                                        ? g.bg_cover : `${ endPoint.dev }${ g.bg_cover.slice(1, g.bg_cover.length) }`
                                ) : null
                        ),
                    } as GameDTO;
                });
                const gameCards = ( homeData?.gameCards ? homeData?.gameCards : [] ).map(gc => {
                    return {...gc, game: games.filter(g => g.id === gc.game)?.[0]}
                }).filter(g => !!g.game);
                let homeConfigEnum: HomeDetails = homeData?.enums?.filter(e => e.name === 'Home Config')?.[0]?.values as any;
                homeConfigEnum = homeConfigEnum ? JSON.parse(homeConfigEnum as any) : null;
                if (homeConfigEnum) {
                    if (homeConfigEnum.specialDeals && homeConfigEnum.specialDeals.games) {
                        homeConfigEnum.specialDeals.games = ( homeConfigEnum.specialDeals.games as number[] )
                            .map((gameID) => games?.filter(g => g.id === gameID)?.[0]).filter(r => !!r);
                    }
                    if (homeConfigEnum.specialDeals && homeConfigEnum.specialDeals.gameCards) {
                        homeConfigEnum.specialDeals.gameCards = ( homeConfigEnum.specialDeals.gameCards as number[] )
                            .map((gameID) => gameCards?.filter(g => g.id === gameID)?.[0]).filter(r => !!r);
                    }
                    if (homeConfigEnum?.sections) {
                        homeConfigEnum.sections.forEach(sec => {
                            if (sec.games) {
                                sec.games = ( sec.games as number[] )
                                    .map((gameID) => gameCards?.filter(g => g.id === gameID)?.[0]).filter(r => !!r) as any;
                            }
                            if (sec.gameCards) {
                                sec.gameCards = ( sec.gameCards as number[] )
                                    .map((gameID) => gameCards?.filter(g => g.id === gameID)?.[0]).filter(r => !!r) as any;
                            }
                        })
                    }
                }
                setHomeConfig(homeConfigEnum);
                setHomeLoading(true);
                loader.disabled();
            })
        }
    });
    return (
        <Wrapper loading={ loader.isLoading } className={ 'home home-bg' } hideTitle hideContainer>
            <div className={ 'home-logo-box' }>
                <div dir={ DIR.LTR }>
                    <div className={ 'z_ind border-logo' }/>
                    <div className={ 'z_ind border-logo2' }/>
                    <Image src={ AppLogo } className={ 'z_ind app-name-logo' }/>
                    <FlexBox justifyContent={ isMobile ? 'center' : 'flex-start' } flexDirection={ 'column' }
                             alignItems={ isMobile ? 'center' : undefined } className={ 'z_ind home-logo-text' }>
                        <div className={ 'z_ind app-header-name' }>
                            <Header className={ 'glitch' } data-text='GAMERS DZ'>
                                <span aria-hidden="true">GAMERS DZ</span>
                                GAMERS DZ
                                <span aria-hidden="true">GAMERS DZ</span>
                            </Header>
                        </div>
                        <Divider hidden/>
                        <If flag={ !isMobile }>
                            <Divider hidden/>
                        </If>
                        <h1 className={ 'z_ind app-sub-header' }>
                            { ( homeConfig?.mainText as any )?.[languageFlag] }
                        </h1>
                        <Divider hidden/>
                        <If flag={ type === 'Computer' }>
                            <Divider hidden/>
                            <Input onChange={ (e) => {
                            } } onKeyPress={ (e: any) => {
                                if (e.key === 'Enter') {
                                }
                            } } className={ 'z_ind home-search-input' } icon='search'/>

                        </If>
                    </FlexBox>
                </div>
            </div>
            <If flag={ homeConfig }>
                <HomeSection2 dir={ language.dir } isMobile={ isMobile } maxSpecialView={ 250 }
                              title={ ( homeConfig?.specialDeals?.title as any )?.[languageFlag] }
                              description={ ( homeConfig?.specialDeals?.description as any )?.[languageFlag] as any }
                              list={ homeConfig?.specialDeals.gameCards as GameCardDTO[] }/>
                <div className={ 'home-view-section' }>
                    {
                        homeConfig?.sections.map((s, key) => {
                            return (
                                <div key={ key }>
                                    <ScrollCardView description={ ( s.description as any )?.[languageFlag] }
                                                    title={ ( s.title as any )?.[languageFlag] } list={ [
                                        ...( s?.games as GameDTO[] )?.map(g => {
                                            return (
                                                <GameCardBig key={ `game_${ g.id }` } game={ g as GameDTO }/>
                                            )
                                        }),
                                        ...( s?.gameCards as GameCardDTO[] )?.map(g => {
                                            return (
                                                <GameCardBig key={ `gameCard_${ g.id }` } game={ g.game as GameDTO }
                                                             gameCard={ g as GameCardDTO }/>
                                            )
                                        }),
                                    ]
                                    }/>
                                </div>
                            );
                        })
                    }
                </div>
            </If>
            <Divider hidden/>
            <Divider hidden/>
            <Divider hidden/>
            <Divider hidden/>
        </Wrapper>
    );
}