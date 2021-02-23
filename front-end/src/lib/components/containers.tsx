import React from "react";
import { buildCN, isEmpty, isFalse, pxIf, pxIfSelf } from "../utils/utils";
import { DIR } from "../utils/constant";
import { BaseComponentProps } from "./components";
import { Header, Segment } from "semantic-ui-react";

interface FlexBoxProps extends BaseComponentProps {
    flexDirection?: 'column' | 'row';
    className?: string;
    dir?: string;
    padding?: number;
    width?: number;
    style?: any;
}

interface BaseFlexBox extends FlexBoxProps {
    justifyContent?: 'flex-start' | 'flex-end' | 'space-between' | 'center';
    alignItems?: 'center';
    warp?: boolean;
}

interface PaddingBoxProps extends BaseComponentProps {
    size: number;
    className?: string;
}

interface MarginBoxProps extends BaseComponentProps {
    size: number;
}


export const FlexBox = (props: BaseFlexBox) => {
    if (isFalse(props.pxIf)) {
        return null;
    }
    let style = isEmpty(props.style) ? {} : props.style;
    if (props.padding) {
        style = {...style, padding: props.padding};
    }
    if (props.width) {
        style = {...style, width: props.width};
    }
    return (
        <div dir={ props.dir ? props.dir : DIR.AUTO }
             className={ buildCN(props.className ? props.className : '',
                 'px-lib', 'flex',
                 props.justifyContent ? `justify-${ props.justifyContent }` : '',
                 props.alignItems ? `align-items-${ props.alignItems }` : '',
                 props.flexDirection ? `flex-direction-${ props.flexDirection }` : '',
                 props.warp ? 'flex-warp' : '') }
             style={ style }>
            { props.children }
        </div>
    );
}

export const FlexSpace = (props: FlexBoxProps) => {
    return (
        <FlexBox pxIf={ props.pxIf } padding={ props.padding } className={ props.className } warp dir={ props.dir }
                 justifyContent={ 'space-between' }
                 alignItems={ 'center' }>
            { props.children }
        </FlexBox>
    );
}

export const FlexCenter = (props: FlexBoxProps) => {
    return (
        <FlexBox pxIf={ props.pxIf } padding={ props.padding } className={ props.className } warp dir={ props.dir }
                 justifyContent={ 'center' } flexDirection={ props.flexDirection }
                 alignItems={ 'center' }>
            { props.children }
        </FlexBox>
    );
}

export const PaddingBox = (props: PaddingBoxProps) => {
    return (
        <div style={ {padding: props.size} } className={ props.className ? props.className : '' }>
            { props.children }
        </div>
    );
}

export const MarginBox = (props: MarginBoxProps) => {
    if (isFalse(props.pxIf)) {
        return null;
    }
    return (
        <div style={ {margin: props.size} }>
            { props.children }
        </div>
    );
}

export const Empty = (props: { children: any }) => {
    return props.children;
}

export const Space = (props: { count?: number }): any => {
    if (!props.count) {
        return <Empty>&nbsp;</Empty>;
    }
    let result = '';
    for (let i = 0; i < props.count; i++) {
        result += '&nbsp;';
    }
    return <span dangerouslySetInnerHTML={ {__html: result} }/>;
}

export const Map = (props: { list?: any[] | null, keyField?: string, mapper: (row: any, key: string) => JSX.Element | null }): JSX.Element | null => {
    if (!props.list) {
        return null;
    }
    return props.list.map((row, index) => {
        return props.mapper(row, props.keyField ? row[props.keyField] : `key_${ index }`) as any;
    }) as any;
}

export const If = (props: { children?: any, flag: any }): JSX.Element | null => {
    return isEmpty(props.flag) || !props.children ? null : props.children;
}

export function Divider(props: { color?: string, className?: string }) {
    return (
        <div className={ buildCN('px-divider', pxIfSelf(props.color, ''), pxIfSelf(props.className, '')) }/>
    )
}

export interface SegmentDTO extends BaseComponentProps {
    dir?: string;
    className?: string;
    raised?: boolean;
    stacked?: boolean;
    nonBoard?: boolean;
    header?: string;
    minWidth?: number;
}

export function SegmentBox(props: SegmentDTO) {
    if (isFalse(props.pxIf)) {
        return null;
    }
    return (
        <div style={ props.minWidth ? {minWidth: props.minWidth} : {} }>
            <If flag={ props.header }>

                <Header className={ 'seg-header' } as='h4' dir={ pxIf(props.dir, props.dir, DIR.AUTO) } attached>
                    <FlexCenter>
                        { props.header }
                    </FlexCenter>
                </Header>
            </If>
            <Segment style={ props.minWidth ? {
                paddingLeft: Math.floor(0.2 * props.minWidth)
                , paddingRight: Math.floor(0.2 * props.minWidth),
                paddingTop: Math.floor(0.08 * props.minWidth),
                paddingBottom: Math.floor(0.08 * props.minWidth)
            } : {} }
                     attached={ !!props.header } className={ buildCN('px-lib', pxIfSelf(props.className, ''),
                pxIf(props.nonBoard, 'non-boarder', '')) }
                     raised={ props.raised } stacked={ props.stacked }>
                { props.children }
            </Segment>
        </div>
    );
}
