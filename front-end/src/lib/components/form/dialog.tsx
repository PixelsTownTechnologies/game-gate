import React from 'react';
import { Button } from "../basic";
import { DialogDTO } from "./models";
import { Header, Modal } from "semantic-ui-react";
import { FlexSpace } from "../containers";
import { pxIf } from "../../utils/utils";
import { DIR } from "../../utils/constant";
import LanguageService from "../../services/language-service";


interface DialogState {
    direction: string;
    languageSubscribeID: number;
}

class Dialog extends React.Component<DialogDTO, DialogState> {

    state = {
        languageSubscribeID: 0,
        direction: 'auto'
    }

    componentWillUnmount() {
        LanguageService.unsubscribe(this.state.languageSubscribeID);
    }

    componentDidMount() {
        this.setState({
            languageSubscribeID: LanguageService.subscribe(value => {
                this.setState({direction: value.direction});
            })
        });
    }

    render() {
        const {saveButtonSetting, deleteButtonSetting, open, closeButtonSetting, headerText, scrollingContent, size, children, onClose} = this.props;
        if (!open) {
            return null;
        }
        const dir = this.state.direction;
        return (
            <Modal
                size={ size ? size : 'small' }
                open={ open }
                onClose={ () => {
                    if (!this.props.closeButtonSetting?.disabled) {
                        onClose();
                    }
                } }
                className={ 'px-lib' }
            >
                <Modal.Header>
                    <FlexSpace dir={ pxIf(dir, dir, DIR.AUTO) }>
                        <Header>{ headerText }</Header>
                        <Button disabled={ this.props.closeButtonSetting?.disabled } size={ 'tiny' } basic
                                color={ 'grey' } onClick={ onClose }
                                iconSetting={ {name: 'times', attachToButton: true} }/>
                    </FlexSpace>
                </Modal.Header>
                <Modal.Content scrolling={ scrollingContent ? scrollingContent : false }>
                    { children }
                </Modal.Content>
                <Modal.Actions>
                    <FlexSpace padding={ 10 }>
                        <div>
                            <Button { ...deleteButtonSetting }/>
                        </div>
                        <div>
                            <Button { ...{
                                ...closeButtonSetting,
                                onClick: closeButtonSetting.onClick ? closeButtonSetting.onClick : onClose
                            } }/>
                            <Button { ...saveButtonSetting }/>
                        </div>
                    </FlexSpace>
                </Modal.Actions>
            </Modal>
        );
    }

}

export default Dialog;
