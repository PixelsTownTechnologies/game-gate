import React, { useState } from 'react';
import { useLanguage } from "../../../lib/hooks/languageHook";
import { useForm, useLoader } from "../../../lib/hooks/generic";
import { useWindow } from "../../../lib/hooks/screen-change";
import { Wrapper } from "../../shared/wrapper";
import { Divider, FlexBox, FlexCenter, FlexSpace, If, PaddingBox } from "../../../lib/components/containers";
import { Checkbox, Divider as SDivider, Form as SForm, Header } from "semantic-ui-react";
import { UserBaseDTO } from "../../../lib/models/user";
import { clamp, getDefaultValidMsg, pxIfSelf } from "../../../lib/utils/utils";
import { Button, IconButton, Image, Link, MessageErrors } from "../../../lib/components/basic";
import ProfileIcon from '../../../assets/icons/profile.png';
import { useStore } from "../../../lib/store/util";
import { EmailInput, TextField } from "../../../lib/components/form/fields";
import Form from "../../../lib/components/form/form";
import UserFacadeService from "../../../lib/services/facade-service/user-facade-service";
import { VALIDATOR_CODES } from "../../../lib/models/validators";
import LanguageService from "../../../lib/services/language-service";
import ThemeService from "../../../lib/services/theme-service";
import { ROUTES_URL } from "../../../routes";

interface ProfileProps {
    user: UserBaseDTO;
}

