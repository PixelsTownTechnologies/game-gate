import React from 'react';
import WidgetWrapper, { BaseWrapperProps } from "../../lib/components/wrapper/wrapper";
import Menu2 from "./menu2/menu";
import { Loader } from "./base";

export function Wrapper(props: BaseWrapperProps) {
    return <WidgetWrapper { ...props } widgets={
        {
            loader: Loader,
            menu: <Menu2/>
        }
    }/>
}