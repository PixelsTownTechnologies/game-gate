import React from 'react';
import WidgetWrapper, { BaseWrapperProps } from "../../lib/components/wrapper/wrapper";
import Menu from "./menu/menu";
import { Loader } from "./base";

export function Wrapper(props: BaseWrapperProps) {
    return <WidgetWrapper { ...props } widgets={
        {
            loader: Loader,
            menu: <Menu/>
        }
    }/>
}