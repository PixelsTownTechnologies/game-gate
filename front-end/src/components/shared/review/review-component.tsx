import './review-component.css';
import React from "react";
import { ReviewDTO } from "../../../models/game";
import { Button, Divider, Icon, Rating } from "semantic-ui-react";
import { useLanguage } from "../../../lib/hooks/languageHook";
import { buildCN, costFormat, isEmpty } from "../../../lib/utils/utils";
import { FlexBox } from "../../../lib/components/containers";
import { DIR } from "../../../lib/utils/constant";


export function Review({review}: { review: ReviewDTO }) {
	const {words, dir} = useLanguage();
	const reviewWordMap = {
		5: words.reviews.amazing,
		4: words.reviews.veryGood,
		3: words.reviews.good,
		2: words.reviews.notBad,
		1: words.reviews.bad,
	} as any;
	const defaultText = review.review_star ? reviewWordMap[review.review_star] : '';
	return (
		<div dir={ dir } className={ 'review-container' }>
			<div dir={ dir } className={ 'review-header' }>
				<h4> { review.owner.username } </h4>
				<h6> { new Date(review.review_date).toDateString().split(' ').slice(1, 55).join(' ') } </h6>
			</div>
			<div dir={ dir } className={ 'review-description' }>
				<div>
					<Rating
						disabled
						icon='star'
						size='large'
						rating={ review.review_star ? review.review_star : 0 }
						maxRating={ 5 }
					/>
				</div>
				<div>
					<p dir={ 'auto' }>{ isEmpty(review.review_description) ? defaultText : review.review_description }</p>
				</div>
			</div>
		</div>
	);
}


export function ReviewScrollCard(props: {
	reviews?: ReviewDTO[],
	title?: string, description?: string,
	showMoreURL?: string,
	headerClassName?: string,
	avgReview?: number,
	showAvg?: boolean
}) {
	const sectionRef = React.useRef<HTMLDivElement>(null);
	const language = useLanguage();
	return (
		<div className={ 'review-scroll-box' }>
			<FlexBox dir={ language.dir } flexDirection={ 'column' }
			         justifyContent={ 'flex-start' }>
				<FlexBox className={ 'review-scroll-title-section' } dir={ language.dir }>
					<h1 className={ props.headerClassName ? props.headerClassName : 'grey-text' }> { props.title ? props.title : '' } </h1>
					{
						props.showAvg ? (
							<div>
								<Rating maxRating={ 5 } disabled
								        defaultRating={ props.avgReview ? Math.floor(props.avgReview + 0.5) : 0 }
								        icon='star'
								        size='huge'/>
								<h4>{ props.avgReview ? costFormat(props.avgReview) : '0.0' }</h4>
							</div>
						) : null
					}
				</FlexBox>
				{
					props.description ?
						<h4 className={ buildCN('px-non-margin', ( props.headerClassName
							? props.headerClassName : 'grey-text' )) }>  { props.description } </h4>
						: null
				}
			</FlexBox>
			<Divider hidden/>
			
			{
				!isEmpty(props?.reviews) ? (
					<div className={ 'review-scroll-cc' }>
						<Button
							className={ 'review-scroll-button re-left' } icon
							onClick={
								() => {
									if (sectionRef.current) {
										sectionRef.current.scrollBy({behavior: 'smooth', left: -280});
									}
								}
							}>
							<Icon name='angle left'/>
						</Button>
						<div dir={ DIR.LTR } ref={ sectionRef } className={ 'review-scroll-container' }>
							{
								props?.reviews
									?.sort((r1, r2) =>
										new Date(r2.review_date).getTime() - new Date(r1.review_date).getTime())
									?.sort((r1, r2) => r2.review_star - r1.review_star)
									?.map((r, index) => {
										return <Review key={ index } review={ r }/>
									})
							}
						</div>
						<Button
							className={ 'review-scroll-button re-right' } icon
							onClick={
								() => {
									if (sectionRef.current) {
										sectionRef.current.scrollBy({behavior: 'smooth', left: 280});
									}
								}
							}>
							<Icon name='angle right'/>
						</Button>
					</div>
				) : (
					<div className={ 'review-scroll-cc' }>
						<h1 className={ ( props.headerClassName
							? props.headerClassName : 'grey-text' ) + ' text-align-c' }> { language.words.reviews.noReviews } </h1>
					</div>
				)
			}
		</div>
	);
}