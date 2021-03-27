import './profile.css';
import React, { useState } from 'react';

import { useLanguage } from "../../../../lib/hooks/languageHook";
import { useForm, useLoader } from "../../../../lib/hooks/generic";
import { useWindow } from "../../../../lib/hooks/screen-change";
import { Wrapper } from "../../../shared/wrapper";
import { Divider, FlexBox, FlexCenter, FlexSpace, If, PaddingBox } from "../../../../lib/components/containers";
import { Divider as SDivider, Form as SForm, Header, Icon, Message } from "semantic-ui-react";
import { UserBaseDTO } from "../../../../lib/models/user";
import { clamp, getDefaultValidMsg, pxIfSelf } from "../../../../lib/utils/utils";
import { Button, Image, Link, MessageErrors } from "../../../../lib/components/basic";
import ProfileIcon from '../../../../assets/icons/profile.png';
import { EmailInput, TextField } from "../../../../lib/components/form/fields";
import Form from "../../../../lib/components/form/form";
import UserFacadeService from "../../../../lib/services/facade-service/user-facade-service";
import { VALIDATOR_CODES } from "../../../../lib/models/validators";
import LanguageService from "../../../../lib/services/language-service";
import { URL_ROUTES } from "../../../../routes";
import { useEntityStore } from "../../../../lib/hooks/user";
import { SubMenu } from "../../../shared/sub-menu/sub-menu";
import Dialog from "../../../../lib/components/form/dialog";
import { UserDTO } from "../../../../models/user";
import { connect } from "react-redux";
import { StoreState } from "../../../../lib/models/application";

interface ProfileProps {
	user: UserBaseDTO;
}

/**
 * Fields ('phone', 'username', 'address_one')
 * @param props
 * @constructor
 */
export function UpdateUserDataDialog(props: { onClose: () => void, open: boolean, fields: string[], message?: string }) {
	const user = useEntityStore<UserDTO>('user');
	const {words} = useLanguage();
	const loader = useLoader();
	const {form, onChange} = useForm({
		username: user.username,
		address_one: user.address_one ? user.address_one : '',
		address_two: user.address_two ? user.address_two : '',
		phone: user.phone ? user.phone : ''
	});
	if (!user) {
		return null;
	}
	return (
		<Dialog
			open={ props.open }
			onClose={ props.onClose }
			headerText={ words.messages.profile.userNameSetting }
			closeButtonSetting={ {
				disabled: loader.isLoading,
				text: words.basic.cancel,
				onClick: () => {
					props.onClose();
				}
			} }
			saveButtonSetting={ {
				loading: loader.isLoading,
				onClick: () => {
					if (form.username) {
						loader.activate();
						UserFacadeService.updateUserSelf({
							username: form.username,
							address_one: form.address_one,
							address_two: form.address_two,
							phone: form.phone
						}).then((data) => {
							if (data) {
								setTimeout(() => {
									props.onClose();
								}, 200);
							}
							loader.disabled();
						});
					}
				},
				text: words.basic.save,
				positive: true
			} }
			deleteButtonSetting={ {
				show: false
			} }
		>
			<SForm>
				<If flag={ props.message }>
					<Message info>
						<Message.Header>{ props.message }</Message.Header>
					</Message>
				</If>
				<If flag={ props.fields.includes('username') }>
					<SForm.Field>
						<label>{ words.userFields.userName }</label>
						<TextField length={ 16 } onChange={ (value) => {
							onChange({...form, username: value});
						} } value={ form.username }/>
					</SForm.Field>
				</If>
				<If flag={ props.fields.includes('address_one') }>
					<SForm.Field>
						<label>{ words.userFields.addressOne }</label>
						<TextField length={ 128 } onChange={ (value) => {
							onChange({...form, address_one: value ? value.trim() : value});
						} } value={ form.address_one }/>
					</SForm.Field>
				</If>
				<If flag={ props.fields.includes('phone') }>
					<SForm.Field>
						<label>{ words.userFields.phone }</label>
						<TextField length={ 16 } onChange={ (value) => {
							if (!isNaN(Number(value)) && Number(value) > 0) {
								onChange({...form, phone: value});
							}
						} } value={ form.phone }/>
					</SForm.Field>
				</If>
			</SForm>
		</Dialog>
	);
}

