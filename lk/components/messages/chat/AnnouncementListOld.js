import React from 'react';
import PropTypes from 'prop-types';
import {chatSort} from '../utils';
import Announcement from './Announcement';
import Scroller from '../../common/Scroller';

/**
 * Компонент - Список объявлений
 */
export default class AnnouncementListOld extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.dimensions = null;
		this.isLoading = false;
	}



	static propTypes = {
		chats: PropTypes.array.isRequired,
		hasMoreChats: PropTypes.bool.isRequired,
		onGetChatFull: PropTypes.func.isRequired,
		onGetViewers: PropTypes.func.isRequired,
		onHandleConfirm: PropTypes.func.isRequired,
		onLoadMore: PropTypes.func.isRequired,
		onReadMessage: PropTypes.func,
		uid: PropTypes.string.isRequired,
	};

	static defaultProps = {
		chats: [],
		onLoadMore: () => {}
	};
	loadMore = () => {
		const {chats, onLoadMore} = this.props;
		onLoadMore({type: 'ANNOUNCEMENT', offset: chats.length, limit: 25}).then(() => this.isLoading = false);
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

	componentDidMount() {
		this.restoreScroll();
	}

	componentWillReceiveProps() {
		this.updateDimensions(this.refs.scroller.getDimensions());
	}

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
				{chats.sort(chatSort).map(chat => <Announcement uid={uid} key={chat.id} chat={chat} onGetChatFull={this.props.onGetChatFull} onGetViewers={this.props.onGetViewers} onReadMessage={this.props.onReadMessage} onHandleConfirm = {this.props.onHandleConfirm}/>)}
			</Scroller>
		);
	}

}