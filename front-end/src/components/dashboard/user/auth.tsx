import React, { useState } from 'react';
import { Wrapper } from "../../shared/wrapper";
import { Divider } from "semantic-ui-react";
import { Logo } from "../../shared/base";
import { FlexBox, FlexCenter, FlexSpace, SegmentBox } from "../../../lib/components/containers";
import { clamp, getDefaultValidMsg, isFalse, isTrue } from "../../../lib/utils/utils";
import { useLanguage } from "../../../lib/hooks/languageHook";
import Form from "../../../lib/components/form/form";
import { useWindow } from "../../../lib/hooks/screen-change";
import { Button, Link, MessageErrors, Redirect } from "../../../lib/components/basic";
import { ROUTES_URL } from "../../../routes";
import { EmailValidator, LengthValidator, ValidateResult, VALIDATOR_CODES } from "../../../lib/models/validators";
import UserFacadeService from "../../../lib/services/facade-service/user-facade-service";
import TokenService from "../../../lib/services/token-service";
import { registerUser } from "../../../lib/store/actions/user";
import { activeLoader, flushLoader } from "../../../lib/store/actions/loader";
import { useLoader } from "../../../lib/hooks/generic";

export function LoginWidget() {
    const {words, dir} = useLanguage();
    const {width} = useWindow();
    const loginLoader = useLoader();
    const [ error, setError ] = useState(false);
    const [ validationResult, setValidationResult ] = useState<ValidateResult | null>(null);
    const [ isSignInPress, setSignInPress ] = useState(false);
    const [ loginSuccess, setLoginSuccess ] = useState(false);
    const [ form, setForm ] = useState({username: '', password: ''});
    const onSignIn = () => {
        setSignInPress(true);
        if (validationResult?.valid) {
            loginLoader.activate();
            UserFacadeService.login(form, true).then(data => {
                if (!data) {
                    setError(true);
                } else {
                    setLoginSuccess(true);
                    setTimeout(() => {
                        activeLoader();
                        setTimeout(() => {
                            TokenService.saveToken(data.token);
                            registerUser(data.user);
                            flushLoader();
                        }, 500);
                    }, 200);
                }
                loginLoader.disabled();
            });
        }
    };
    return (
        <SegmentBox minWidth={ clamp(300, width * 0.6, 500) } dir={ dir } nonBoard raised stacked
                    header={ words.authPages.signInTo + ' ' + words.appName }>
            <Redirect flag={ loginSuccess } url={ ROUTES_URL.HOME }/>
            <MessageErrors show={ error } subErrorMsg={ words.errors.emailOrPasswordNotCorrect }/>
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
                                fieldName: 'username',
                                type: 'email',
                                fieldTitle: words.userFields.email,
                                validator: {required: true, validators: [ EmailValidator ]},
                                showErrorOnField: isSignInPress,
                                hideRequiredMark: true
                            }
                        ]
                        ,
                        [
                            {
                                fieldName: 'password',
                                type: 'password',
                                fieldTitle: words.userFields.password,
                                validator: {required: true},
                                showErrorOnField: isSignInPress,
                                hideRequiredMark: true
                            }
                        ]
                    ]
                }
            />
            <FlexSpace>
                <Button
                    text={ words.authPages.signIn }
                    onClick={ onSignIn }
                    loading={ loginLoader.isLoading }
                />
                <Link to={ ROUTES_URL.USER.AUTH.FORGET_PASSWORD }>
                    { words.authPages.forgetPassword }?
                </Link>
            </FlexSpace>

        </SegmentBox>
    );
}

export function LoginPage() {
    const {words} = useLanguage();
    return (
        <Wrapper hideTitle fitContainer>
            <FlexBox justifyContent={ 'flex-start' } alignItems={ 'center' } flexDirection={ 'column' }
                     className={ 'px-f-height' }>
                <Logo size={ 'small' }/>
                <Divider hidden/>
                <LoginWidget/>
                <Divider hidden/>
                <Link to={ ROUTES_URL.USER.AUTH.REGISTER }>
                    { words.authPages.registerNow }
                </Link>
            </FlexBox>
        </Wrapper>
    );
}

