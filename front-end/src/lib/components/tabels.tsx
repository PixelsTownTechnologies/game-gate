import '../assets/custome/table.css';
import React from 'react';
import { BaseComponent, BaseComponentMethods, BaseComponentProps, BaseComponentState } from "./components";
import { FlexBox, FlexSpace, If } from "./containers";
import { Button, IconButton, LinkButton } from "./basic";
import { Dropdown, Icon, Label, Pagination, Rating, SemanticCOLORS, Table } from "semantic-ui-react";
import { classNameHelper, costFormat, getFieldValueFromRow } from "../utils/utils";
import { TABLE_OPTIONS } from "../utils/constant";
import { BaseEntity } from "../models/base";


export interface TableSetting {
    width: number;
    title: string;
    fieldName: string;
    disableFilter?: boolean;
    type: 'text' | 'formattedNumber' | 'number' | 'float' | 'date' | 'time'
        | 'dateTime' | 'boolean' | 'link' | 'button' | 'rating' | 'valueMap'
        | 'buttonLink' | 'label' | 'iconButton' | 'editButton' | 'deleteButton';
    valueMap?: any;
    displayValue?: (value: any) => JSX.Element | null;
    onClick?: (row: any) => void;
    subSetting?: {
        buttonText?: string;
        buttonIcon?: string;
    }
}

export interface TableDTO<EntityDTO extends BaseEntity> extends BaseComponentProps {
    settings: TableSetting[];
    data: EntityDTO[];
    centerData?: boolean;
    unStackable?: boolean;
    showContainer?: boolean;
    selectable?: boolean;
    inverted?: boolean;
    onSelect?: (row: EntityDTO) => void;
    onRefresh?: () => Promise<void>;
    color?:
        | SemanticCOLORS
        | 'facebook'
        | 'google plus'
        | 'vk'
        | 'twitter'
        | 'linkedin'
        | 'instagram'
        | 'youtube';
}

export interface TableState extends BaseComponentState {
    selectedPageSize: number;
    pageNumber: number;
    filters: any[];
    selectedRowKey?: any;
    loadingRefresh?: boolean;
}

export class PTTable<EntityDTO extends BaseEntity> extends BaseComponent<TableDTO<EntityDTO>, TableState> implements BaseComponentMethods<TableDTO<EntityDTO>, TableState> {

    constructor(props: TableDTO<EntityDTO>) {
        super(props);
        this.state = {
            ...this.state,
            selectedPageSize: 25,
            pageNumber: 1,
            filters: []
        }
    }

    destroy(): void {
    }

    initialize(): void {
    }

    show(props: TableDTO<EntityDTO>, state: TableState): JSX.Element | null {
        return (
            <div className={ 'px-table' }>
                <FlexSpace className={ 't-header' } pxIf={ props.showContainer } dir={ state.direction }>
                    <If flag={ props.onRefresh }>
                        <div dir={ state.direction }>
                            <IconButton
                                name={ 'refresh' }
                                loading={ state.loadingRefresh }
                                disabled={ state.loadingRefresh }
                                onClick={ () => {
                                    if (props.onRefresh) {
                                        this.setState({loadingRefresh: true});
                                        props.onRefresh().then(date => {
                                            this.setState({loadingRefresh: false});
                                        });
                                    }
                                } }
                            />
                        </div>
                    </If>
                    { this.props.children }
                </FlexSpace>
                <div className={ 'px-table-container' }>
                    <Table inverted={ props.inverted } selectable={ props.selectable } striped
                           color={ props.color ? props.color as any : 'grey' }
                           className={ classNameHelper('px-non-margin') }>
                        { this.renderTableHeader() }
                    </Table>
                    <Table inverted={ props.inverted } selectable={ props.selectable } striped
                           color={ props.color ? props.color as any : 'grey' }
                           className={ classNameHelper(props.unStackable ? 'un-stackable' : '', 'px-non-margin') }>
                        <Table.Body>
                            { this.renderTableData() }
                        </Table.Body>
                    </Table>
                </div>
                <FlexSpace pxIf={ props.showContainer } className={ 't-bottom' }>
                    <div/>
                    <div>
                        <div dir={ state.direction }>
                            <Dropdown
                                key={ 1 }
                                value={ state.selectedPageSize }
                                compact
                                selection
                                onChange={ (e, {name, value}) => this.setState({
                                    selectedPageSize: Number(value),
                                    pageNumber: 1
                                }) }
                                options={ TABLE_OPTIONS }/>
                            <div key={ 2 }
                                 className='px-header'>:{ state.word.basic.pageSize }</div>

                        </div>
                        <If flag={ Math.floor(( this.props.data.length / Number(this.state.selectedPageSize) + 0.5 )) > 0 }>
                            <Pagination
                                onPageChange={
                                    (e, {activePage}) =>
                                        this.setState({pageNumber: Number(activePage)})
                                }
                                className='px-pagination'
                                activePage={ this.state.pageNumber }
                                firstItem={ null }
                                lastItem={ null }
                                pointing
                                secondary
                                boundaryRange={ 0 }
                                siblingRange={ 0 }
                                totalPages={ Math.floor(( this.props.data.length / Number(this.state.selectedPageSize) + 0.5 )) }
                            />
                        </If>
                    </div>
                </FlexSpace>
            </div>
        );
    }

