import React from 'react';
import '../assets/lib.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApplicationBaseProps, ApplicationBaseState, RouteConfig } from "../models/application";
import { applyMiddleware, CombinedState, combineReducers, compose, createStore, Store } from "redux";
import { userReducer } from "../store/reducers/user";
import { errorReducer } from "../store/reducers/error";
import thunk from "redux-thunk";
import logger from 'redux-logger';
import { ActionEntityStoreBase } from "../store/action-base";
import { Provider } from "react-redux";
import { loaderReducer } from "../store/reducers/loader";
import { entityReducer } from "../store/reducers/entity";
import { Loader } from "../components/basic";
import TokenService from "../services/token-service";
import { BaseHTTPService } from "../services/http-services/base-http-service";
import StorageService from "../services/storage-service";
import { isTrue } from "../utils/utils";

const ThemeSelector = ({children, theme}: { children: any, theme: any }) => {
    const Theme = theme;
    return (
        <div>
            <React.Suspense fallback={ <></> }>
                <Theme/>
            </React.Suspense>
            { children }
        </div>
    )
}


class Application<P extends ApplicationBaseProps, S extends ApplicationBaseState> extends React.Component<P, S> {

    public static checkPermissions: (permission: string) => boolean;
    public static checkAuthenticate: () => boolean;
    public static routerConfig: RouteConfig[];
    public static store: Store<CombinedState<{ [p: string]: unknown }>, any>;
    public static dispatch: (action: ActionEntityStoreBase<any>) => any;
    public static setTheme: (theme: any) => void;

    constructor(props: P) {
        super(props);
        var console = ( function (oldCons) {
            return {
                log: function (...text: any) {
                    if (props.config.applicationLogger?.log && isTrue(props.config.enableDevelopmentMode)) {
                        for (const msg of text) {
                            oldCons.log(msg);
                        }
                    }
                },
                info: function (...text: any) {
                    if (props.config.applicationLogger?.info && isTrue(props.config.enableDevelopmentMode)) {
                        for (const msg of text) {
                            oldCons.info(msg);
                        }
                    }
                },
                warn: function (...text: any) {
                    if (props.config.applicationLogger?.warring) {
                        for (const msg of text) {
                            oldCons.warn(msg);
                        }
                    }
                },
                error: function (...text: any) {
                    if (props.config.applicationLogger?.error) {
                        for (const msg of text) {
                            oldCons.error(msg);
                        }
                    }
                }
            };
        }(window.console) );

        window.console = console as any;
        if (isTrue(props.config.enableDevelopmentMode)) {
            console.info('Start Application, Loading config...', props.config);
        }
        if (props.config.localStoreConfig) {
            StorageService.enableLocalStoreLogger(
                !!props.config.localStoreConfig.enableLogger
                && isTrue(props.config.enableDevelopmentMode)
            );
            if (props.config.localStoreConfig.key) {
                StorageService.setStorageKey(props.config.localStoreConfig.key);
            }
        }
        Application.setTheme = this.setTheme;
        Application.checkPermissions = (permission: string): boolean => {
            if (props.config.skipUser && isTrue(props.config.enableDevelopmentMode)) {
                return true;
            }
            return props.config.checkPermissions ? props.config.checkPermissions(permission, this.state.user) : false;
        };
        Application.checkAuthenticate = (): boolean => {
            if (props.config.skipUser && isTrue(props.config.enableDevelopmentMode)) {
                return true;
            }
            return props.config.checkAuthenticate ? props.config.checkAuthenticate(this.state.user) : false;
        };
        Application.routerConfig = props.config.routerConfig;
        const storeConfig = props.config.storeConfig;
        const middleware = [
            storeConfig.middleware && storeConfig.middleware.thunk && isTrue(props.config.enableDevelopmentMode) ? applyMiddleware(thunk) : null,
            storeConfig.middleware && storeConfig.middleware.logger && isTrue(props.config.enableDevelopmentMode) ? applyMiddleware(logger) : null,
        ].filter(m => !!m) as any;
        Application.store = createStore(combineReducers(
            {
                user: userReducer,
                error: errorReducer,
                loader: loaderReducer,
                entity: entityReducer,
                ...storeConfig.reducer
            }
        ), compose(...middleware as any));
        Application.dispatch = (action: any): any => {
            return Application.store.dispatch(action as never);
        };
        Application.store.subscribe(() => {
            this.setState({
                user: Application.store.getState().user as any,
                loader: Application.store.getState().loader as any
            });
        });

        this.state = {
            user: null,
            loader: false,
            theme: props.config.defaultTheme
        } as any;
        BaseHTTPService.initialize(isTrue(props.config.enableDevelopmentMode)
            ? props.config.localBackEndURL : props.config.devBackEndURL, TokenService.getToken);
    }

