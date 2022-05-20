import React from 'react';
import PropTypes from 'prop-types';
import {chatSort} from '../utils';
import MyAnnouncement from './MyAnnouncement';
import Scroller from '../../common/Scroller';

/**
 * Компонент - Список моих объявлений
 */
export default class MyAnnouncementList extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.dimensions = null;
		this.isLoading = false;
	}

	static propTypes = {
		chats: PropTypes.array.isRequired,
		hasMoreChats: PropTypes.bool.isRequired,
		onDeleteMyAnnouncement: PropTypes.func.isRequired,
		onGetChatFull: PropTypes.func.isRequired,
		onGetConfirmFull: PropTypes.func.isRequired,
		onGetViewers: PropTypes.func.isRequired,
		onLoadMore: PropTypes.func.isRequired,
		onReadMessage: PropTypes.func,
		uid: PropTypes.string.isRequired,
	};

	static defaultProps = {
		chats: [],
		onLoadMore: () => {}
	};

	componentDidMount() {
		this.restoreScroll();
	}

	componentWillReceiveProps() {
		this.updateDimensions(this.refs.scroller.getDimensions());
	}

	loadMore = () => {
		const {chats, onLoadMore} = this.props;
		onLoadMore({type: 'MYANNOUNCEMENT', offset: chats.length, limit: 25}).then(() => this.isLoading = false);
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
		const {uid, chats} = this.props;

		return (
			<Scroller ref="scroller" onScroll={this.onScroll} onResize={this.onResize}>
				{chats.sort(chatSort).map(chat => <MyAnnouncement
					uid={uid}
					key={chat.id}
					chat={chat}
					onGetChatFull={this.props.onGetChatFull}
					onGetViewers={this.props.onGetViewers}
					onGetConfirmFull = {this.props.onGetConfirmFull}
					onDelete={true}
					onReadMessage={this.props.onReadMessage}
					onDeleteMyAnnouncement={this.props.onDeleteMyAnnouncement}/>)}
			</Scroller>
		);
	}
}