export function RegisterWidget() {
    const {words, dir} = useLanguage();
    const {width} = useWindow();
    const registerLoader = useLoader();
    const [ error, setError ] = useState(false);
    const [ validationResult, setValidationResult ] = useState<ValidateResult | null>(null);
    const [ isSubmitPress, setSubmitPress ] = useState(false);
    const [ loginSuccess, setLoginSuccess ] = useState<boolean | null>(null);
    const [ form, setForm ] = useState({email: '', password: '', confirmPassword: ''});
    const onRegister = () => {
        setSubmitPress(true);
        if (validationResult?.valid) {
            registerLoader.activate();
            UserFacadeService.register(form).then(data => {
                if (data) {
                    // Login in to system
                    UserFacadeService.login({username: form.email, password: form.password}, true).then(data => {
                        if (!data) {
                            // forward to login
                            setLoginSuccess(false);
                        } else {
                            setLoginSuccess(true);
                            setTimeout(() => {
                                activeLoader();
                                setTimeout(() => {
                                    TokenService.saveToken(data.token);
                                    registerUser(data.user);
                                    flushLoader();
                                }, 500);
                            }, 200);
                        }
                    });
                } else {
                    setError(true);
                }
                registerLoader.disabled();
            })
        }
    };
    return (
        <SegmentBox minWidth={ clamp(300, width * 0.6, 500) } dir={ dir } nonBoard raised stacked
                    header={ words.authPages.register + ' ' + words.appName }>
            <Redirect flag={ isTrue(loginSuccess) } url={ ROUTES_URL.HOME }/>
            <Redirect flag={ isFalse(loginSuccess) } url={ ROUTES_URL.USER.AUTH.LOGIN }/>
            <MessageErrors show={ error } subErrorMsg={ words.errors.emailAlreadyUsed }/>
            <Form
                onChange={ form => {
                    setForm(form);
                } }
                messages={ [
                    ...getDefaultValidMsg(words),
                    {code: VALIDATOR_CODES.NOT_EQUAL_TO, msg: words.errors.passwordAndConfirmPassword}
                ] }
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
                                showErrorOnField: isSubmitPress,
                                hideRequiredMark: true
                            }
                        ]
                        ,
                        [
                            {
                                fieldName: 'password',
                                type: 'password',
                                fieldTitle: words.userFields.password,
                                validator: {required: true, equalToField: 'confirmPassword'},
                                showErrorOnField: isSubmitPress,
                                hideRequiredMark: true
                            }
                        ],
                        [
                            {
                                fieldName: 'confirmPassword',
                                type: 'password',
                                fieldTitle: words.userFields.confirmPassword,
                                validator: {required: true},
                                showErrorOnField: isSubmitPress,
                                hideRequiredMark: true
                            }
                        ]
                    ]
                }
            />
            <FlexCenter>
                <Button
                    text={ words.authPages.register }
                    onClick={ onRegister }
                    loading={ registerLoader.isLoading }
                />
            </FlexCenter>

        </SegmentBox>
    );
}

export function RegisterPage() {
    const {words} = useLanguage();
    return (
        <Wrapper hideTitle fitContainer>
            <FlexBox justifyContent={ 'center' } alignItems={ 'center' } flexDirection={ 'column' }
                     className={ 'px-f-height' }>
                <RegisterWidget/>
                <Divider hidden/>
                <Link to={ ROUTES_URL.USER.AUTH.LOGIN }>
                    { words.authPages.haveAccountLogin }
                </Link>
            </FlexBox>
        </Wrapper>
    );
}

