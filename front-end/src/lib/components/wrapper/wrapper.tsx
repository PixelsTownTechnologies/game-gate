import React from 'react';
import '../../assets/custome/wrapper.css';
import { Loader } from "../basic";
import { buildCN, pxIf, pxIfSelf } from "../../utils/utils";
import { Divider, FlexBox, If } from "../containers";
import { Header } from "semantic-ui-react";
import { BaseComponent, BaseComponentMethods, BaseComponentProps, BaseComponentState } from "../components";

export interface BaseWrapperProps extends BaseComponentProps {
    loading?: boolean;
    className?: string;
    scrollTopLoaderCB?: (scrollTop: () => void) => void;
    showMenuInContainer?: boolean;
    hideMenu?: boolean;
    hideFooter?: boolean;
    hideContainer?: boolean;

    hideTitle?: boolean;

    title?: string;
    subTitleChildren?: JSX.Element | null;
    containerCName?: string;
    fitContainer?: boolean;
}

export interface WidgetWrapperProps extends BaseWrapperProps {
    widgets: {
        menu?: JSX.Element;
        footer?: JSX.Element;
        titleSectionView?: React.ComponentType<{ title: string, children?: JSX.Element }>;
        loader?: React.ComponentType<any>;
    }
}


class WidgetWrapper extends BaseComponent<WidgetWrapperProps, BaseComponentState>
    implements BaseComponentMethods<WidgetWrapperProps, BaseComponentState> {

    element: any;

    constructor(props: WidgetWrapperProps) {
        super(props);
        if (this.props.scrollTopLoaderCB) {
            this.props.scrollTopLoaderCB(this.scrollToTop);
        }
    }

    initialize = () => {
        setTimeout(() => {
            this.scrollToTop();
        }, 200);
    };

    destroy = () => {

    };

    scrollToTop = () => {
        setTimeout(() => {
            if (this.element) {
                this.element.scrollIntoView({behavior: "smooth"});
            }
        }, 50);

    }

    renderMenu = () => {
        return pxIf(!this.props.hideMenu && this.props.widgets.menu, this.props.widgets.menu, null);
    }

    renderFooter = () => {
        return pxIf(!this.props.hideFooter && this.props.widgets.footer, this.props.widgets.footer, null);
    }

    renderLoader = () => {
        if (this.props.loading) {
            window.scrollTo(0, 0);
            if (this.props.widgets && this.props.widgets.loader) {
                const LoaderComponent = this.props.widgets.loader;
                return <LoaderComponent show={ this.props.loading }/>;
            } else {
                return (
                    <Loader show={ this.props.loading }/>
                );
            }
        }
        return null;
    }

    renderTitleSection = () => {
        if (!this.props.hideTitle) {
            if (this.props.widgets.titleSectionView) {
                const TitleSectionViewWidget = this.props.widgets.titleSectionView;
                return (
                    <TitleSectionViewWidget
                        title={ pxIfSelf(this.props.title, 'No Title') as string }>
                        { }
                    </TitleSectionViewWidget>
                )
            }
            return (
                <FlexBox dir={this.state.direction} flexDirection={'column'} >
                    <FlexBox dir={ this.state.direction } justifyContent={ 'space-between' } alignItems={ 'center' }>
                        <Header as={ 'h1' }>{ pxIfSelf(this.props.title, 'No Title') as string }</Header>
                        <If flag={ this.props.subTitleChildren }>
                            <div dir={ this.state.direction }>
                                { this.props.subTitleChildren }
                            </div>
                        </If>
                    </FlexBox>
                    <Divider/>
                </FlexBox>
            );
        }
    }

    show(props: WidgetWrapperProps, state: BaseComponentState) {
        return (
            <div
                dir={ this.state.direction }
                ref={ (el) => {
                    this.element = el;
                } }
                className={ buildCN('px-lib wrapper', pxIfSelf(props.className, '')) }
            >
                { this.renderLoader() }
                <If flag={ !props.showMenuInContainer }>
                    { this.renderMenu() }
                </If>
                <div dir={ this.state.direction } className={ buildCN('px-lib', props.hideContainer ?  '': 'px-container',
                    pxIf(props.fitContainer, 'fit', ''),
                    pxIfSelf(props.containerCName, '')) }>
                    <If flag={ props.showMenuInContainer }>
                        { this.renderMenu() }
                    </If>
                    { this.renderTitleSection() }
                    { props.children }
                </div>
                { this.renderFooter() }
            </div>
        );
    }

}

export default WidgetWrapper;
