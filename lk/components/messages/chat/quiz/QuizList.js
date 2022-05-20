import React from 'react';
import PropTypes from 'prop-types';
import {chatSort} from '../../utils';
import Scroller from '../../../common/Scroller';
import Quiz from './Quiz';

/**
 * Компонент - Список опросов
 */
export default class QuizList extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.dimensions = null;
		this.isLoading = false;
	}

	static propTypes = {
		chats: PropTypes.array.isRequired,
		getQuiz: PropTypes.func.isRequired,
		getUserNotAnswer:PropTypes.func.isRequired,
		getUserResults:PropTypes.func.isRequired,
		hasMoreChats: PropTypes.bool.isRequired,
		loading: PropTypes.bool,
		loadingQuizResult: PropTypes.bool,
		onGetChatFull: PropTypes.func.isRequired,
		onGetViewers: PropTypes.func.isRequired,
		onHandleConfirm: PropTypes.func.isRequired,
		onLoadMore: PropTypes.func.isRequired,
		onReadMessage: PropTypes.func,
		onSendResult: PropTypes.func,
		onSendViewed: PropTypes.func,
		quiz: PropTypes.object,
		uid: PropTypes.string.isRequired,
		updateUserResult: PropTypes.func,
		userNotAnswer: PropTypes.object,
		userResult: PropTypes.object,
	};

	static defaultProps = {
		chats: [],
		onLoadMore: () => {
		}
	};

	componentDidMount() {
		this.restoreScroll();
	}

	componentWillReceiveProps() {
		this.updateDimensions(this.refs.scroller.getDimensions());
	}

	loadMore = () => {
		const {chats, onLoadMore} = this.props;
		onLoadMore({type: 'QUIZ', offset: chats.length, limit: 25}).then(() => this.isLoading = false);
	};

	onScroll = () => {
		const {isLoading, props: {hasMoreChats}} = this;
		const dimensions = this.refs.scroller.getDimensions();
		const coef = (dimensions.offsetHeight + dimensions.scrollTop) / dimensions.scrollHeight;
		if (!isLoading && hasMoreChats && coef > 0.6) {
			this.isLoading = true;
			this.loadMore();
		}
	};

	onResize = () => {
		const {dimensions, refs: {scroller}} = this;
		if (dimensions) {
			const ratio = dimensions.scrollTop / dimensions.scrollHeight;
			const nextDimensions = scroller.getDimensions();
			scroller.scrollTo(ratio * nextDimensions.scrollHeight);
			this.dimensions = nextDimensions;
		} else {
			scroller.scrollToTop();
		}
	};

	scrollToBottom() {
		this.dimensions = null;
		this.refs.scroller.scrollToBottom();
	}

	scrollToTop() {
		this.dimensions = null;
		this.refs.scroller.scrollToTop();
	}

	updateDimensions(dimensions) {
		if (dimensions.scrollHeight === dimensions.scrollTop + dimensions.offsetHeight) {
			this.dimensions = null;
		} else {
			this.dimensions = dimensions;
		}
	}

	restoreScroll() {
		const {dimensions, refs: {scroller}} = this;
		if (dimensions) {
			scroller.scrollTo(dimensions.scrollTop);
		} else {
			scroller.scrollToTop();
		}
	}

	render() {
		const {uid, chats, quiz} = this.props;
		return (
			<Scroller ref="scroller" onScroll={this.onScroll} onResize={this.onResize}>
				{chats.sort(chatSort).map(chat => <Quiz
					uid={uid} key={chat.id} chat={chat} quiz={quiz}
					onGetChatFull={this.props.onGetChatFull}
					onGetViewers={this.props.onGetViewers}
					onReadMessage={this.props.onReadMessage}
					getQuiz={this.props.getQuiz}
					getUserNotAnswer={this.props.getUserNotAnswer}
					getUserResults={this.props.getUserResults}
					onHandleConfirm={this.props.onHandleConfirm}
					onSendResult ={this.props.onSendResult}
					onSendViewed ={this.props.onSendViewed}
					loading = {this.props.loading}
					loadingQuizResult = {this.props.loadingQuizResult}
					updateUserResult={this.props.updateUserResult}
					userResult={this.props.userResult}
					userNotAnswer={this.props.userNotAnswer}/>)}
			</Scroller>
		);
	}

}