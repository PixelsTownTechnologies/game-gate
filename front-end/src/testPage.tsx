import React, { useState } from 'react';
import { UserBaseDTO } from "./lib/models/user";
import { connect } from "react-redux";
import ThemeService from "./lib/services/theme-service";
import { FlexCenter, FlexSpace, MarginBox, PaddingBox } from "./lib/components/containers";
import { Button, IconButton, IconTextButton } from "./lib/components/basic";
import LanguageService, { LanguageBaseWords } from "./lib/services/language-service";
import { ImageField, StringField } from "./lib/components/form/fields";
import { Image } from "semantic-ui-react";
import { FormDTO } from "./lib/components/form/models";
import { ValidateResult, VALIDATOR_CODES } from "./lib/models/validators";
import DialogForm, { DialogFormActionResult } from "./lib/components/form/dialog-form";
import { BaseEntity } from "./lib/models/base";
import { PTTable, TableDTO } from "./lib/components/tabels";
import { Wrapper } from "./components/shared/wrapper";

interface ComponentPPXProps {
    user: UserBaseDTO;
}

interface TestType extends BaseEntity {
    number1: number;
    number2: number;
    text1: string;
    text2: string;
    text3: string;
}

function ComponentPPXPage(props: ComponentPPXProps) {
    const [ languageWords, setWord ] = useState(null as LanguageBaseWords | null);
    const [ dir, setDir ] = useState('auto');
    const [ strValue, setStrValue ] = useState('');
    const [ showModal, setShowModal ] = useState(false);
    const [ form, setForm ] = useState({
        text1: ''
        , text2: 'Text text'
        , text3: 'Init data'
        , id: 5
        , isEditable: true
        , isDeletable: true
    } as TestType);
    const [ image, setImage ] = useState('');
    if (!languageWords) {
        LanguageService.subscribe((setting) => {
            setDir(setting.direction);
            setWord(setting.words);
        });
    }
    const formSettings: FormDTO<TestType> = {
        fields: [
            [
                {
                    fieldName: 'number1',
                    fieldTitle: 'Number One',
                    type: 'number',
                    defaultValue: 10,
                },
                {
                    fieldName: 'number2',
                    fieldTitle: 'Number Two',
                    type: 'range',
                    defaultValue: 2,
                    subInputOptions: {min: 10, max: 100},
                    validator: {
                        validators: [ ( (value, subInput) => {
                            return {
                                errorCode: 'NUMBER_NOT_100',
                                valid: value === 100,
                                subMsg: 'value should be 100'
                            }
                        } ) ]
                    }
                },
            ]
            , [
                {
                    fieldName: 'text1',
                    fieldTitle: 'Text One',
                    type: 'text',
                    subInputOptions: {length: 10},
                    validator: {required: true}
                }
            ], [
                {
                    fieldName: 'text2',
                    fieldTitle: 'Text Two',
                    type: 'bigText',
                    validator: {equalToField: 'text1'},
                    showErrorOnField: false
                }
            ]
        ],
        form: form as any,
        onChange: (form1: TestType) => {
            setForm(form1);
            // console.log(form1)
        },
        onValidate: (validationResult: ValidateResult) => {
            // console.log(validationResult)
        },
        messages: [
            {code: VALIDATOR_CODES.REQUIRED_FIELD, msg: 'This field is required please fill it.'},
            {code: VALIDATOR_CODES.NOT_EQUAL_TO, msg: 'This fields should have same value.'},
        ]
    };

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const tableSetting: TableDTO<TestType> = {
        onSelect: async (row) => {
            console.log('onSelect', row);
        },
        showContainer: false,
        unStackable: true,
        settings: [
            {
                type: 'text',
                fieldName: 'id',
                title: 'ID',
                width: 80
            }
            ,
            {
                type: 'boolean',
                fieldName: 'isEditable',
                title: 'isEditable',
                width: 30
            },
            {
                type: 'boolean',
                fieldName: 'isDeletable',
                title: 'isDeletable',
                width: 30
            },
            {
                type: 'float',
                fieldName: 'number1',
                title: 'number1',
                width: 120
            },
            {
                type: 'number',
                fieldName: 'number2',
                title: 'number2',
                width: 50
            },
            {
                type: 'text',
                fieldName: 'text1',
                title: 'text1',
                disableFilter: false,
                width: 200
            },
            {
                type: 'text',
                fieldName: 'text2',
                title: 'text2',
                width: 120
            }
        ],
        data: [ form ],
        inverted: true,
        color: 'red',
        centerData: false
    };

    return (
        <Wrapper>
            <PaddingBox size={ 20 }>
                <IconButton name={ 'moon' } onClick={ () => ThemeService.loadTheme('dark') }/>
                <IconButton name={ 'sun' } circular onClick={ () => ThemeService.loadTheme('light') }/>
            </PaddingBox>
            <div className={ 'px-div' }> Test Div</div>
            <FlexSpace padding={ 15 } dir={ dir }>
                <div> { languageWords ? languageWords.fields.name : '' }</div>
                <IconTextButton onClick={ () => ThemeService.loadTheme('light') } name={ 'sun' }>
                    { `${ languageWords ? languageWords.basic.theme : '' } ${ languageWords ? languageWords.basic.light : '' }` }
                </IconTextButton>
                <Button iconSetting={ {name: 'moon', labelPosition: 'left', attachToButton: true} }
                        onClick={ () => ThemeService.loadTheme('dark') } text={
                    `${ languageWords ? languageWords.basic.theme : '' } ${ languageWords ? languageWords.basic.dark : '' }`
                }/>
            </FlexSpace>
            <FlexCenter dir={ dir }>
                <Button text='Open Model' onClick={ () => setShowModal(true) }/>
            </FlexCenter>
            <MarginBox size={ 20 }>
                <FlexCenter>
                    { LanguageService.getComponent() }
                </FlexCenter>
            </MarginBox>
            <FlexSpace>
                <StringField value={ strValue } onChange={ (v) => setStrValue(v) }/>
                <ImageField onChange={ (imagePath, image) => {
                    setImage(image);
                } }/>
                <Image size={ 'small' } src={ image }/>
            </FlexSpace>
            {
                showModal ? (
                    <DialogForm
                        show={ showModal }
                        title={ 'Test Name' }
                        formSetting={ {
                            fields: formSettings.fields,
                            action: formSettings.action,
                            form: formSettings.form as any,
                            messages: formSettings.messages,
                        } }
                        onClose={ () => {
                            setShowModal(false);
                        } }
                        onDelete={ async (id: number) => {
                            console.log('onDelete: ' + id);
                            await delay(4000);
                            return {pass: true} as DialogFormActionResult;
                        } }
                        onSave={ async (newForm: any) => {
                            console.log('onSave: ', newForm);
                            await delay(1000);
                            setForm({...form, ...newForm});
                            return {pass: true} as DialogFormActionResult;
                        } }
                    />
                ) : null
            }
            <FlexSpace>
                <PTTable { ...tableSetting } />
            </FlexSpace>
        </Wrapper>
    );
}

export default connect((state: any, ownProps: any) => {
    return {...ownProps, user: state.user};
})(ComponentPPXPage);
