import React from 'react';
import WidgetWrapper, { BaseWrapperProps } from "../../lib/components/wrapper/wrapper";
import Menu2 from "./menu2/menu";
import Footer from './footer/footer';
import { Loader } from "./base";
import { SubMenu } from "./sub-menu/sub-menu";
import { AdsDialog } from "./ads/ads";

export function Wrapper(props: BaseWrapperProps) {
    return <WidgetWrapper { ...props } widgets={
        {
            loader: Loader,
            menu: <Menu2/>,
            subMenu: SubMenu,
            extra: (
                <AdsDialog/>
            ),
            footer: <Footer/>
        }
    }/>
}