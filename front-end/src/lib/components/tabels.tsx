import '../assets/custome/table.css';
import React from 'react';
import { BaseComponent, BaseComponentProps, BaseComponentState } from "./components";
import { FlexBox, FlexSpace, If, PaddingBox } from "./containers";
import { Button, IconButton, LinkButton } from "./basic";
import { Dropdown, Header, Icon, Label, Pagination, Rating, SemanticCOLORS, Table as STable } from "semantic-ui-react";
import { buildCN, costFormat, getFieldValueFromRow, isEmpty, pxIf } from "../utils/utils";
import { generateTableOptions } from "../utils/constant";
import { BaseEntity } from "../models/base";


export interface TableSetting {
    width: number;
    title: string;
    fieldName: string;
    disableFilter?: boolean;
    type: 'text' | 'formattedNumber' | 'number' | 'float' | 'date' | 'time'
        | 'dateTime' | 'boolean' | 'link' | 'button' | 'rating' | 'valueMap' | 'balance'
        | 'buttonLink' | 'label' | 'iconButton' | 'editButton' | 'deleteButton' | 'viewButton';
    valueMap?: any;
    displayValue?: (value: any) => JSX.Element | null;
    onClick?: (row: any) => void;
    subSetting?: {
        buttonText?: string;
        buttonIcon?: string;
        linkText?: string;
    },
    center?: boolean;
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
    selectedId?: number ;
}

export interface TableState extends BaseComponentState {
    selectedPageSize: number;
    pageNumber: number;
    filters: any[];
    loadingRefresh?: boolean;
}

export class Table<EntityDTO extends BaseEntity> extends BaseComponent<TableDTO<EntityDTO>, TableState> {

    tableOptions: any[];

    constructor(props: TableDTO<EntityDTO>) {
        super(props);
        this.state = {
            ...this.state,
            selectedPageSize: 15,
            pageNumber: 1,
            filters: []
        }
        this.tableOptions = [];
    }

    destroy(): void {
    }

    initialize(): void {
        this.tableOptions = generateTableOptions();
    }

    show(props: TableDTO<EntityDTO>, state: TableState): JSX.Element | null {
        const tableRows = this.renderTableData();
        return (
            <div className={ 'px-t-table' }>
                <FlexSpace padding={ 10 } className={ 't-header' } pxIf={ props.showContainer } dir={ state.direction }>
                    <If flag={ props.onRefresh }>
                        <div dir={ state.direction }>
                            <IconButton
                                color={ 'black' }
                                size={ 'mini' }
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
                <div className={ 'px-t-table-container t-container' }>
                    <STable inverted={ props.inverted } selectable={ props.selectable } striped
                            color={ props.color ? props.color as any : 'grey' }
                            className={ buildCN(props.unStackable ? 'unstackable' : '', 'px-t-non-margin') }>
                        { this.renderTableHeader() }
                        <If flag={ !isEmpty(tableRows) }>
                            <STable.Body>
                                { tableRows }
                            </STable.Body>
                        </If>
                    </STable>
                    <If flag={ isEmpty(tableRows) }>
                        <PaddingBox size={ 10 }>
                            <Header as={ 'h3' }
                                    className={ 'px-non-margin center-text' }>{ this.word().basic.noDataToView }</Header>
                        </PaddingBox>
                    </If>
                </div>
                <FlexSpace padding={ 10 } pxIf={ props.showContainer } className={ 't-bottom' }>
                    <FlexBox alignItems={ 'center' } justifyContent={ 'center' } dir={ state.direction }>
                        <div key={ 2 }
                             className='px-t-header'>{ state.word.basic.pageSize }</div>
                        <Dropdown
                            key={ 1 }
                            value={ state.selectedPageSize }
                            compact
                            selection
                            onChange={ (e, {name, value}) => this.setState({
                                selectedPageSize: Number(value),
                                pageNumber: 1
                            }) }
                            options={ this.tableOptions }/>
                    </FlexBox>
                    <If flag={ Math.floor(( this.props.data.length / Number(this.state.selectedPageSize) + 0.5 )) > 0 }>
                        <Pagination
                            onPageChange={
                                (e, {activePage}) =>
                                    this.setState({pageNumber: Number(activePage)})
                            }
                            className='px-t-pagination'
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
            <STable.Header>
                <STable.Row>
                    {
                        this.props.settings
                            ? this.props.settings.map((s, index) =>
                                this.renderHeaderRow(s, index)) : null
                    }
                </STable.Row>
            </STable.Header>
        );
    }

    renderHeaderRow = (setting: TableSetting, index: number) => {
        return (
            <th key={ index } className='px-t-table-header'
                style={ {width: setting.width, minWidth: setting.width} }>
                <FlexBox alignItems={ 'center' }
                         justifyContent={ setting.center ? "center" : 'space-between' }>
                    <h4 className={ buildCN('px-t-non-margin', pxIf(setting.center, "center-text", '')) }>{ setting.title }</h4>
                    {/* this.renderFilter(data)*/ }
                </FlexBox>
            </th>
        );
    }

    renderCellRow = (cellData: EntityDTO, index: number) => {
        return (
            <STable.Row
                className='px-t-pointer'
                key={ cellData.id }
                active={ `${ this.props.selectedId }` === `${ cellData.id }` }
                onClick={ () => {
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
                                    displayValue = value ? this.word().basic.yes : this.word().basic.no;
                                    break;
                                case "date":
                                    displayValue = !value ? '' : new Date(value).toLocaleDateString();
                                    break;
                                case "time":
                                    displayValue = !value ? '' : new Date(value).toLocaleTimeString();
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
                                case "balance":
                                    displayValue = !value ? '' : `$${ costFormat(value) }`;
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
                                    if(value) {
                                        displayValue = (
                                            <Button
                                                onClick={ () => {
                                                    if (setting.onClick) {
                                                        setting.onClick(cellData);
                                                    }
                                                } }
                                                text={ setting.subSetting?.buttonText }
                                            />
                                        );
                                    }
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
                                case "viewButton":
                                    displayValue = (
                                        <IconButton
                                            name={ 'eye' }
                                            size={'mini'}
                                            color={'black'}
                                            onClick={ () => {
                                                if (setting.onClick) {
                                                    setting.onClick(cellData);
                                                }
                                            } }
                                        />
                                    );
                                    break;
                                case "link":
                                    if (!value) {
                                        displayValue = '';
                                    } else {
                                        displayValue = (
                                            <a
                                                dir={this.state.direction}
                                                target={'_blank' as any}
                                                href={ value }
                                            >
                                                { setting.subSetting ? setting.subSetting.linkText : this.state.word.basic.show }
                                            </a>
                                        );
                                    }
                                    break;
                                case "buttonLink":
                                    if (!value) {
                                        displayValue = '';
                                    } else {
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
                                    }
                                    break;
                            }
                        }
                        return (
                            <STable.Cell direction={this.state.direction} key={ `id__${ cellData.id }_${ index2 }` }
                                         style={ {width: setting.width, minWidth: setting.width} }
                                         className={ buildCN(setting.center ? 'center-text' : '') }>
                                <div dir={this.state.direction}>
                                    { displayValue }
                                </div>
                            </STable.Cell>
                        );
                    }) : null
                }
            </STable.Row>
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


