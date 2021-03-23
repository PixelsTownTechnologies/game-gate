import React, { useState } from 'react';
import { BaseComponent, BaseComponentProps, BaseComponentState } from "../../../lib/components/components";
import './menu.css';
import { FlexBox, FlexCenter, FlexSpace, If, Space } from "../../../lib/components/containers";
import WindowService from "../../../lib/services/window.service";
import { Link, Redirect } from "../../../lib/components/basic";
import { Loader, Logo } from "../base";
// @ts-ignore
import Avatar from '../../../assets/icons/avatar.png';
// @ts-ignore
import Profile from '../../../assets/icons/profile.png';
import { URL_ROUTES } from "../../../routes";
import { Button, Dimmer, Divider, Dropdown, Flag, Header, Icon, Image, Input, Label, Segment } from "semantic-ui-react";
import { useWindow } from "../../../lib/hooks/screen-change";
import { useLanguage } from "../../../lib/hooks/languageHook";
import { getFilterRouters, getRoutes, isUserAuthenticate } from "../../../lib/utils/application-helper";
import { connect } from "react-redux";
import { StoreState } from "../../../lib/models/application";
import { costFormat, isEmpty } from "../../../lib/utils/utils";
import { UserDTO } from "../../../models/user";
import LanguageService from "../../../lib/services/language-service";
import { EntityService } from "../../../lib/services/entity-service/entity-service";
import { homeService } from "../../../services/service-config";
import { HomeDTO } from "../../../models/home-details";
import { platformTypeStateToPlatform } from "../../../models/game";
import { LanguageSystemWords } from "../../../models/language";

function MenuSearch(props: { onSearch: (value: string) => void }): any {
	const {isMobile} = useWindow();
	const {words} = useLanguage();
	const [ open, setOpen ] = useState(false);
	const [ searchValue, setSearchValue ] = useState('');
	if (isMobile) {
		return (
			[
				<Icon className={ 'search-icon' } onClick={ () => setOpen(true) } key={ 1 } name={ 'search' }/>
				,
				<Dimmer className={ 'px-non-margin' } page key={ 2 } onClickOutside={ () => setOpen(false) }
				        as={ Segment } active={ open }>
					<FlexCenter flexDirection={ 'column' }>
						<Header className={ 'white' }>{ words.messages.menu.lookingHelp }</Header>
						<Input
							placeholder={ words.basic.search }
							onChange={ (e) => setSearchValue(e.target.value) }
							onKeyPress={ (e: any) => {
								if (e.key === 'Enter') {
									props.onSearch(searchValue);
									setOpen(false);
								}
							} }
							className={ 'm-search-input' }
							icon='search'
						/>
						<Divider hidden/>
						<Button
							className={ 'search-more-button' }
							content={ words.basic.search }
							onClick={ () => {
								props.onSearch(searchValue);
								setOpen(false);
							} }
						/>
					</FlexCenter>
				</Dimmer>
			]
		);
	}
	return (
		<Input
			placeholder={ words.basic.search }
			onChange={ (e) => setSearchValue(e.target.value) }
			onKeyPress={ (e: any) => {
				if (e.key === 'Enter') {
					props.onSearch(searchValue);
					setOpen(false);
				}
			} }
			className={ 'm-search-input' }
			icon='search'
		/>
	);
}

export interface MenuProps extends BaseComponentProps {
	user: UserDTO;
}

export interface MenuState extends BaseComponentState {
	type: string;
	searchVal?: string;
	games: { label: string, link: string }[];
	accessories: { label: string, link: string }[];
	embedGames: { label: string, link: string }[];
	topOffers: { label: string, link: string }[];
	topSelling: { label: string, link: string }[];
	homeLoader: boolean;
}

class Menu2 extends BaseComponent<MenuProps, MenuState> {
	
	windowId?: number;
	
	constructor(props: MenuProps) {
		super(props);
		this.state = {
			...this.state,
			type: WindowService.getSetting().type
		};
	}
	
	destroy(): void {
		if (this.windowId) {
			WindowService.unsubscribe(this.windowId);
		}
	}
	