    renderTableData = () => {
        const props = this.props;
        const pageNumber = this.state.pageNumber;
        const NOIP = Number(this.state.selectedPageSize);
        const dataList = this.props.data.filter(row => {
            let flag = true;
            if (this.state.filters.length > 0) {
                Object.keys(row).forEach(key => {
                    if (this.state.filters.filter(f => f.fieldName === key).length > 0) {
                        let value = getFieldValueFromRow(row, key) ? getFieldValueFromRow(row, key) : '';
                        flag = flag && `${ value.toLowerCase() }`.includes(`${ this.state.filters.filter(f =>
                            f.fieldName === key)[0].value.toLowerCase() }`);
                    }
                });
            }
            return flag;
        });
        return !props.showContainer ? dataList.map(
            (cell, index) => this.renderCellRow(cell, index)) : dataList.slice(( pageNumber - 1 ) * NOIP, pageNumber * NOIP).map(
            (cell, index) => this.renderCellRow(cell, index));
    }

    renderTableHeader = () => {
        return (
            <Table.Header>
                <Table.Row>
                    {
                        this.props.settings
                            ? this.props.settings.map((s, index) =>
                                this.renderHeaderRow(s, index)) : null
                    }
                </Table.Row>
            </Table.Header>
        );
    }

    renderHeaderRow = (data: TableSetting, index: number) => {
        return (
            <th key={ index } className='px-table-header' style={ {width: `${ data.width }px !important`} }>
                <FlexBox width={ data.width } alignItems={ 'center' }
                         justifyContent={ this.props.centerData ? "center" : 'space-between' }>
                    <h5 className={ 'px-non-margin px-srp-10' }>{ data.title }</h5>
                    { this.renderFilter(data) }
                </FlexBox>
            </th>
        );
    }