const Profile = ({user}: ProfileProps) => {
	const {words, dir} = useLanguage();
	const loader = useLoader();
	const userLoader = useLoader();
	const {width, isMobile} = useWindow();
	const [ error, setError ] = React.useState(false);
	const [ passwordChangeSuccess, setPasswordChangeSuccess ] = React.useState(false);
	const [ isSubmit, setIsSubmit ] = React.useState(false);
	//const [ toggleDark, setToggleDark ] = React.useState(ThemeService.getLoadedThemeName() === 'dark');
	const [ selectedAvatar ] = useState(ProfileIcon);
	const {form, onChange, onValidate, isValid, setForm} = useForm({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
		username: user?.username,
		address_one: user?.address_one,
		address_two: user?.address_two ? user?.address_two : '',
		phone: user?.phone ? user?.phone : ''
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
						username: user.username,
						address_one: user.address_one ? user.address_one : '',
						address_two: user.address_two ? user.address_two : '',
						phone: user.phone ? user.phone : ''
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
					<Image src={ selectedAvatar } border width={ 200 } circular/>
					<Header className={ 'px-non-margin px-stp-10' }
					        as={ 'h1' }>{ pxIfSelf(user.username, 'User 999999') }</Header>
					<div className={ 'black-text' }>{ user.email }</div>
				</FlexCenter>
				<FlexCenter padding={ 20 }>
					<Link className={ 'px-slm-5 px-srm-5 link-circular-btn' } to={ URL_ROUTES.USER.ORDER_HISTORY }>
						<Icon name={ 'clipboard' }/>
					</Link>
					<Link className={ 'px-slm-5 px-srm-5 link-circular-btn' } to={ URL_ROUTES.USER.POINTS_SHOP }>
						<Icon name={ 'gift' }/>
					</Link>
					<Link className={ 'px-slm-5 px-srm-5 link-circular-btn' } to={ URL_ROUTES.USER.CART }>
						<Icon name={ 'shopping cart' }/>
					</Link>
					<Link className={ 'px-slm-5 px-srm-5 link-circular-btn' } to={ URL_ROUTES.USER.FAVORITE }>
						<Icon name={ 'heart' }/>
					</Link>
				</FlexCenter>
			</PaddingBox>
			
			<FlexBox dir={ dir } className={ 'profile-container' }>
				<div>
					<If flag={ !isMobile }>
						<SubMenu/>
					</If>
				</div>
				<FlexBox className={ 'profile-content-box' } flexDirection={ 'column' }>
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
							{/*
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
                       */ }
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
									<TextField length={ 12 } onChange={ (value) => {
										onChange({...form, username: value});
									} } value={ form.username }/>
								</SForm.Field>
								<SForm.Field>
									<label>{ words.userFields.addressOne }</label>
									<TextField length={ 128 } onChange={ (value) => {
										onChange({...form, address_one: value});
									} } value={ form.address_one }/>
								</SForm.Field>
								<SForm.Field>
									<label>{ words.userFields.phone }</label>
									<TextField length={ 16 } onChange={ (value) => {
										if (!isNaN(Number(value)) && Number(value) > 0) {
											onChange({...form, phone: value});
										}
									} } value={ form.phone }/>
								</SForm.Field>
							</SForm>
							<SDivider hidden/>
						</div>
					</FlexBox>
					<FlexSpace>
						<Button loading={ userLoader.isLoading } className={ '' } onClick={ () => {
							if (form.username) {
								userLoader.activate();
								UserFacadeService.updateUserSelf({
									username: form.username,
									address_one: form.address_one,
									address_two: form.address_two,
									phone: form.phone
								}).then(() => {
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
								<p className={ 'p-max-text' }>
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
				</FlexBox>
			</FlexBox>
		</Wrapper>
	);
}

export default connect((state: StoreState, ownProps) => {
	return {...ownProps, user: state.user};
})(Profile as any);
