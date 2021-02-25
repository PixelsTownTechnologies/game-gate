import React from 'react';
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

export abstract class BaseComponent<Props extends BaseComponentProps, State extends BaseComponentState> extends React.Component<Props, State> {

    private languageServiceID?: number;

    protected constructor(props: Props) {
        super(props);
        this.state = {
            direction: LanguageService.getLanguageSettings().direction,
            word: LanguageService.getWords()
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
        this.initialize();
    }

    componentWillUnmount = () => {
        if (this.languageServiceID) {
            LanguageService.unsubscribe(this.languageServiceID);
        }
        this.destroy()
    }

    render() {
        return isTrueOrUndefined(this.props.pxIf) && !isEmpty(this.state.word) ?
            this.show(this.props, this.state)
            : null;
    }

    abstract show(props: Props, state: State): JSX.Element | null;

    abstract initialize(): void;

    abstract destroy(): void;

}
