import './footer.css';
import React from "react";
import { connect } from "react-redux";
import { StoreState } from "../../../lib/models/application";
import { HomeDTO } from "../../../models/home-details";
import { useLanguage } from "../../../lib/hooks/languageHook";
import { getEnumFromList } from "../../../lib/utils/utils";
import { Button, Icon } from "semantic-ui-react";
import { FlexBox, FlexSpace, Space } from "../../../lib/components/containers";
import { Link } from "../../../lib/components/basic";
import { URL_ROUTES } from "../../../routes";
import { useWindow } from "../../../lib/hooks/screen-change";


function Footer({home}: { home: HomeDTO }) {
	const {words} = useLanguage();
	const {isMobile} = useWindow();
	const enums = home?.enums ? home.enums : [];
	const email = getEnumFromList(enums, '[Footer] Email')?.data;
	const phoneNumber = getEnumFromList(enums, '[Footer] Phone Number')?.data;
	const address1 = getEnumFromList(enums, '[Footer] Address 1')?.data;
	const address2 = getEnumFromList(enums, '[Footer] Address 2')?.data;
	const address3 = getEnumFromList(enums, '[Footer] Address 3')?.data;
	const facebookUrl = getEnumFromList(enums, '[Footer] Facebook URL')?.data;
	const twitterUrl = getEnumFromList(enums, '[Footer] Twitter URL')?.data;
	const instagramUrl = getEnumFromList(enums, '[Footer] Instagram URL')?.data;
	const googleUrl = getEnumFromList(enums, '[Footer] Google URL')?.data;
	const youtubeUrl = getEnumFromList(enums, '[Footer] YouTube URL')?.data;
	const list = [
		youtubeUrl ? (
			<a key={ 1 } rel={ 'noopener noreferrer' } target={ '_blank' } href={ youtubeUrl }><Button
				circular
				color='youtube'
				icon='youtube'/></a>
		) : null,
		facebookUrl ? (
			<a key={ 2 } rel={ 'noopener noreferrer' } target={ '_blank' } href={ facebookUrl }><Button
				circular
				color='facebook'
				icon='facebook'/></a>
		) : null,
		twitterUrl ? (
			<a
				key={ 3 }
				rel={ 'noopener noreferrer' }
				target={ '_blank' }
				href={ twitterUrl }
			><Button
				circular
				color='twitter'
				icon='twitter'/></a>
		) : null,
		instagramUrl ? (
			<a key={ 4 } rel={ 'noopener noreferrer' } target={ '_blank' } href={ instagramUrl }><Button
				circular
				color='linkedin'
				icon='linkedin'/></a>
		) : null,
		googleUrl ? (
			<a key={ 5 } rel={ 'noopener noreferrer' } target={ '_blank' } href={ googleUrl }><Button circular
			                                                                                          color='google plus'
			                                                                                          icon='google plus'/></a>
		) : null
	].filter(row => !!row);
	return (
		<div className='px-nav-down'>
			<FlexBox warp flexDirection={ isMobile ? 'column' : 'row' }
			         justifyContent={ isMobile ? 'center' : 'space-between' }
			         alignItems={ isMobile ? 'center' : undefined }>
				<div className={ 'footer-contact fix-s links-padding-fot-con' }>
					<h3><Space/><Icon name={ 'rocket' }/><Space/>{ words.footer.fastAccess }</h3>
					<div className={ 'footer-contact-items' }>
						<Link to={ URL_ROUTES.HOME }>
							<h4>{ words.footer.homePage } </h4>
						</Link>
						<Link to={ URL_ROUTES.SEARCH + '/game' }>
							<h4> { words.footer.game } </h4>
						</Link>
						<Link to={ URL_ROUTES.SEARCH + '/accessory' }>
							<h4> { words.footer.accessories } </h4>
						</Link>
						<Link to={ URL_ROUTES.SEARCH + '/embed-game' }>
							<h4> { words.footer.playGameForFree } </h4>
						</Link>
					</div>
				</div>
				{ email || phoneNumber || address1 || address2 || address3 ?
					(
						<div className={ 'footer-contact fix-s' }>
							<h3><Space/><Icon name={ 'paper plane' }/><Space/>{ words.footer.contacts }</h3>
							<div className={ 'footer-contact-items' }>
								{
									phoneNumber ? <h4><Icon name={ 'phone square' }/> { phoneNumber } </h4> : null
								}
								{
									email ? <h4><Icon name={ 'mail' }/> { email } </h4> : null
								}
								{
									address1 ? <h4><Icon name={ 'map marker alternate' }/> { address1 } </h4> : null
								}
								{
									address2 ? <h4><Icon name={ 'map marker alternate' }/> { address2 } </h4> : null
								}
								{
									address3 ? <h4><Icon name={ 'map marker alternate' }/> { address3 } </h4> : null
								}
							</div>
						</div>
					) : null
				}
				{
					list ? (
						<div className={ 'footer-contact footer-contact-link-button' }>
							<div>
								{ list && list.length > 1 ? list : null }
							</div>
						</div>
					) : null
				}
			</FlexBox>
			<div className={ 'n-d-bottom' }>
				<FlexSpace>
					<h6>
						{ words.footer.rules }
					</h6>
				</FlexSpace>
				<div>
				
				</div>
			</div>
		</div>
	);
}

export default connect((state: StoreState, ownProps) => {
	return {...ownProps, user: state.user, home: state.entity['home'] ? state.entity['home'] : null};
})(Footer as any);
