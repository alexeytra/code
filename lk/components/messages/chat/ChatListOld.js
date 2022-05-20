import React from 'react';
import PropTypes from 'prop-types';
import Chat from './Chat';
import Announcement from './Announcement';
import Scroller from './../../common/Scroller';
import {chatSort} from '../utils';

/**
 * Компонент - Список чатов
 */
export default class ChatListOld extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.dimensions = null;
		this.isLoading = false;
	}

	static propTypes = {
		chatType: PropTypes.string.isRequired,
		chats: PropTypes.array.isRequired,
		hasMoreChatsDialogs: PropTypes.bool.isRequired,
		onGetChatFull: PropTypes.func.isRequired,
		onGetViewers: PropTypes.func.isRequired,
		onLoadMore: PropTypes.func.isRequired,
		onReadMessage: PropTypes.func,
		onSelectChat: PropTypes.func.isRequired,
		status: PropTypes.string.isRequired,
		uid: PropTypes.string.isRequired,
	};

	static defaultProps = {
		chats: [],
		chatType: 'DIALOGUE',
		onSelectChat: () => {},
		onLoadMore: () => {}
	};

	componentDidMount() {
		this.restoreScroll();
	}

	componentWillReceiveProps(nextProps) {
		this.updateDimensions(this.refs.scroller.getDimensions());
	}

	loadMore = () => {
		const {chatType, chats, onLoadMore} = this.props;
		onLoadMore({type: chatType, offset: chats.length, limit: 25}).then(() => this.isLoading = false);
	};

	onScroll = () => {
		const {isLoading, props: {hasMoreChatsDialogs}} = this;
		const dimensions = this.refs.scroller.getDimensions();
		const coef = (dimensions.offsetHeight + dimensions.scrollTop) / dimensions.scrollHeight;
		if (!isLoading && hasMoreChatsDialogs && coef > 0.6) {
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
		const {uid, chats, chatType} = this.props;
		return (
			<Scroller ref="scroller" onScroll={this.onScroll} onResize={this.onResize}>
				{chats.sort(chatSort).map(chat => {
					if (chatType === 'ANNOUNCEMENT') {
						return <Announcement uid={uid} key={chat.id} chat={chat} onGetChatFull={this.props.onGetChatFull} onGetViewers={this.props.onGetViewers} onReadMessage={this.props.onReadMessage}/>;
					}
					return <Chat key={chat.id + Math.random()} chat={chat} chatType={chatType} onSelectChat={this.props.onSelectChat}/>;
				})}
			</Scroller>
		);
	}
}