	initialize(): void {
		WindowService.subscribe((value) => {
			this.setState({type: value.type});
		});
		this.setState({homeLoader: true});
		new EntityService<any>(homeService).find().then((data: HomeDTO) => {
			if (data) {
				let games: { label: string, link: string }[] = [];
				let accessories: { label: string, link: string }[] = [];
				let embedGames: { label: string, link: string }[] = [];
				let topSelling: { label: string, link: string, sellingRate: number }[] = [];
				let topOffers: { label: string, link: string, discount: number }[] = [];
				if (data.games) {
					const platformMap: any = {};
					data.games.forEach(g => {
						if (g.platform !== 'G') {
							if (platformMap[platformTypeStateToPlatform[g.platform]]) {
								platformMap[platformTypeStateToPlatform[g.platform]] += 1;
							} else {
								platformMap[platformTypeStateToPlatform[g.platform]] = 1;
							}
						}
					});
					games = Object.keys(platformMap).map(k => ( {
						label: k + ' Games',
						link: `${ URL_ROUTES.SEARCH }/game?search=${ k }`
					} ));
					data.games.sort((g1, g2) => g2.total_orders - g1.total_orders)
						.slice(0, 12 - games.length).forEach(g => {
						
						games.push({
							label: g.name,
							link: `${ URL_ROUTES.GAME_VIEWER }/${ g.id }`
						});
					});
					data.games.forEach(g => {
						topSelling.push({
							label: g.name,
							link: `${ URL_ROUTES.GAME_VIEWER }/${ g.id }`,
							sellingRate: g.total_orders ? g.total_orders : 0
						});
					});
				}
				if (data.gameCards) {
					data.gameCards.filter(g => !g.is_sold && g.discount && g.discount > 0).forEach(g => {
						topOffers.push({
							label: g.name,
							link: `${ URL_ROUTES.GAME_VIEWER }/${ ( g.game as any )?.id ? ( g.game as any ).id : g.game }/${ g.id }`,
							discount: g.discount ? g.discount : 0
						});
					});
				}
				if (data.accessory) {
					const accessoriesMap: any = {};
					data.accessory.forEach(a => {
						if (a.type) {
							if (accessoriesMap[a.type]) {
								accessoriesMap[a.type] += 1;
							} else {
								accessoriesMap[a.type] = 1;
							}
						}
					});
					accessories = Object.keys(accessoriesMap).map(k => ( {
						label: k,
						link: `${ URL_ROUTES.SEARCH }/accessory?search=${ k }`
					} ));
					data.accessory.sort((accessory1, accessory2) =>
						accessory2.total_orders - accessory1.total_orders).slice(0, 12 - accessories.length).forEach(a => {
						accessories.push({
							label: a.name,
							link: `${ URL_ROUTES.ACCESSORY_VIEWER }/${ a.id }`
						});
					});
					data.accessory.forEach(a => {
						topSelling.push({
							label: a.name,
							link: `${ URL_ROUTES.ACCESSORY_VIEWER }/${ a.id }`,
							sellingRate: a.total_orders ? a.total_orders : 0
						});
						topOffers.push({
							label: a.name,
							link: `${ URL_ROUTES.ACCESSORY_VIEWER }/${ a.id }`,
							discount: a.discount ? a.discount : 0
						});
					});
				}
				if (data.embedGames) {
					const embedGamesMap: any = {};
					data.embedGames.forEach(a => {
						if (a.type) {
							if (embedGamesMap[a.type]) {
								embedGamesMap[a.type] += 1;
							} else {
								embedGamesMap[a.type] = 1;
							}
						}
					});
					embedGames = Object.keys(embedGamesMap).map(k => ( {
						label: k,
						link: `${ URL_ROUTES.SEARCH }/embed-game?search=${ k }`
					} ));
					data.embedGames.slice(0, 12 - embedGames.length).forEach(a => {
						embedGames.push({
							label: a.name,
							link: `${ URL_ROUTES.EMBED_GAME_VIEWER }/${ a.id }`
						});
					});
				}
				this.setState({
					games,
					accessories,
					embedGames,
					topSelling: ( topSelling.sort((s1, s2) => s2.sellingRate - s1.sellingRate).slice(0, 12) ) as any[],
					topOffers: topOffers.filter(s => s.discount > 0).sort((s1, s2) => s2.discount - s1.discount).slice(0, 12) as any[],
					homeLoader: false
				});
			}
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
			<FlexBox dir={'ltr'} flexDirection={ 'column' } alignItems={ 'center' } className={ 'px menu' }>
				<Loader show={ state.homeLoader }/>
				<Redirect flag={ !!this.state.searchVal }
				          url={ URL_ROUTES.SEARCH + `?search=${ this.state.searchVal }` }/>
				<FlexSpace dir={'ltr'}  className={ 'section1' }>
					<Link to={ URL_ROUTES.HOME }>
						<Header className={ 'm-app-name' }>
							GAMERS DZ
						</Header>
					</Link>
					<MenuSearch onSearch={ (value) => {
						this.setState({searchVal: value});
					} }/>
				</FlexSpace>
				<FlexSpace dir={'ltr'}  className={ 'stackable  section2' }>
					<FlexSpace className={ 'items-menu' }>
						{ this.showSection2() }
					</FlexSpace>
					<div className={ 'right-section' }>
						{ this.languageMenu() }
						<div className={ 'user-section' }>
							{ this.showUserMenu() }
						</div>
					</div>
				</FlexSpace>
			</FlexBox>
		);
	}
	
	languageMenu = () => {
		return (
			<Dropdown
				item
				simple
				className={ 'languages-dd' }
				trigger={
					<Button className={ 'mobile-button languages-dd-button' } icon={ 'world' }/>
				}
			>
				<Dropdown.Menu>
					<Dropdown.Item
						onClick={ () => {
							LanguageService.loadSettingByFlag('ar');
						} }
					>
						<div
							className={ 'menu-item' }
						>
							<Space count={ 1 }/>
							<Flag name='algeria'/>
							<Space count={ 1 }/>
							<span
								dir={ this.state.direction }>{ 'Arabic' }</span>
						</div>
					</Dropdown.Item>
					<Dropdown.Item
						onClick={ () => {
							LanguageService.loadSettingByFlag('en');
						} }
					>
						<div
							className={ 'menu-item' }
						>
							<Space count={ 1 }/>
							<Flag name='us'/>
							<Space count={ 1 }/>
							<span
								dir={ this.state.direction }>{ 'English' }</span>
						</div>
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		);
	}
	
	showUserMenu = () => {
		return (
			<Dropdown
				item
				simple
				direction={ 'right' }
				className={ !isUserAuthenticate() ? 'auth-r-menu' : '' }
				trigger={
					<div className={ 'profile-icon' }>
						<Image
							width={ 'tiny' } src={ Avatar }/>
						<FlexBox flexDirection={ 'column' } justifyContent={ 'flex-start' }
						         pxIf={ this.state.type === 'Computer' && isUserAuthenticate() }>
							<Header className={ 'global-f px-non-margin' }
							        as={ 'h5' }>{ this.props.user.username }</Header>
							<Header className={ 'global-f px-non-margin' }
							        as={ 'h6' }>${ costFormat(this.props.user.balance) }</Header>
						</FlexBox>
					</div>
				}
			>
				<Dropdown.Menu>
					<If flag={ isUserAuthenticate() }>
						<Dropdown.Item className={ 'u-menu-header' }>
							<Image size={ 'large' } src={ Profile }/>
							<Header className={ 'global-f px-non-margin' }
							        as={ 'h3' }>{ this.props.user.username }</Header>
							<Header className={ 'global-f px-non-margin' }
							        as={ 'h5' }>${ costFormat(this.props.user.balance) }</Header>
							<Label className={ 'user-points-label' }>{ costFormat(this.props.user.points) }</Label>
						</Dropdown.Item>
						<div dir={ this.state.direction }>
							{
								this.getRoutesRight()?.[0].subRoutes?.filter(r => !!r.menuSetting).map((route, index) => {
									return (
										<Link
											to={ route.path ? route.path : '' }
											key={ index }
											dir={ this.state.direction }
										>
											<Dropdown.Item dir={ this.state.direction }>
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
													<span
														dir={ this.state.direction }>{ this.getWordFromTextField(route.menuSetting?.text) }</span>
												</div>
											</Dropdown.Item>
										</Link>
									);
								})
							}
						</div>
					</If>
					<If flag={ !isUserAuthenticate() }>
						<FlexCenter flexDirection={ 'column' } padding={ 20 }>
							<Logo size={ 'tiny' }/>
							<Header
								as={ 'h4' }>{ this.word().authPages.welcomeMsg } { this.word().appName }</Header>
							<Button.Group className={ 'buttons' }>
								<Link to={ URL_ROUTES.USER.AUTH.REGISTER }>
									<Button content={ this.word().authPages.signUp }/>
								</Link>
								<Link to={ URL_ROUTES.USER.AUTH.LOGIN }>
									<Button content={ this.word().authPages.signIn }/>
								</Link>
							</Button.Group>
						</FlexCenter>
					</If>
				</Dropdown.Menu>
			</Dropdown>
		);
	}
	
	showSection2 = () => {
		const list = [] as any[];
		const words = this.state.word as LanguageSystemWords;
		this.getRoutesLeft().filter(r => !!r.menuSetting).forEach(route => {
			list.push(
				<Dropdown
					key={ list.length + 1 }
					item
					simple
					trigger={ <div dir={ this.state.direction }
					               className={ 'dp menu-item' }> { this.getWordFromTextField(route.menuSetting?.text) } </div> }
				>
					<Dropdown.Menu dir={ this.state.direction }>
						{
							route.subRoutes?.filter(r => !!r.menuSetting).map((subRoute, index) => {
								return (
									<Link to={ subRoute.path } key={ index }>
										<Dropdown.Item dir={ this.state.direction }>
											<div
												dir={ this.state.direction }
												className={ 'menu-item' }
											>
												<If flag={ subRoute.menuSetting?.icon }>
													<Space count={ 1 }/>
													<Icon name={ subRoute.menuSetting?.icon as any }/>
													<Space count={ 1 }/>
												</If>
												<span
													dir={ this.state.direction }>{ this.getWordFromTextField(subRoute.menuSetting?.text) }</span>
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
		if (!isEmpty(this.state.games)) {
			list.push(
				<Dropdown
					key={ list.length + 1 }
					item
					simple
					trigger={ <div dir={ this.state.direction }
					               className={ 'dp menu-item' }> { words.menu.games } </div> }
				>
					<Dropdown.Menu>
						{
							this.state.games.map((route, index) => {
								return (
									<Link to={ route.link } key={ index }>
										<Dropdown.Item>
											<div
												className={ 'menu-item' }
											>
													<span>
														{ route.label }
													</span>
											</div>
										</Dropdown.Item>
									</Link>
								);
							})
						}
					</Dropdown.Menu>
				</Dropdown>
			);
		}
		if (!isEmpty(this.state.accessories)) {
			list.push(
				<Dropdown
					key={ list.length + 1 }
					item
					simple
					trigger={ <div
						className={ 'dp menu-item' }> { words.menu.accessories } </div> }
				>
					<Dropdown.Menu>
						{
							this.state.accessories.map((route, index) => {
								return (
									<Link to={ route.link } key={ index }>
										<Dropdown.Item>
											<div
												className={ 'menu-item' }
											>
													<span>
														{ route.label }
													</span>
											</div>
										</Dropdown.Item>
									</Link>
								);
							})
						}
					</Dropdown.Menu>
				</Dropdown>
			);
		}
		if (!isEmpty(this.state.embedGames)) {
			list.push(
				<Dropdown
					key={ list.length + 1 }
					item
					simple
					trigger={ <div dir={ this.state.direction }
					               className={ 'dp menu-item' }> { words.menu.embedGames } </div> }
				>
					<Dropdown.Menu>
						{
							this.state.embedGames.map((route, index) => {
								return (
									<Link to={ route.link } key={ index }>
										<Dropdown.Item>
											<div
												className={ 'menu-item' }
											>
													<span>
														{ route.label }
													</span>
											</div>
										</Dropdown.Item>
									</Link>
								);
							})
						}
					</Dropdown.Menu>
				</Dropdown>
			);
		}
		if (!isEmpty(this.state.topSelling)) {
			list.push(
				<Dropdown
					key={ list.length + 1 }
					item
					simple
					trigger={ <div dir={ this.state.direction }
					               className={ 'dp menu-item' }> { words.menu.topSells } </div> }
				>
					<Dropdown.Menu>
						{
							this.state.topSelling.map((route, index) => {
								return (
									<Link to={ route.link } key={ index }>
										<Dropdown.Item>
											<div
												className={ 'menu-item' }
											>
													<span>
														{ route.label }
													</span>
											</div>
										</Dropdown.Item>
									</Link>
								);
							})
						}
					</Dropdown.Menu>
				</Dropdown>
			);
		}
		if (!isEmpty(this.state.topOffers)) {
			list.push(
				<Dropdown
					key={ list.length + 1 }
					item
					simple
					trigger={ <div dir={ this.state.direction }
					               className={ 'dp menu-item' }> { words.menu.topOffers } </div> }
				>
					<Dropdown.Menu>
						{
							this.state.topOffers.map((route, index) => {
								return (
									<Link to={ route.link } key={ index }>
										<Dropdown.Item>
											<div
												className={ 'menu-item' }
											>
													<span>
														{ route.label }
													</span>
											</div>
										</Dropdown.Item>
									</Link>
								);
							})
						}
					</Dropdown.Menu>
				</Dropdown>
			);
		}
		if (this.state.type === 'Mobile') {
			return (
				<Dropdown
					item
					simple
					trigger={
						<Button className={ 'mobile-button' } icon={ 'bars' }/>
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
	return {...ownProps, user: state.user, home: state.entity['home']};
})(Menu2 as any);