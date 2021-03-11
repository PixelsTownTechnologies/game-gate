import './sub-menu.css';
import { Header, Image, Label, Menu as SMenu } from "semantic-ui-react";
import React from "react";
import Avatar from "../../../assets/icons/avatar.png";
import { FlexBox} from "../../../lib/components/containers";
import { costFormat } from "../../../lib/utils/utils";
import { useLanguage } from "../../../lib/hooks/languageHook";
import { UserDTO } from "../../../models/user";
import { useEntityStore } from "../../../lib/hooks/user";
import { useWindow } from "../../../lib/hooks/screen-change";

export function SubMenu() {
    const user = useEntityStore<UserDTO>('user');
    const {dir, words} = useLanguage();
    const {isComputer} = useWindow();
    if (!user) {
        return null;
    }
    return (
        <SMenu vertical className={ 'sub-menu' }>
            <SMenu.Item>
                <div className={ 'sm-profile-icon' }>
                    <Image src={ Avatar }/>
                    <FlexBox flexDirection={ 'column' } justifyContent={ 'flex-start' }
                             pxIf={ isComputer }>
                        <Header className={ 'global-f px-non-margin' }
                                as={ 'h4' }>{ user.username }</Header>
                    </FlexBox>
                </div>
            </SMenu.Item>
            <SMenu.Item dir={ dir } className={ 'global-f' }>
                <Label className={ 'global-f' } color='teal'>${ costFormat(user.balance) }</Label>
                { words.userFields.balance }
            </SMenu.Item>
            <SMenu.Item dir={ dir } className={ 'global-f' }>
                <Label className={ 'global-f' } color='red'>{ costFormat(user.points) }</Label>
                { words.entities.user.points }
            </SMenu.Item>
            <SMenu.Item dir={ dir } className={ 'global-f' }>
                <Label className={ 'global-f' } color='grey'>{ costFormat(user.total_orders) }</Label>
                { words.entities.user.numberOfOrders }
            </SMenu.Item>
        </SMenu>
    );
}