import React, { useState } from 'react';
import { Wrapper } from "../../shared/wrapper";
import { Divider, Header, Segment } from "semantic-ui-react";
import { Logo } from "../../shared/base";
import { FlexBox, FlexCenter, FlexSpace, If } from "../../../lib/components/containers";
import { BaseComponentProps } from "../../../lib/components/components";
import { buildCN, clamp, getDefaultValidMsg, isFalse, pxIf, pxIfSelf } from "../../../lib/utils/utils";
import { DIR } from "../../../lib/utils/constant";
import { useLanguage } from "../../../lib/hooks/languageHook";
import Form from "../../../lib/components/form/form";
import { useWindow } from "../../../lib/hooks/screen-change";
import { Button, Link } from "../../../lib/components/basic";
import { ROUTES_URL } from "../../../routes";
import { EmailValidator, ValidateResult } from "../../../lib/models/validators";


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

export interface LoginWidgetDTO {
}

export function LoginWidget(props: LoginWidgetDTO) {
    const {words, dir} = useLanguage();
    const {width} = useWindow();
    const [ validationResult, setValidationResult ] = useState<ValidateResult | null>(null);
    const [ isSignInPress, setSignInPress ] = useState(false);
    const [ form, setForm ] = useState({email: '', password: ''});
    const onSignIn = () => {
        setSignInPress(true);
        if (validationResult?.valid) {
            console.log('submit')
        }
    };
    return (
        <SegmentBox minWidth={ clamp(300, width * 0.6, 500) } dir={ dir } nonBoard raised stacked
                    header={ words.authPages.signInTo + ' ' + words.appName }>
            <Form
                onChange={ form => {
                    setForm(form);
                } }
                messages={ getDefaultValidMsg(words) }
                onValidate={ validationResult => {
                    setValidationResult(validationResult);
                } }
                form={ form }
                fields={
                    [
                        [
                            {
                                fieldName: 'email',
                                type: 'email',
                                fieldTitle: words.userFields.email,
                                validator: {required: true, validators: [ EmailValidator ]},
                                showErrorOnField: isSignInPress
                            }
                        ]
                        ,
                        [
                            {
                                fieldName: 'password',
                                type: 'password',
                                fieldTitle: words.userFields.password,
                                validator: {required: true},
                                showErrorOnField: isSignInPress
                            }
                        ]
                    ]
                }
            />
            <FlexSpace>
                <Button
                    text={ words.authPages.signIn }
                    onClick={ onSignIn }
                />
                <Link to={ ROUTES_URL.USER.AUTH.RESET_PASSWORD }>
                    { words.authPages.forgetPassword }?
                </Link>
            </FlexSpace>

        </SegmentBox>
    );
}


interface LoginProps {
}

interface LoginState {
}

class LoginPage extends React.Component<LoginProps, LoginState> {

    render() {
        return (
            <Wrapper hideTitle fitContainer>
                <FlexBox justifyContent={ 'flex-start' } alignItems={ 'center' } flexDirection={ 'column' }
                         className={ 'px-f-height' }>
                    <Logo size={ 'small' }/>
                    <Divider hidden/>
                    <LoginWidget/>
                </FlexBox>
            </Wrapper>
        );
    }

}

export default LoginPage;