    public setTheme = (themeComponent: any) => {
        this.setState({theme: themeComponent});
    }

    public componentDidMount = () => {
        if (this.props.config.onStart) {
            this.props.config.onStart(this.props.config);
        }
    }

    public componentWillUnmount = () => {
        if (this.props.config.onEnd) {
            this.props.config.onEnd(this.props.config);
        }
    }

    render() {
        const routers = this.getRouters();
        const renderRoutes = [] as any;
        if (routers && routers.length > 0) {
            routers.forEach(route => {
                if (route.isRoute === undefined || route.isRoute) {
                    if (route.subRoutes) {
                        route.subRoutes.forEach(subRoute => {
                            if (subRoute.isRoute === undefined || subRoute.isRoute) {
                                renderRoutes.push(<Route
                                    key={ `${ renderRoutes.length + 1 }_${ subRoute.path.replace('/', '_') }` }
                                    exact={ true } component={ subRoute.component }
                                    path={ subRoute.path }/>);
                            }
                        });
                    } else {
                        renderRoutes.push(<Route
                            key={ `${ renderRoutes.length + 1 }_${ route.path.replace('/', '_') }` }
                            exact={ true } component={ route.component } path={ route.path }/>);
                    }
                }
            });
        }
        return (
            <div dir={ 'auto' }>
                <Provider store={ Application.store }>
                    <ThemeSelector theme={ this.state.theme }>
                        { this.showLoader() }
                        <BrowserRouter>
                            <Switch>
                                {
                                    renderRoutes.length > 0 ? renderRoutes : null
                                }
                                {
                                    this.props.config.notFoundPage ?
                                        ( <Route component={ this.props.config.notFoundPage }/> ) : null
                                }
                            </Switch>
                        </BrowserRouter>
                    </ThemeSelector>
                </Provider>
            </div>
        );
    }

    private isAuthenticate(): boolean {
        if (this.props.config.skipUser && isTrue(this.props.config.enableDevelopmentMode)) {
            return true;
        }
        return this.props.config.checkAuthenticate ? this.props.config.checkAuthenticate(this.state.user) : false;
    }

    private checkPermissions = (permission: string): boolean => {
        if (this.props.config.skipUser && isTrue(this.props.config.enableDevelopmentMode)) {
            return true;
        }
        return this.props.config.checkPermissions ? this.props.config.checkPermissions(permission, this.state.user) : false;
    }

    private canAccessRoute = (route: RouteConfig, isAuthenticate: boolean): boolean => {
        if (( route.authenticate === undefined )) {
            return isAuthenticate && route.permission ? this.checkPermissions(route.permission) : true;
        }
        if (isAuthenticate && route.authenticate) {
            return route.permission ? this.checkPermissions(route.permission) : true;
        }
        return !isAuthenticate && !route.authenticate;
    }

    private getRouters(): RouteConfig[] {
        const isAuthenticate = this.isAuthenticate();
        const newRoutesList = [] as RouteConfig[];
        this.props.config.routerConfig.forEach(route => {
            if (!route.subRoutes || route.subRoutes.length < 1) {
                if (this.canAccessRoute(route, isAuthenticate)) {
                    newRoutesList.push(route);
                }
            } else {
                const newSubRoutes = route.subRoutes.filter(subRoute => this.canAccessRoute(subRoute, isAuthenticate));
                if (newSubRoutes && newSubRoutes.length > 0) {
                    newRoutesList.push({...route, subRoutes: newSubRoutes});
                }
            }
        });
        return newRoutesList;
    }

    private showLoader = () => {
        if (this.props.config.loaderComponent) {
            return this.props.config.loaderComponent;
        }
        return <Loader show={ this.state.loader }/>;
    }
}

export default Application;