export const Profile = (props: ProfileProps) => {
    const {words, dir} = useLanguage();
    const loader = useLoader();
    const userLoader = useLoader();
    const {width} = useWindow();
    const [ error, setError ] = React.useState(false);
    const [ passwordChangeSuccess, setPasswordChangeSuccess ] = React.useState(false);
    const [ isSubmit, setIsSubmit ] = React.useState(false);
    const [ toggleDark, setToggleDark ] = React.useState(ThemeService.getLoadedThemeName() === 'dark');
    const [ selectedAvatar ] = useState(ProfileIcon);
    const user = useStore<UserBaseDTO>('user');
    const {form, onChange, onValidate, isValid, setForm} = useForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        username: user.username
    });
    if (!user) {
        return null;
    }
    const onSubmit = () => {
        setIsSubmit(true);
        setPasswordChangeSuccess(false);
        if (isValid) {
            loader.activate();
            UserFacadeService.changePassword({
                newPassword: form.newPassword,
                currentPassword: form.currentPassword
            }).then(data => {
                if (data) {
                    setIsSubmit(false);
                    setPasswordChangeSuccess(true);
                    setForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                        username: user.username
                    });
                } else {
                    setError(true);
                }
                loader.disabled();
            })
        }
    };
    return (
        <Wrapper className={ 'px-profile' } hideTitle loading={ loader.isLoading } containerCName={ 'px-non-padding' }>
            <PaddingBox
                className={ 'image-section' } size={ clamp(15, width * 0.15, 30) }>
                <MessageErrors show={ error }
                               onCloseModal={ () => setError(false) }
                               modal
                               subErrorMsg={ words.errors.currentPasswordError }/>
                <FlexCenter flexDirection={ 'column' }>
                    <Image src={ selectedAvatar } border width={ 200 }/>
                    <Header className={ 'px-non-margin px-stp-10' }
                            as={ 'h1' }>{ pxIfSelf(user.username, 'User 999999') }</Header>
                    <div>{ user.email }</div>
                </FlexCenter>
                <FlexCenter padding={20}>
                    <Link className={ 'px-slm-5 px-srm-5' } to={ ROUTES_URL.HOME }>
                        <IconButton size={ 'large' } name={ 'clone' } circular color={ 'blue' }/>
                    </Link>
                    <Link className={ 'px-slm-5 px-srm-5' } to={ ROUTES_URL.HOME }>
                        <IconButton size={ 'large' } name={ 'chart bar' } circular color={ 'blue' }/>
                    </Link>
                    <Link className={ 'px-slm-5 px-srm-5' } to={ ROUTES_URL.HOME }>
                        <IconButton size={ 'large' } name={ 'shopping cart' } circular color={ 'blue' }/>
                    </Link>
                    <Link className={ 'px-slm-5 px-srm-5' } to={ ROUTES_URL.HOME }>
                        <IconButton size={ 'large' } name={ 'bookmark' } circular color={ 'blue' }/>
                    </Link>
                </FlexCenter>
            </PaddingBox>
            <PaddingBox size={ clamp(20, width * 0.20, 60) }>
                <FlexBox dir={ dir } justifyContent={ 'space-between' } warp>
                    <div dir={ dir } className={ 'flex-static' }>
                        <FlexBox dir={ dir } flexDirection={ 'column' } justifyContent={ 'flex-start' }>
                            <Header as={ 'h2' }>
                                { words.messages.profile.generalSetting }
                            </Header>
                            <p>
                                { words.messages.profile.generalSettingDescription }
                            </p>
                            <SDivider hidden/>
                        </FlexBox>
                    </div>
                    <div dir={ dir } className={ 'flex-static' }>
                        <SForm>
                            <SForm.Field>
                                <label>{ words.basic.language }</label>
                                { LanguageService.getComponent() }
                            </SForm.Field>
                        </SForm>
                        <SDivider hidden/>
                        <Checkbox label={ words.basic.dark + ' ' + words.basic.theme } toggle
                                  onClick={ () => {
                                      setTimeout(() => {
                                          if (ThemeService.getLoadedThemeName() !== 'dark') {
                                              setTimeout(()=>{
                                                  ThemeService.loadTheme('dark');
                                              }, 2000);
                                              setToggleDark(true);
                                          } else {
                                              setTimeout(()=>{
                                                  ThemeService.loadTheme('light');
                                              }, 2000);
                                              setToggleDark(false);
                                          }
                                      }, 100);
                                  } }
                                  checked={ toggleDark }
                        />
                    </div>
                </FlexBox>
                <Divider/>
                <FlexBox dir={ dir } justifyContent={ 'space-between' } warp>
                    <div dir={ dir } className={ 'flex-static' }>
                        <FlexBox dir={ dir } flexDirection={ 'column' } justifyContent={ 'flex-start' }>
                            <Header as={ 'h2' }>
                                { words.messages.profile.userNameSetting }
                            </Header>
                            <p>
                                { words.messages.profile.userNameSettingDescription }
                            </p>
                            <SDivider hidden/>
                        </FlexBox>
                    </div>
                    <div dir={ dir } className={ 'flex-static' }>
                        <SForm>
                            <SForm.Field>
                                <label>{ words.userFields.email }</label>
                                <EmailInput onChange={ () => {
                                } } value={ user.email }/>
                            </SForm.Field>
                            <SForm.Field>
                                <label>{ words.userFields.userName }</label>
                                <TextField length={ 32 } onChange={ (value) => {
                                    onChange({...form, username: value});
                                } } value={ form.username }/>
                            </SForm.Field>
                        </SForm>
                        <SDivider hidden/>
                    </div>
                </FlexBox>
                <FlexSpace>
                    <Button loading={ userLoader.isLoading } className={ '' } onClick={ () => {
                        if (form.username) {
                            userLoader.activate();
                            UserFacadeService.updateUserSelf({username: form.username}).then(data => {
                                userLoader.disabled();
                            });
                        }
                    } } text={ words.basic.save } positive/>
                </FlexSpace>
                <Divider/>
                <FlexBox dir={ dir } justifyContent={ 'space-between' } warp>
                    <div dir={ dir } className={ 'flex-static' }>
                        <FlexBox dir={ dir } flexDirection={ 'column' } justifyContent={ 'flex-start' }>
                            <Header as={ 'h2' }>
                                { words.messages.profile.changePassword }
                            </Header>
                            <p>
                                { words.messages.profile.changePasswordDescription }
                            </p>
                            <If flag={ passwordChangeSuccess }>
                                <h5 style={ {color: 'green'} }>{ words.messages.profile.passwordChangeSuccess }</h5>
                            </If>
                            <SDivider hidden/>
                        </FlexBox>
                    </div>
                    <div dir={ dir } className={ 'flex-static' }>
                        <Form
                            className={ 'px-w-100' }
                            messages={ [
                                ...getDefaultValidMsg(words),
                                {code: VALIDATOR_CODES.NOT_EQUAL_TO, msg: words.errors.passwordAndConfirmPassword}
                            ] }
                            fields={
                                [
                                    [
                                        {
                                            fieldName: 'currentPassword',
                                            fieldTitle: words.userFields.currentPassword,
                                            type: 'password',
                                            validator: {required: true},
                                            showErrorOnField: isSubmit,
                                            hideRequiredMark: true,
                                            className: 'px-w-100'
                                        }
                                    ],
                                    [
                                        {
                                            fieldName: 'newPassword',
                                            fieldTitle: words.userFields.newPassword,
                                            type: 'password',
                                            validator: {required: true},
                                            showErrorOnField: isSubmit,
                                            hideRequiredMark: true
                                        }
                                    ],
                                    [
                                        {
                                            fieldName: 'confirmPassword',
                                            fieldTitle: words.userFields.confirmPassword,
                                            type: 'password',
                                            validator: {required: true, equalToField: 'newPassword'},
                                            showErrorOnField: isSubmit,
                                            hideRequiredMark: true
                                        }
                                    ]
                                ]
                            } onChange={ onChange } form={ form } onValidate={ onValidate }/>
                    </div>
                </FlexBox>
                <FlexSpace>
                    <Button className={ '' } onClick={ onSubmit } text={ words.basic.save } positive/>
                </FlexSpace>
                <Divider/>
            </PaddingBox>
        </Wrapper>
    );
}

export default Profile;
