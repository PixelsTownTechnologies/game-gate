import React, { useState } from 'react';
import { BaseComponent, BaseComponentProps, BaseComponentState } from "../../../lib/components/components";
import './menu.css';
import { FlexBox, FlexCenter, FlexSpace, If, Space } from "../../../lib/components/containers";
import WindowService from "../../../lib/services/window.service";
import { Link } from "../../../lib/components/basic";
import { Logo } from "../base";
import Avatar from '../../../assets/icons/avatar.png';
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
                    } } className={ 'search-input' } icon='search'/>
                </Dimmer>
            ]
        );
    }
    return (
        <Input onChange={ (e) => setSearchValue(e.target.value) } onKeyPress={ (e: any) => {
            if (e.key === 'Enter') {
                props.onSearch(searchValue);
            }
        } } className={ 'search-input' } icon='search'/>
    );
}

export interface MenuProps extends BaseComponentProps {
    user: UserBaseDTO;
}

export interface MenuState extends BaseComponentState {
    type: string;
}

class Menu extends BaseComponent<MenuProps, MenuState> {

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
            <FlexBox alignItems={ 'center' } className={ 'px menu' }>
                <FlexSpace className={ 'section1' }>
                    <FlexCenter>
                        <Link to={ ROUTES_URL.HOME }>
                            <Logo size={ 'tiny' }/>
                        </Link>
                    </FlexCenter>
                </FlexSpace>
                <FlexSpace className={ 'section2' }>
                    <FlexBox justifyContent={ 'flex-start' }>
                        { this.showSection2() }
                    </FlexBox>
                </FlexSpace>
                <FlexBox alignItems={ 'center' } justifyContent={ 'flex-end' } className={ 'section3' }>
                    <FlexBox alignItems={ 'center' }>
                        <MenuSearch onSearch={ (value) => {
                            console.log(value)
                        } }/>
                        <Dropdown
                            item
                            simple
                            direction={ 'right' }
                            trigger={ <Image className={ 'profile-icon' }
                                             width={ 'tiny' } src={ Avatar }/> }
                        >
                            <Dropdown.Menu>
                                <If flag={ isUserAuthenticate() }>
                                    <Dropdown.Item className={ 'menu-header' }>
                                        <Image src={ Profile }/>
                                        <Divider hidden/>
                                        <Header className={ 'px-non-margin' }
                                                as={ 'h3' }>{ this.props.user.username }</Header>
                                        <Header className={ 'px-non-margin' }
                                                as={ 'h5' }>${ costFormat(this.props.user.balance) }</Header>
                                    </Dropdown.Item>
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
                                </If>
                                <If flag={ !isUserAuthenticate() }>
                                    <FlexCenter flexDirection={ 'column' } padding={ 20 } className={ 'auth-r-menu' }>
                                        <Logo size={ 'tiny' }/>
                                        <Header as={ 'h4' }>Welcome to { this.word().appName }</Header>
                                        <Button.Group className={ 'buttons' }>
                                            <Link to={ ROUTES_URL.USER.AUTH.REGISTER }>
                                                <Button content={ this.word().authPages.register }/>
                                            </Link>
                                            <Link to={ ROUTES_URL.USER.AUTH.LOGIN }>
                                                <Button content={ this.word().authPages.signIn }/>
                                            </Link>
                                        </Button.Group>
                                    </FlexCenter>
                                </If>
                            </Dropdown.Menu>
                        </Dropdown>
                    </FlexBox>
                </FlexBox>
            </FlexBox>
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
                                   className={ 'menu-item' }> { this.getWordFromTextField(route.menuSetting?.text) } </div> }
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
                        <Button color={ 'brown' } className={ 'mobile-button' } icon={ 'bars' }/>
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
})(Menu as any);