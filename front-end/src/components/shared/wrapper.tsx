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
                <div>
                    <RouteButton buttonSetting={ {
                        text: 'Go To Test'
                    } } url={ ROUTES_URL.TEST }/>
                    <RouteButton buttonSetting={ {
                        text: 'Go To Login'
                    } } url={ ROUTES_URL.USER.AUTH.LOGIN }/>
                    <IconButton name={ 'moon' } onClick={ () => ThemeService.loadTheme('dark') }/>
                    <IconButton name={ 'sun' } circular onClick={ () => ThemeService.loadTheme('light') }/>
                    { LanguageService.getComponent() }
                </div>
            )
        }
    }/>
}