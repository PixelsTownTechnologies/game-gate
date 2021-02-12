import React from 'react';
import { DIR } from "../utils/constant";
import LanguageService, { LanguageBaseWords } from "../services/language-service";
import { isEmpty, isTrueOrUndefined } from "../utils/utils";

export interface BaseComponentProps {
    pxIf?: boolean;
    children?: JSX.Element | React.ReactNode | null;
}

export interface BaseComponentState {
    direction: string;
    word: LanguageBaseWords;
}

export interface BaseComponentMethods<Props, State> {
    show: (props: Props, state: State) => JSX.Element | null;
    initialize: () => void;
    destroy: () => void;
}

export class BaseComponent<Props extends BaseComponentProps, State extends BaseComponentState> extends React.Component<Props, State> {

    private languageServiceID?: number;

    constructor(props: Props) {
        super(props);
        this.state = {
            direction: DIR.AUTO,
            word: {} as any
        } as State;
    }

    word = () => {
        return this.state.word;
    }

    direction = () => {
        return this.state.direction;
    }

    componentDidMount = () => {
        this.languageServiceID = LanguageService.subscribe((setting) => {
            if (this) {
                this.setState({direction: setting.direction, word: setting.words});
            }
        });
        if (( this as any ).initialize) {
            ( this as any ).initialize();
        }
    }

    componentWillUnmount = () => {
        if (this.languageServiceID) {
            LanguageService.unsubscribe(this.languageServiceID);
        }
        if (( this as any ).destroy) {
            ( this as any ).destroy();
        }
    }

    render() {
        return ( this as any ).show && isTrueOrUndefined(this.props.pxIf) && !isEmpty(this.state.word) ?
            ( this as any ).show(this.props, this.state)
            : null;
    }

}

