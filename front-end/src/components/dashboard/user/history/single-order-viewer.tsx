import { Wrapper } from "../../../shared/wrapper";
import './order-history.css';
import React, { useEffect, useState } from "react";
import { userOrderService } from "../../../../services/service-config";
import { useLanguage } from "../../../../lib/hooks/languageHook";
import { OrderDTO } from "../../../../models/game";
import { useLoader } from "../../../../lib/hooks/generic";
import { FlexBox, FlexCenter, FlexSpace, If } from "../../../../lib/components/containers";
import { Divider, Form, Header, Icon, Rating, Segment } from "semantic-ui-react";
import { EntityService } from "../../../../lib/services/entity-service/entity-service";
import { BaseRouteComponentProps } from "../../../../lib/components/components";
import { NotFoundWidget } from "../../../errors/not-found-404";
import { costFormat, isNull } from "../../../../lib/utils/utils";
import { TextArea } from "../../../../lib/components/form/fields";
import { Button, Link } from "../../../../lib/components/basic";
import { URL_ROUTES } from "../../../../routes";

export function SingleOrderHistory(props: BaseRouteComponentProps) {
    const orderId: number | null = props.match.params.orderId
    && !isNaN(Number(props.match.params.orderId)) ? Number(props.match.params.orderId) : null;
    const [ order, setOrder ] = useState<OrderDTO | null>(null);
    const loader = useLoader();
    const {words, dir} = useLanguage();
    const [ isNotFoundPage, setNotFoundPage ] = useState<boolean>(isNull(orderId));
    useEffect(() => {
        if (!order && !isNotFoundPage) {
            loader.activate();
            ( new EntityService<OrderDTO>(userOrderService).find() as Promise<OrderDTO[] | undefined> ).then(data => {
                const userOrder = data?.filter(ord => ord.id === orderId)?.[0];
                if (userOrder) {
                    setOrder(userOrder);
                    setReviewForm({
                        review_star: userOrder.review_star ? userOrder.review_star : 0,
                        review_description: userOrder.review_description ? userOrder.review_description : ''
                    });
                } else {
                    setNotFoundPage(true);
                }
                loader.disabled();
            });
        }
    });
    const downloadTxtFile = () => {
        if (order?.order_keys) {
            const element = document.createElement("a");
            const file = new Blob(order?.order_keys.map((k, index) => 'key'
                + ( index + 1 ) + '\n' + k.description + '\n'), {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = "keys.txt";
            document.body.appendChild(element);
            element.click();
        }
    }

    const icon = order?.state === 'C' ? 'check circle' : ( order?.state === 'E' ? 'info circle' : 'cog' );
    const color = order?.state === 'C' ? 'green' : ( order?.state === 'E' ? 'red' : 'grey' );
    const [ reviewForm, setReviewForm ] = useState({
        review_star: order?.review_star ? order?.review_star : 0,
        review_description: order?.review_description ? order?.review_description : ''
    });
    const isReviewDisabled = order?.state !== 'C' || order.review_star > 0;
    return (
        <Wrapper loading={ loader.isLoading } icon={ 'clipboard' }
                 title={ words.entities.order.orderHistory }
                 subTitleChildren={ <Link
                     to={ URL_ROUTES.USER.ORDER_HISTORY }>{ words.entities.order.orderHistory }</Link> }
                 showSubMenu>
            <If flag={ isNotFoundPage && !loader.isLoading }>
                <NotFoundWidget/>
            </If>
            {
                !!order ?
                    (
                        <FlexBox dir={ dir } flexDirection={ 'column' } pxIf={ !!order }>
                            <FlexBox dir={ dir } className={ 'order-status-box' }>
                                <FlexCenter flexDirection={ 'column' } className={ 'order-status' }>
                                    <Icon color={ color as any } name={ icon }/>
                                    <Header className={ 'px-non-margin' } as={ 'h3' }>
                                        { ( words.entities.order.stateMap as any )[order.state] }
                                    </Header>
                                </FlexCenter>
                                <FlexBox warp padding={ 20 } className={ 'order-data' }>
                                    <Form.Field>
                                        <label
                                            className={ 'global-f order-data-label' }>{ words.entities.order.orderId }</label>
                                        <Header
                                            className={ 'global-f px-non-margin' }>{ order.id.toPrecision(8).split('.').reverse().join('') }</Header>
                                    </Form.Field>
                                    <Form.Field>
                                        <label
                                            className={ 'global-f order-data-label' }>{ words.entities.order.orderDate }</label>
                                        <Header
                                            className={ 'global-f px-non-margin' }>{ new Date(order.create).toLocaleDateString() }</Header>
                                    </Form.Field>
                                    <Form.Field>
                                        <label
                                            className={ 'global-f order-data-label' }>{ words.entities.order.quantity }</label>
                                        <Header
                                            className={ 'global-f px-non-margin' }>{ order.quantity.toPrecision(order.quantity > 999 ? 6 : 3)
                                            .split('.').reverse().join('') }</Header>
                                    </Form.Field>
                                    <Form.Field>
                                        <label
                                            className={ 'global-f order-data-label' }>{ words.entities.order.cost }</label>
                                        <Header
                                            className={ 'global-f px-non-margin' }>{ `$${ Number(costFormat(order.cost)).toFixed(2) }` }</Header>
                                    </Form.Field>
                                    <If flag={ order.account_id }>
                                        <Form.Field>
                                            <label
                                                className={ 'global-f order-data-label' }>{ words.entities.order.account_id }</label>
                                            <Header
                                                className={ 'global-f px-non-margin' }>{ order.account_id }</Header>
                                        </Form.Field>
                                    </If>
                                    <If flag={ !!order.extra_info }>
                                        <Form.Field>
                                            <label
                                                className={ 'global-f order-data-label' }>{ words.entities.order.extra_info }</label>
                                            <Header
                                                className={ 'global-f px-non-margin' }>{ order.extra_info }</Header>
                                        </Form.Field>
                                    </If>
                                    <If flag={ !!order.error_msg && order.state === 'E' }>
                                        <Form.Field>
                                            <label
                                                className={ 'global-f order-data-label' }>{ words.entities.order.error_msg }</label>
                                            <h4
                                                className={ 'global-f px-non-margin red-text' }>{ order.error_msg }</h4>
                                        </Form.Field>
                                    </If>
                                </FlexBox>
                            </FlexBox>
                            <Divider hidden/>
                            <FlexCenter flexDirection={ 'column' }>
                                <If flag={ order.review_star && order.review_star > 0 }>
                                    <Rating
                                        disabled={ isReviewDisabled }
                                        icon='star'
                                        size='massive'
                                        rating={ reviewForm.review_star }
                                        maxRating={ 5 }
                                    />
                                </If>
                                <If flag={ !order.review_star || order.review_star < 1 }>
                                    <Rating
                                        disabled={ isReviewDisabled }
                                        icon='star'
                                        size='massive'
                                        rating={ reviewForm.review_star }
                                        onRate={ (event, data) => {
                                            if (!isReviewDisabled) {
                                                setReviewForm({...reviewForm, review_star: Number(data.rating)});
                                            }
                                        } }
                                        maxRating={ 5 }
                                    />
                                    <Divider hidden/>
                                    <Form>
                                        <Form.Field>
                                            <TextArea
                                                value={ reviewForm.review_description }
                                                onChange={ (value) => {
                                                    if (!isReviewDisabled) {
                                                        setReviewForm({...reviewForm, review_description: value});
                                                    }
                                                } }
                                            />
                                        </Form.Field>
                                    </Form>
                                    <Divider hidden/>
                                    <If flag={ order.review_star < 1 && order.state === 'C' }>
                                        <Button
                                            onClick={ () => {
                                                if (!( isReviewDisabled || loader.isLoading || reviewForm.review_star < 1 )) {
                                                    loader.activate();
                                                    new EntityService(userOrderService).updateEntity(order.id, {
                                                        ...reviewForm,
                                                        review_date: new Date(Date.now()).toLocaleDateString()
                                                    }).then(r => {
                                                        if (r) {
                                                            new EntityService(userOrderService).reload().then(() => {
                                                                setOrder(null);
                                                                loader.disabled();
                                                            });
                                                        }
                                                    });
                                                }
                                            } }
                                            loading={ loader.isLoading }
                                            disabled={ isReviewDisabled || loader.isLoading || reviewForm.review_star < 1 }
                                            color={ 'yellow' }
                                            text={ words.entities.order.actions.review }
                                            iconSetting={ {
                                                name: 'star',
                                                labelPosition: 'left',
                                                attachToButton: true
                                            } }
                                        />
                                    </If>
                                </If>
                            </FlexCenter>
                            <FlexBox pxIf={ order.game_card && order.order_keys && order.order_keys.length > 0 }>
                                <Divider hidden/>
                                <Segment.Group className={ 'order-keys-container' }>
                                    <Segment>
                                        <FlexSpace>
                                            <Header> { words.entities.order.orderKeys }</Header>
                                            <Button
                                                onClick={ () => {
                                                    downloadTxtFile();
                                                } }
                                                color={ 'green' }
                                                text={ words.entities.order.download }
                                                iconSetting={ {
                                                    name: 'download',
                                                    labelPosition: 'left',
                                                    attachToButton: true
                                                } }
                                            />
                                        </FlexSpace>

                                    </Segment>
                                    <Segment>
                                        {
                                            order.order_keys.map((key, index) => {
                                                return (
                                                    <Segment.Group key={ key.id }>
                                                        <Segment>{ words.entities.order.key + ' ' + ( index + 1 ) }</Segment>
                                                        <Segment.Group>
                                                            <Segment>
                                                                { key.description.split('\n').map((line, index) => {
                                                                    return <p key={ index }>{ line }</p>
                                                                }) }
                                                            </Segment>
                                                        </Segment.Group>
                                                    </Segment.Group>
                                                );
                                            })
                                        }
                                    </Segment>
                                </Segment.Group>
                            </FlexBox>
                        </FlexBox>
                    ) : null
            }
        </Wrapper>
    );
}

export default SingleOrderHistory;