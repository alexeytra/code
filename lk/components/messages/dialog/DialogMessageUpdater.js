import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {cancelGetChatUpdates, getChatUpdates} from './../../../../actions/MessengerActions';
import {peerEquals} from '../utils';

/**
 * Компонент - Обновление сообщений
 */
class DialogMessageUpdater extends React.Component {

	static propTypes = {
		cancelGetChatUpdates: PropTypes.func,
		getChatUpdates: PropTypes.func,
		isFetchingUpdate: PropTypes.bool,
		lastMessageId: PropTypes.number,
		messageStatus: PropTypes.string,
		peer: PropTypes.object.isRequired,
		uid: PropTypes.string.isRequired,
	};

	componentWillMount() {
		this.startMessagePoll(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (!peerEquals(this.props.peer, nextProps.peer)) {
			this.props.cancelGetChatUpdates(this.props.peer);
		}
		if (!nextProps.isFetchingUpdate) {
			clearTimeout(this.messageUpdater);
			this.startMessagePoll(nextProps);
		}
	}

	componentWillUnmount() {
		if (this.messageUpdater) {
			clearTimeout(this.messageUpdater);
		}
		this.props.cancelGetChatUpdates(this.props.peer);
	}

	startMessagePoll = (props) => {
		const {uid, peer, lastMessageId, getChatUpdates, messageStatus} = props;
		if (uid && peer && messageStatus !== 'LOADING') {
			this.messageUpdater = setTimeout(() => getChatUpdates(uid, peer, lastMessageId), 60000);
		}
	};

	render() {
		return null;
	}

}

function mapStateToProps(state) {
	return {
		isFetchingUpdate: state.messenger.fetchingChatUpdate,
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({cancelGetChatUpdates, getChatUpdates}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogMessageUpdater);