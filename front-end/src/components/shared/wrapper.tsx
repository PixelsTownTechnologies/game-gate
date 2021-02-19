import React from 'react';
import WidgetWrapper, { BaseWrapperProps } from "../../lib/components/wrapper/wrapper";
import { ROUTES_URL } from "../../routes";
import { IconButton, Loader, RouteButton } from "../../lib/components/basic";
import ThemeService from "../../lib/services/theme-service";
import LanguageService from "../../lib/services/language-service";

export function Wrapper(props: BaseWrapperProps) {
    return <WidgetWrapper { ...props } widgets={
        {
            loader: Loader,
            menu: (
                <div style={{background: '#555555'}}>
                    <RouteButton buttonSetting={ {
                        text: 'Profile'
                    } } url={ ROUTES_URL.USER.PROFILE }/>
                    <RouteButton buttonSetting={ {
                        text: 'test'
                    } } url={ ROUTES_URL.TEST }/>
                    <RouteButton buttonSetting={ {
                        text: 'Login'
                    } } url={ ROUTES_URL.USER.AUTH.LOGIN }/>
                    <IconButton name={ 'moon' } onClick={ () => ThemeService.loadTheme('dark') }/>
                    <IconButton name={ 'sun' } circular onClick={ () => ThemeService.loadTheme('light') }/>
                </div>
            )
        }
    }/>
}