export function ForgetWidget() {
    const {words, dir} = useLanguage();
    const {width} = useWindow();
    const loader = useLoader();
    const [ state, setState ] = useState(0);
    const [ error, setError ] = useState(false);
    const [ redirectToLogin, setRedirect ] = useState(false);
    const [ isSignInPress, setSignInPress ] = useState(false);
    const [ form, setForm ] = useState({email: '', confirmPassword: '', password: '', code: ''});
    const [ validationResult, setValidationResult ] = useState<ValidateResult | null>(null);
    const setStateAndClear = (newState: number) => {
        setState(newState);
        setError(false);
        setSignInPress(false);
        setValidationResult(null);
    }
    const onSubmit = () => {
        setSignInPress(true);
        if (validationResult?.valid) {
            loader.activate();
            if (state === 0) {
                UserFacadeService.resetPasswordSendEmail(form.email).then(data => {
                    if (data.send) {
                        setStateAndClear(1);
                    } else {
                        setError(true);
                    }
                    loader.disabled();
                });
            } else if (state === 1) {
                UserFacadeService.resetPasswordCheckCode(form.email, form.code).then(data => {
                    if (data.valid) {
                        setStateAndClear(2);
                    } else {
                        setError(true);
                    }
                    loader.disabled();
                });
            } else if (state === 2) {
                UserFacadeService.resetPasswordChangePassword(form.email, form.password, form.code).then(data => {
                    if (data.completed) {
                        setTimeout(() => {
                            setRedirect(true);
                        }, 200);
                    } else {
                        setError(true);
                        loader.disabled();
                    }
                });
            }
        }
    };
    return (
        <SegmentBox minWidth={ clamp(300, width * 0.6, 500) } dir={ dir } nonBoard raised stacked
                    header={ words.authPages.sendResetCode }>
            <Redirect flag={ redirectToLogin } url={ ROUTES_URL.USER.AUTH.LOGIN }/>
            <MessageErrors show={ error && state === 0 } subErrorMsg={ words.errors.emailNotUsed }/>
            <MessageErrors show={ error && state === 1 } subErrorMsg={ words.errors.verifyCodeNotCorrect }/>
            <MessageErrors show={ error && state === 2 }
                           subErrorMsg={ words.errors.resetPasswordFailedPleaseTryAgain }/>
            <Form
                onChange={ (newForm) => {
                    setForm({...form, ...newForm});
                } }
                messages={ [
                    ...getDefaultValidMsg(words),
                    {code: VALIDATOR_CODES.LENGTH, msg: words.errors.verifyCodeLength},
                    {code: VALIDATOR_CODES.NOT_EQUAL_TO, msg: words.errors.passwordAndConfirmPassword}
                ] }
                onValidate={ validationResult => {
                    setValidationResult(validationResult);
                } }
                action={ `${ state }` }
                form={ form }
                fields={
                    [
                        [
                            {
                                fieldName: 'email',
                                type: 'email',
                                fieldTitle: words.userFields.email,
                                validator: {required: true, validators: [ EmailValidator ]},
                                showErrorOnField: isSignInPress,
                                hideOnAction: [ '1', '2' ]
                            }
                        ], [
                        {
                            fieldName: 'code',
                            type: 'text',
                            fieldTitle: words.authPages.verifyCode,
                            validator: {
                                required: true,
                                validators: [ LengthValidator ],
                                validatorInput: {length: 8},
                            },
                            subInputOptions: {length: 8},
                            showErrorOnField: isSignInPress,
                            hideOnAction: [ '0', '2' ]
                        }
                    ], [
                        {
                            fieldName: 'password',
                            type: 'password',
                            fieldTitle: words.userFields.password,
                            validator: {required: true, equalToField: 'confirmPassword'},
                            showErrorOnField: isSignInPress,
                            hideOnAction: [ '0', '1' ]
                        }
                    ],
                        [
                            {
                                fieldName: 'confirmPassword',
                                type: 'password',
                                fieldTitle: words.userFields.confirmPassword,
                                validator: {required: true},
                                showErrorOnField: isSignInPress,
                                hideOnAction: [ '0', '1' ]
                            }
                        ]
                    ]
                }
            />
            <Divider hidden/>
            <FlexCenter>
                <Button
                    text={ state === 0 ? words.authPages.sendResetCode : ( state === 1 ? words.authPages.verifyCode : words.authPages.changePassword ) }
                    onClick={ onSubmit }
                    loading={ loader.isLoading }
                />
            </FlexCenter>

        </SegmentBox>
    );
}

export function ForgetPage() {
    return (
        <Wrapper hideTitle fitContainer>
            <FlexBox justifyContent={ 'center' } alignItems={ 'center' } flexDirection={ 'column' }
                     className={ 'px-f-height' }>
                <Logo size={ 'small' }/>
                <Divider hidden/>
                <ForgetWidget/>
                <Divider hidden/>
            </FlexBox>
        </Wrapper>
    );
}