    renderCellRow = (cellData: EntityDTO, index: number) => {
        return (
            <Table.Row
                className='px-pointer'
                key={ cellData.id }
                active={ `${ this.state.selectedRowKey }` === `${ cellData.id }` }
                onClick={ () => {
                    this.setState({selectedRowKey: cellData.id});
                    if (this.props.onSelect) {
                        this.props.onSelect(cellData);
                    }
                } }
            >
                {
                    this.props.settings ? this.props.settings.map((setting, index2) => {
                        let value = getFieldValueFromRow(cellData, setting.fieldName);
                        let displayValue = value;
                        const fieldType = setting.type;
                        if (setting.displayValue) {
                            displayValue = setting.displayValue(cellData);
                        } else {
                            switch (fieldType) {
                                case "boolean":
                                    displayValue = value ? 'Yes' : 'No';
                                    break;
                                case "date":
                                    displayValue = !value ? '' : new Date(value).toLocaleDateString();
                                    break;
                                case "time":
                                    displayValue = !value ? '' : new Date(value).toTimeString();
                                    break;
                                case "valueMap":
                                    const map = setting.valueMap ? setting.valueMap : {};
                                    displayValue = map[value] ? map[value] : '';
                                    break;
                                case "text" || "number":
                                    displayValue = !value ? '' : `${ value }`;
                                    break;
                                case "formattedNumber" || "float":
                                    displayValue = !value ? '' : `${ costFormat(value) }`;
                                    break;
                                case "dateTime":
                                    displayValue = !value ? '' : `${ new Date(value).toLocaleDateString() } - ${ new Date(value).toTimeString() }`;
                                    break;
                                case "label":
                                    const cellColor = value && value['color'] ? value['color'] : 'blue';
                                    const cellValue = value && value['value'] ? value['value'] : value;
                                    displayValue = cellValue ? (
                                        <Label color={ cellColor }>
                                            { cellValue }
                                        </Label>
                                    ) : null;
                                    break;
                                case "rating":
                                    displayValue = (
                                        <Rating
                                            disabled
                                            icon='star'
                                            size='large'
                                            rating={ value ? value : 0 }
                                            maxRating={ 5 }
                                        />
                                    );
                                    break;
                                case "button":
                                    displayValue = (
                                        <Button
                                            onClick={ () => {
                                                if (setting.onClick) {
                                                    setting.onClick(cellData);
                                                }
                                            } }
                                        />
                                    );
                                    break;
                                case "iconButton":
                                    displayValue = (
                                        <IconButton
                                            name={ setting.subSetting && setting.subSetting.buttonIcon
                                                ? setting.subSetting.buttonIcon : '' }
                                            onClick={ () => {
                                                if (setting.onClick) {
                                                    setting.onClick(cellData);
                                                }
                                            } }
                                        />
                                    );
                                    break;
                                case "editButton":
                                    displayValue = (
                                        <IconButton
                                            name={ 'edit' }
                                            onClick={ () => {
                                                if (setting.onClick) {
                                                    setting.onClick(cellData);
                                                }
                                            } }
                                        />
                                    );
                                    break;
                                case "deleteButton":
                                    displayValue = (
                                        <IconButton
                                            name={ 'trash' }
                                            color={ 'red' }
                                            onClick={ () => {
                                                if (setting.onClick) {
                                                    setting.onClick(cellData);
                                                }
                                            } }
                                        />
                                    );
                                    break;
                                case "buttonLink":
                                    displayValue = (
                                        <LinkButton
                                            url={ value }
                                            buttonSetting={ {
                                                onClick: () => {
                                                    if (setting.onClick) {
                                                        setting.onClick(cellData);
                                                    }
                                                }, text: setting.subSetting && setting.subSetting.buttonText
                                                    ? setting.subSetting.buttonText
                                                    : this.state.word.basic.link
                                            } }
                                        />
                                    );
                                    break;
                            }
                        }
                        return (
                            <Table.Cell key={ `id__${ cellData.id }_${ index2 }` }
                                        className={ classNameHelper(this.props.centerData ? 'px-center-text' : '') }>
                                <div style={ {width: setting.width} }>
                                    { displayValue }
                                </div>
                            </Table.Cell>
                        );
                    }) : null
                }
            </Table.Row>
        );
    }

    renderFilter = (setting: TableSetting) => {
        const tagOptions = [
            {
                key: 'Important',
                text: 'Important',
                value: 'Important'
            },
            {
                key: 'Announcement',
                text: 'Announcement',
                value: 'Announcement'
            },
            {
                key: 'Cannot Fix',
                text: 'Cannot Fix',
                value: 'Cannot Fix'
            },
            {
                key: 'News',
                text: 'News',
                value: 'News'
            },
            {
                key: 'Enhancement',
                text: 'Enhancement',
                value: 'Enhancement'
            },
            {
                key: 'Change Declined',
                text: 'Change Declined',
                value: 'Change Declined'
            }
        ]
        return (
            <Dropdown floating trigger={ <Icon size={ 'small' } name={ 'filter' }/> }>
                <Dropdown.Menu>
                    <Dropdown.Menu scrolling>
                        { tagOptions.map((option, index) => (
                            <Dropdown.Item { ...option } key={ index }/>
                        )) }
                    </Dropdown.Menu>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}


