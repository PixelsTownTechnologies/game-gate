import React from 'react';
import '../../assets/custome/wrapper.css';
import { Loader } from "../basic";
import { buildCN, pxIf, pxIfSelf } from "../../utils/utils";
import { FlexBox, If, TitleView } from "../containers";
import { BaseComponent, BaseComponentProps, BaseComponentState } from "../components";
import WindowService from "../../services/window.service";

export interface BaseWrapperProps extends BaseComponentProps {
	loading?: boolean;
	className?: string;
	scrollTopLoaderCB?: (scrollTop: () => void) => void;
	showMenuInContainer?: boolean;
	hideMenu?: boolean;
	hideFooter?: boolean;
	hideContainer?: boolean;
	
	hideTitle?: boolean;
	
	showSubMenu?: boolean;
	
	icon?: string;
	title?: string;
	subTitleChildren?: JSX.Element | null;
	containerCName?: string;
	fitContainer?: boolean;
}

export interface WidgetWrapperProps extends BaseWrapperProps {
	widgets: {
		menu?: JSX.Element;
		subMenu?: React.ComponentType<any>;
		footer?: JSX.Element;
		titleSectionView?: React.ComponentType<{ title: string, icon?: string, children?: JSX.Element }>;
		loader?: React.ComponentType<any>;
		extra?: any;
	}
}

export interface WidgetWrapperStates extends BaseComponentState {
	type: 'Mobile' | 'Computer' | 'Tablet';
}


class WidgetWrapper extends BaseComponent<WidgetWrapperProps, WidgetWrapperStates> {
	
	element: any;
	screenID?: number;
	
	initialize = () => {
		if (this.props.scrollTopLoaderCB) {
			this.props.scrollTopLoaderCB(this.scrollToTop);
		}
		setTimeout(() => {
			this.scrollToTop();
		}, 200);
		this.screenID = WindowService.subscribe((setting) => {
			this.setState({type: ( setting.type as any )} as any);
		});
	};
	
	destroy = () => {
		if (this.screenID) {
			WindowService.unsubscribe(this.screenID);
		}
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
				const TitleSectionViewWidget = this.props.widgets.titleSectionView as any;
				return (
					<TitleSectionViewWidget
						icon={ this.props.icon as string }
						title={ pxIfSelf(this.props.title, 'No Title') as string }>
					</TitleSectionViewWidget>
				)
			}
			return (
				<TitleView
					dir={ this.state.direction }
					title={ this.props.title }
					icon={ this.props.icon }
					subTitleChildren={ this.props.subTitleChildren }
				/>
			);
		}
	}
	
	show(props: WidgetWrapperProps, state: WidgetWrapperStates) {
		const SubMenu = props.widgets.subMenu as any;
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
				<div dir={ this.state.direction }
				     className={ buildCN('px-lib', props.hideContainer ? '' : 'px-container',
					     pxIf(props.fitContainer, 'fit', ''),
					     pxIfSelf(props.containerCName, '')) }>
					<If flag={ props.showMenuInContainer }>
						{ this.renderMenu() }
					</If>
					<FlexBox dir={ this.state.direction }
					         className={ buildCN('sub-menu-fb', ( state.type !== 'Mobile' && props.showSubMenu && SubMenu )
						         ? '' : 'show-full-div') }
					         flexDirection={ 'row' }>
						{
							state.type !== 'Mobile' && props.showSubMenu && SubMenu ? (
								<SubMenu/>
							) : null
						}
						<div>
							{ this.renderTitleSection() }
							{ props.children }
						</div>
					</FlexBox>
				</div>
				{ this.props?.widgets?.extra ? this.props?.widgets?.extra : null }
				{ !this.props.loading ? this.renderFooter() : null }
			</div>
		);
	}
	
}

export default WidgetWrapper;
