import React from 'react';
import WidgetWrapper, { BasePageWrapperProps } from "../../lib/components/page-wrapper/page-wrapper";
import { Loader } from "semantic-ui-react";

export function Wrapper(props: BasePageWrapperProps) {
    return <WidgetWrapper { ...props } widgets={
        {
            footer: null,
            loader: Loader,
            menu: null
        }
    }/>
}