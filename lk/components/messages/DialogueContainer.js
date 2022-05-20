import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addChatUser, editChatTitle, editChatStatusApplication, getChatFull, getHistory, deleteHistory, getMessageViewers, getUserFull, readHistory, removeChatUser, replyMessage, sendMessage, updateNotifySettings, updateMessage} from './../../../actions/MessengerActions';
import Dialog from './dialog/Dialog';
import debounce from 'lodash/debounce';
import {dialogSelector, messagesSelector} from './../../../selectors/messenger';
import {getInputPeer} from './utils';
import {userIdSelector} from '../../../selectors/messenger';
import Error from '../common/Error';
import Spinner from '../common/Spinner';
import {APPLICATION_TYPES_STATUS} from '../../../constants/AppConstants';

/**
 * Контейнер - Диалогов
 */
class DialogueContainer extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.messageUpdater = null;
		this.readHistory = debounce(this.readHistory, 1000, {leading: true});
		this.state = {
			deleteMessage: [],
			isEditing: false,
			editedMessage: {},
			statusApplication: this.props.info? this.props.info.statusApplication: null,
		};
	}

	static propTypes = {
		addChatUser: PropTypes.func,
		deleteHistory: PropTypes.func,
		displayDialogHeader: PropTypes.bool,
		editChatTitle: PropTypes.func.isRequired,
		getChatFull: PropTypes.func,
		getHistory: PropTypes.func,
		getMessageViewers: PropTypes.func,
		getUserFull: PropTypes.func,
		info: PropTypes.object,
		messageChangeReason: PropTypes.string,
		messageStatus: PropTypes.string,
		messages: PropTypes.array,
		peerId: PropTypes.string,
		readHistory: PropTypes.func,
		editChatStatusApplication: PropTypes.func,
		removeChatUser: PropTypes.func,
		replyMessage: PropTypes.func,
		replyMessageId: PropTypes.number,
		sendMessage: PropTypes.func,
		status: PropTypes.string,
		uid: PropTypes.string,
		updateMessage: PropTypes.func,
		updateNotifySettings: PropTypes.func
	};
	static defaultProps = {
		displayDialogHeader: true
	};

	componentWillMount() {
		if (this.props.peerId.startsWith('e') || this.props.peerId.startsWith('s')) {
			this.props.getUserFull(this.props.peerId)
				.then(action => action.type.endsWith('COMPLETED') && this.props.getHistory({peerId: this.props.peerId}));
		} else {
			this.props.getChatFull(this.props.peerId)
				.then(action => action.type.endsWith('COMPLETED') && this.props.getHistory({peerId: this.props.peerId}));
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.peerId !== nextProps.peerId) {
			if (nextProps.peerId.startsWith('e') || nextProps.peerId.startsWith('s')) {
				this.props.getUserFull(nextProps.peerId)
					.then(action => action.type.endsWith('COMPLETED') && this.props.getHistory({peerId: nextProps.peerId}));
			} else {
				this.props.getChatFull(nextProps.peerId)
					.then(action => action.type.endsWith('COMPLETED') && this.props.getHistory({peerId: nextProps.peerId}));
			}
		}
	}

	readHistory = () => {
		if (this.props.info && this.props.info.unreadCount > 0) {
			this.props.readHistory(this.props.uid, {peer: getInputPeer(this.props.peerId), maxId: this.props.info.lastMessageId});
			const submitted = this.props.uid !== this.props.info.creatorId && this.props.info.statusApplication === APPLICATION_TYPES_STATUS.SUBMITTED;
			if (submitted){
				this.handleChangeStatusApplication(APPLICATION_TYPES_STATUS.PROGRESS)
			}
		}
	};

	handleChangeStatusApplication = status => {
		if(!(this.state.statusApplication == null)) {
			this.props.editChatStatusApplication({chatId: this.props.peerId, statusApplication: status});
			this.setState({
				...this.state,
				statusApplication: status,
			})
		}
	}

	handleUpdateNotifySettings = () => {
		const {peerId, info, updateNotifySettings} = this.props;
		return updateNotifySettings({peer: getInputPeer(peerId), notify: !info.notify});
	};

	handleChooseMessage = (message) => {
		const id = message.id;
		if (this.props.uid === message.from)
			if (this.state.deleteMessage.includes(id)) {
				this.setState({
					deleteMessage: [...this.state.deleteMessage.filter(m => m !== id)]
				});
			} else
				this.setState({
					deleteMessage: [...this.state.deleteMessage,
						id]
				});
	};

	handleDeleteMessage = () => {
		this.props.deleteHistory({id: this.state.deleteMessage});
		this.setState({
			deleteMessage: []
		});

	};

	handleClearChooseMessage = () => this.setState({deleteMessage: []});

	handleOnEditMessage = (message) => {
	    this.setState({isEditing: true, editedMessage: message})
	};

	handleCancelEditMessage = () => this.setState({isEditing: false, editedMessage: {}});

	handleUpdateMessage = (text) => {
	    const { editedMessage } = this.state;
	    this.props.updateMessage({messageId: editedMessage.id, messageContent: text});
		this.setState({isEditing: false, editedMessage: {}})
	};

	goBack = () => this.props.history.goBack();

	handleRemoveChatUser = (removeChatUser) => {
		this.props.removeChatUser(this.props.uid, removeChatUser)
			.then(action => {
				if (action.type.endsWith('COMPLETED')) {
					if (this.props.uid === removeChatUser.user) {
						this.props.history.push(this.props.match.url.substring(0, this.props.match.url.lastIndexOf('/')));
					}
				}
			});
	};

	render() {
		const {displayDialogHeader, uid, peerId, info, messageStatus, messages, status} = this.props;
		const {deleteMessage, editedMessage, isEditing, statusApplication} = this.state;
		if (status === 'ERROR') {
			return (
				<div className="container container--wb">
					<Error errorText="Чат не найден"/>
				</div>
			);
		}
		if (status !== 'LOADED') {
			return (
				<div className="container container--wb">
					<div className="grid grid--vertical grid--vertical-align-center p-around--medium is-relative">
						{/* <h3 className="text-heading--medium">Загрузка...</h3>*/}
						<Spinner/>
					</div>
				</div>
			);
		}
		if (status === 'LOADED' && info === null) {
			return (
				<div className="container container--wb">
					<Error errorText="Чат не найден"/>
				</div>
			);
		}
		if (status === 'LOADED' && info) {
			if (displayDialogHeader) {
				return (
					<div className="container container--wb grow">
						<Dialog
							editedMessage={editedMessage}
							isEditing={isEditing}
							statusApplication={statusApplication}
							uid={uid}
							peer={getInputPeer(peerId)}
							info={info}
							deletedMessage={deleteMessage}
							displayHeader={displayDialogHeader}
							messages={messages}
							messageStatus={messageStatus}
							messageChangeReason={this.props.messageChangeReason}
							replyMessageId={this.props.replyMessageId}
							onBack={this.goBack}
							onEditChatTitle={this.props.editChatTitle}
							onEditChatStatus={this.props.editChatStatusApplication}
							onGetMessageViewers={this.props.getMessageViewers}
							onSendMessage={this.props.sendMessage}
							onLoadMessages={this.props.getHistory}
							onReadMessage={this.readHistory}
							onMessageReply={this.props.replyMessage}
							onUpdateNotifySettings={this.handleUpdateNotifySettings}
							onAddChatUser={this.props.addChatUser}
							onRemoveChatUser={this.handleRemoveChatUser}
							onChooseMessage={this.handleChooseMessage}
							onDeleteMessage={this.handleDeleteMessage}
							onClearChooseMessage={this.handleClearChooseMessage}
							onEditMessage={this.handleOnEditMessage}
							onCancelEditMessage={this.handleCancelEditMessage}
							onUpdateMessage={this.handleUpdateMessage}
							onChangeStatusApplication={this.handleChangeStatusApplication}/>
					</div>
				);
			} else {
				return (
					<Dialog
						editedMessage={editedMessage}
						isEditing={isEditing}
						uid={uid}
						peer={getInputPeer(peerId)}
						info={info}
						statusApplication={statusApplication}
						deletedMessage={deleteMessage}
						displayHeader={displayDialogHeader}
						messages={messages}
						messageStatus={messageStatus}
						messageChangeReason={this.props.messageChangeReason}
						replyMessageId={this.props.replyMessageId}
						onBack={this.goBack}
						onEditChatTitle={this.props.editChatTitle}
						onEditChatStatus={this.props.editChatStatusApplication}
						onGetMessageViewers={this.props.getMessageViewers}
						onSendMessage={this.props.sendMessage}
						onLoadMessages={this.props.getHistory}
						onReadMessage={this.readHistory}
						onMessageReply={this.props.replyMessage}
						onUpdateNotifySettings={this.handleUpdateNotifySettings}
						onAddChatUser={this.props.addChatUser}
						onRemoveChatUser={this.handleRemoveChatUser}
						onChooseMessage={this.handleChooseMessage}
						onDeleteMessage={this.handleDeleteMessage}
						onClearChooseMessage={this.handleClearChooseMessage}
						onEditMessage={this.handleOnEditMessage}
						onCancelEditMessage={this.handleCancelEditMessage}
						onUpdateMessage={this.handleUpdateMessage}
						onChangeStatusApplication={this.handleChangeStatusApplication}/>
				);
			}
		}
	}
}

function mapStateToProps(state, ownProps) {
	const {peerId} = ownProps.match.params;
	return {
		uid: userIdSelector(state),
		peerId,
		info: dialogSelector(state, {peerId}),
		messages: messagesSelector(state, {peerId}),
		messageChangeReason: state.messenger.changeReason,
		replyMessageId: state.messenger.replyMessage,
		messageStatus: state.messenger.messageStatus,
		status: state.messenger.status,
		error: state.messenger.error,
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({getChatFull, getUserFull, getHistory, getMessageViewers, readHistory, sendMessage, replyMessage, updateNotifySettings, addChatUser, deleteHistory, removeChatUser, editChatTitle,editChatStatusApplication, updateMessage}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogueContainer);