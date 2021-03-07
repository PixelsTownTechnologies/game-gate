import React, { useState } from 'react';
import { BaseComponent, BaseComponentProps, BaseComponentState } from "../../../lib/components/components";
import './menu.css';
import { FlexBox, FlexCenter, FlexSpace, If, Space } from "../../../lib/components/containers";
import WindowService from "../../../lib/services/window.service";
import { Link } from "../../../lib/components/basic";
import { Logo } from "../base";
// @ts-ignore
import Avatar from '../../../assets/icons/avatar.png';
// @ts-ignore
import Profile from '../../../assets/icons/profile.png';
import { ROUTES_URL } from "../../../routes";
import { Button, Dimmer, Divider, Dropdown, Header, Icon, Image, Input, Segment } from "semantic-ui-react";
import { useWindow } from "../../../lib/hooks/screen-change";
import { useLanguage } from "../../../lib/hooks/languageHook";
import { getFilterRouters, getRoutes, isUserAuthenticate } from "../../../lib/utils/application-helper";
import { connect } from "react-redux";
import { StoreState } from "../../../lib/models/application";
import { UserBaseDTO } from "../../../lib/models/user";
import { costFormat } from "../../../lib/utils/utils";

function MenuSearch(props: { onSearch: (value: string) => void }): any {
    const {type} = useWindow();
    const {words} = useLanguage();
    const [ open, setOpen ] = useState(false);
    const [ searchValue, setSearchValue ] = useState('');
    if (type === 'Mobile') {
        return (
            [
                <Icon className={ 'search-icon' } onClick={ () => setOpen(true) } key={ 1 } name={ 'search' }/>
                ,
                <Dimmer className={ 'px-non-margin' } page key={ 2 } onClickOutside={ () => setOpen(false) }
                        as={ Segment } active={ open }>
                    <Header className={ 'white' }>{ words.messages.menu.lookingHelp }</Header>
                    <Input onChange={ (e) => setSearchValue(e.target.value) } onKeyPress={ (e: any) => {
                        if (e.key === 'Enter') {
                            props.onSearch(searchValue);
                            setOpen(false);
                        }
                    } } className={ 'm-search-input' } icon='search'/>
                </Dimmer>
            ]
        );
    }
    return (
        <Input onChange={ (e) => setSearchValue(e.target.value) } onKeyPress={ (e: any) => {
            if (e.key === 'Enter') {
                props.onSearch(searchValue);
            }
        } } className={ 'm-search-input' } icon='search'/>
    );
}

export interface MenuProps extends BaseComponentProps {
    user: UserBaseDTO;
}

export interface MenuState extends BaseComponentState {
    type: string;
}

class Menu2 extends BaseComponent<MenuProps, MenuState> {

    windowId?: number;

    constructor(props: MenuProps) {
        super(props);
        this.state = {
            ...this.state,
            type: WindowService.getSetting().type
        };
    }

    destroy(): void {
    }

    initialize(): void {
        WindowService.subscribe((value) => {
            this.setState({type: value.type});
        });
    }

    getRoutesRight = () => {
        return getFilterRouters(getRoutes()).filter(r => r.menuSetting?.direction === 'right');
    }

    getRoutesLeft = () => {
        return getFilterRouters(getRoutes()).filter(r => r.menuSetting?.direction !== 'right');
    }

    getWordFromTextField = (field?: string) => {
        if (!field) {
            return 'No Title';
        }
        const fieldList = field.split('.');
        let words = this.word() as any;
        fieldList.forEach(f => {
            words = words[f];
        });
        return words;
    }

    show(props: MenuProps, state: MenuState): JSX.Element | null {
        return (
            <FlexBox flexDirection={ 'column' } alignItems={ 'center' } className={ 'px menu' }>
                <FlexSpace className={ 'section1' }>
                    <Link to={ ROUTES_URL.HOME }>
                        <Header className={ 'm-app-name' }>
                            GAMERS DZ
                        </Header>
                    </Link>
                    <MenuSearch onSearch={ () => {
                    } }/>
                </FlexSpace>
                <FlexSpace className={ 'stackable  section2' }>
                    <FlexSpace className={ 'items-menu' }>
                        { this.showSection2() }
                    </FlexSpace>
                    <div className={ 'user-section' }>
                        { this.showUserMenu() }
                    </div>
                </FlexSpace>
            </FlexBox>
        );
    }

    showUserMenu = () => {
        return (
            <Dropdown
                item
                simple
                direction={ 'right' }
                className={!isUserAuthenticate() ? 'auth-r-menu' : ''}
                trigger={
                    <div className={ 'profile-icon' }>
                        <Image
                            width={ 'tiny' } src={ Avatar }/>
                        <FlexBox flexDirection={ 'column' } justifyContent={ 'flex-start' }
                                 pxIf={ this.state.type === 'Computer' && isUserAuthenticate() }>
                            <Header className={ 'global-f px-non-margin' }
                                    as={ 'h5' }>{ this.props.user.username }</Header>
                            <Header className={ 'global-f px-non-margin' }
                                    as={ 'h6' }>${ costFormat(this.props.user.balance) }</Header>
                        </FlexBox>
                    </div>
                }
            >
                <Dropdown.Menu>
                    <If flag={ isUserAuthenticate() }>
                        <Dropdown.Item className={ 'u-menu-header' }>
                            <Image size={ 'large' } src={ Profile }/>
                            <Divider hidden/>
                            <Header className={ 'global-f px-non-margin' }
                                    as={ 'h3' }>{ this.props.user.username }</Header>
                            <Header className={ 'global-f px-non-margin' }
                                    as={ 'h5' }>${ costFormat(this.props.user.balance) }</Header>
                        </Dropdown.Item>
                        <div>
                            {
                                this.getRoutesRight()?.[0].subRoutes?.map((route, index) => {
                                    return (
                                        <Link
                                            to={ route.path ? route.path : '' }
                                            key={ index }
                                        >
                                            <Dropdown.Item>
                                                <div
                                                    onClick={ () => {
                                                        route.menuSetting?.onClick?.();
                                                    } }
                                                    dir={ this.state.direction }
                                                    className={ 'menu-item' }
                                                >
                                                    <If flag={ route.menuSetting?.icon }>
                                                        <Space count={ 1 }/>
                                                        <Icon name={ route.menuSetting?.icon as any }/>
                                                        <Space count={ 1 }/>
                                                    </If>
                                                    <span>{ this.getWordFromTextField(route.menuSetting?.text) }</span>
                                                </div>
                                            </Dropdown.Item>
                                        </Link>
                                    );
                                })
                            }
                        </div>
                    </If>
                    <If flag={ !isUserAuthenticate() }>
                        <FlexCenter flexDirection={ 'column' } padding={ 20 }>
                            <Logo size={ 'tiny' }/>
                            <Header
                                as={ 'h4' }>{ this.word().authPages.welcomeMsg } { this.word().appName }</Header>
                            <Button.Group className={ 'buttons' }>
                                <Link to={ ROUTES_URL.USER.AUTH.REGISTER }>
                                    <Button content={ this.word().authPages.signUp }/>
                                </Link>
                                <Link to={ ROUTES_URL.USER.AUTH.LOGIN }>
                                    <Button content={ this.word().authPages.signIn }/>
                                </Link>
                            </Button.Group>
                        </FlexCenter>
                    </If>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    showSection2 = () => {
        const list = [] as any[];
        this.getRoutesLeft().filter(r => !!r.menuSetting).forEach(route => {
            list.push(
                <Dropdown
                    key={ list.length + 1 }
                    item
                    simple
                    trigger={ <div dir={ this.state.direction }
                                   className={ 'dp menu-item' }> { this.getWordFromTextField(route.menuSetting?.text) } </div> }
                >
                    <Dropdown.Menu>
                        {
                            route.subRoutes?.map((subRoute, index) => {
                                return (
                                    <Link to={ subRoute.path } key={ index }>
                                        <Dropdown.Item>
                                            <div
                                                dir={ this.state.direction }
                                                className={ 'menu-item' }
                                            >
                                                <If flag={ subRoute.menuSetting?.icon }>
                                                    <Space count={ 1 }/>
                                                    <Icon name={ subRoute.menuSetting?.icon as any }/>
                                                    <Space count={ 1 }/>
                                                </If>
                                                <span>{ this.getWordFromTextField(subRoute.menuSetting?.text) }</span>
                                            </div>
                                        </Dropdown.Item>
                                    </Link>
                                );
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            );
        });
        if (this.state.type === 'Mobile') {
            return (
                <Dropdown
                    item
                    simple
                    trigger={
                        <Button className={ 'mobile-button' } icon={ 'bars' }/>
                    }
                >
                    <Dropdown.Menu>
                        { list }
                    </Dropdown.Menu>
                </Dropdown>
            )
        }
        return list;
    }

}

export default connect((state: StoreState, ownProps) => {
    return {...ownProps, user: state.user};
})(Menu2 as any);