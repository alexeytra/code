import React from 'react';
import PropTypes from 'prop-types';
import MessageItem from './MessageItem';
import Scroller from './../../common/Scroller';
import DateUtils from '../../../../utils/dateUtils';
import debounce from 'lodash/debounce';
import Spinner from './../../common/Spinner';
import {getPeerId, peerEquals} from '../utils';

const isLastMessageMine = (messages) => {
	if (messages.length > 0) {
		const lastMessage = messages[(messages.length - 1)];
		return !!(lastMessage.flags & (1 << 0));
	}
	return false;
};

/**
 * Компонент - Список сообщений
 */
export default class MessageList extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.dimensions = null;
		this.isLoading = props.status === 'LOADING';
		this.loadMore = debounce(this.props.onLoadMore, 500);
	}

	static propTypes = {
		deletedMessage: PropTypes.array.isRequired,
		isEditing: PropTypes.bool.isRequired,
		messages: PropTypes.array.isRequired,
		messagesChangeReason: PropTypes.string,
		onChooseMessage: PropTypes.func.isRequired,
		onEditMessage: PropTypes.func.isRequired,
		onGetViewers: PropTypes.func.isRequired,
		onLoadMore: PropTypes.func.isRequired,
		onMessageReply: PropTypes.func.isRequired,
		onReadMessage: PropTypes.func.isRequired,
		peer: PropTypes.object.isRequired,
		status: PropTypes.string,
		uid: PropTypes.string.isRequired,
		unreadMessageId: PropTypes.number,
	};
	static defaultProps = {
		messages: [],
		deletedMessage: []
	};

	componentDidMount() {
		this.restoreScroll();
	}

	componentWillReceiveProps(nextProps) {
		if (!peerEquals(this.props.peer, nextProps.peer)) {
			this.dimensions = null;
			this.isLoading = false;
		} else {
			this.updateDimensions(this.refs.scroller.getDimensions());
		}
	}

	componentDidUpdate(prevProps) {
		const {dimensions, refs: {scroller}, props: {unreadMessageId, messagesChangeReason, messages, status}} = this;
		if (unreadMessageId && unreadMessageId !== prevProps.unreadMessageId) {
			if (this.refs.unread) {
				this.refs.scroller.scrollToNode(this.refs.unread);
			}
		} else {
			if (status !== 'LOADING') {
				if (messagesChangeReason === 'PUSH') {
					if (!dimensions || isLastMessageMine(messages)) {
						this.scrollToBottom();
					}
				} else if (messagesChangeReason === 'UNSHIFT') {
					this.isLoading = false;
					if (dimensions) {
						const nextDimensions = scroller.getDimensions();
						scroller.scrollTo(nextDimensions.scrollHeight - dimensions.scrollHeight);
					} else {
						this.scrollToBottom();
					}
				} else {
					this.restoreScroll();
				}
			}
		}
	}

	handleMouseMove = () => {
		this.props.onReadMessage()
	};

	handleResize = () => {
		const {dimensions, refs: {scroller}} = this;
		if (dimensions) {
			const ratio = dimensions.scrollTop / dimensions.scrollHeight;
			const nextDimensions = scroller.getDimensions();
			scroller.scrollTo(ratio * nextDimensions.scrollHeight);
			this.dimensions = nextDimensions;
		} else {
			scroller.scrollToBottom();
		}
	};
	handleScroll = () => {
		const {peer, messages, status} = this.props;
		const dimensions = this.refs.scroller.getDimensions();
		this.updateDimensions(dimensions);

		const scrollCoef = dimensions.offsetHeight / dimensions.scrollHeight;
		const coef = (dimensions.offsetHeight + dimensions.scrollTop) / dimensions.scrollHeight;

		if (status !== 'FULLY_LOADED' && status !== 'LOADING' && coef - scrollCoef <= 0.2) {
			this.loadMore({peerId: getPeerId(peer), offset: messages.length, limit: 50});
		}
	};
	replyToMessage = (messageId) => {
		const {onMessageReply} = this.props;
		this.scrollToBottom();
		return onMessageReply(messageId);
	};

	scrollToBottom() {
		this.dimensions = null;
		this.refs.scroller.scrollToBottom();
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
			scroller.scrollToBottom();
		}
	}

	renderHeader() {
		const {status} = this.props;
		if (status !== 'FULLY_LOADED') {
			return (
				<div className="p-around--large is-relative">
					<Spinner/>
				</div>
			);
		}
	}

	renderMessages() {
		const {messages, unreadMessageId, onGetViewers, onChooseMessage, deletedMessage, uid, onEditMessage, isEditing } = this.props;
		const result = [];

		let previousDate = null;
		let previousAuthor = null;

		for (let index = 0; index < messages.length; index++) {
			const message = messages[index];
			if (message.id === unreadMessageId) {
				result.push(
					<div className="divider" ref="unread" key="unread">
						<div className="text">
							Новые сообщения
						</div>
					</div>
				);
			}
			if (previousDate !== DateUtils.moment(message.date)
				.format('DD.MM.YYYY')) {
				previousDate = DateUtils.moment(message.date)
					.format('DD.MM.YYYY');
				previousAuthor = null;
				result.push(
					<div key={message.date} className="divider">
						<div className="text">
							{DateUtils.moment(message.date)
								.format('DD MMMM YYYY')}
						</div>
					</div>
				);
			}
			result.push(<MessageItem
				key={message.id} choosed={deletedMessage.includes(message.id)} message={message} isShort={previousAuthor === message.from}
				onGetViewers={onGetViewers} onMessageReply={this.replyToMessage} onChooseMessage={onChooseMessage} uid={uid} onEditMessage={onEditMessage} isEditing={isEditing}/>);
			previousAuthor = message.from;

		}
		return result;
	}

	render() {
		return (
			<section className="dialog__messages" onMouseMove={this.handleMouseMove}>
				<Scroller className="dialog__messsages_list" ref="scroller" onScroll={this.handleScroll} onResize={this.handleResize}>
					{this.renderHeader()}
					{this.renderMessages()}
				</Scroller>
			</section>
		);
	}
}