import React from 'react';
import PropTypes from 'prop-types';
import DialogHeader from './DialogHeader';
import DialogInfo from './DialogInfo';
import DialogFooter from './DialogFooter';
import MessageList from './MessageList';
import DialogMessageUpdater from './DialogMessageUpdater';
import Modal from 'react-modal';
import Spinner from '../../common/Spinner';
import {AutoSizer, List} from 'react-virtualized';
import {ConnectedUser} from '../components';
import { default as DialogModal } from 'material-ui/Dialog';
import {defCase} from '../../../../utils/utility';
import FlatButton from 'material-ui/FlatButton';

/**
 * Компонент - Диалог
 */
export default class Dialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			openModal: false,
			viewInfo: false,
			messageId: null,
			openDialogDelete: false
		};
	}

	static propTypes = {
		deletedMessage: PropTypes.array.isRequired,
		displayHeader: PropTypes.bool.isRequired,
		editedMessage: PropTypes.object.isRequired,
		info: PropTypes.object.isRequired,
		isEditing: PropTypes.bool.isRequired,
		messageChangeReason: PropTypes.string,
		messageStatus: PropTypes.string.isRequired,
		messages: PropTypes.array.isRequired,
		onAddChatUser: PropTypes.func.isRequired,
		onBack: PropTypes.func.isRequired,
		onCancelEditMessage: PropTypes.func.isRequired,
		onChangeStatusApplication: PropTypes.func.isRequired,
		onChooseMessage: PropTypes.func.isRequired,
		onClearChooseMessage: PropTypes.func.isRequired,
		onDeleteMessage: PropTypes.func,
		onEditChatStatus: PropTypes.func.isRequired,
		onEditChatTitle: PropTypes.func.isRequired,
		onEditMessage: PropTypes.func.isRequired,
		onGetMessageViewers: PropTypes.func.isRequired,
		onLoadMessages: PropTypes.func.isRequired,
		onMessageReply: PropTypes.func.isRequired,
		onReadMessage: PropTypes.func.isRequired,
		onRemoveChatUser: PropTypes.func.isRequired,
		onSendMessage: PropTypes.func.isRequired,
		onUpdateMessage: PropTypes.func.isRequired,
		onUpdateNotifySettings: PropTypes.func.isRequired,
		peer: PropTypes.object.isRequired,
		replyMessageId: PropTypes.number,
		statusApplication: PropTypes.string,
		uid: PropTypes.string.isRequired,
	};

	static defaultProps = {
		displayHeader: true,
		messages: [],
		onBack: () => {},
		onSendMessage: () => {},

	};

	handleGetViewers = (messageId) => {
		this.props.onGetMessageViewers(messageId);
		this.setState({openModal: true, messageId});
	};

	handleOpenDialogDelete = () => this.setState({openDialogDelete: true});

    handleCloseDialogDelete = () => this.setState({openDialogDelete: false});

    handleViewInfo = () => {
    	this.setState({viewInfo: !this.state.viewInfo});
    };

	closeModal = () => this.setState({openModal: false});

	userRenderer = ({key, index, isScrolling, isVisible, style}) => {
		const message = this.props.messages.find(m => m.id === this.state.messageId);
		return (
			<div key={key} style={style}>
				<ConnectedUser userId={message.viewedBy[index]}/>
			</div>
		);
	};

	render() {
		const {viewInfo} = this.state;
		const {uid, peer, info, displayHeader, messages, messageStatus, onBack, onLoadMessages, onChooseMessage, onSendMessage,
			onReadMessage, onMessageReply, onUpdateNotifySettings, messageChangeReason, replyMessageId, onAddChatUser, statusApplication, onChangeStatusApplication,
			onRemoveChatUser, onEditChatTitle, onEditChatStatus, onGetViewers, onEditMessage, onCancelEditMessage, editedMessage, onUpdateMessage, isEditing} = this.props;
		const replyMessage = messages.find(m => m.id === replyMessageId);
		const message = messages.find(m => m.id === this.state.messageId);

		const actions = (
			<div>
				<FlatButton label="Отмена" onClick={() => this.handleCloseDialogDelete()}/>
				<FlatButton label="Удалить" secondary={true} onClick={() => { this.props.onDeleteMessage(); this.handleCloseDialogDelete() }}/>
			</div>
		);


		return (
			<div className="dialog">
				<DialogMessageUpdater uid={uid} peer={peer} lastMessageId={info.lastMessageId} messageStatus={messageStatus}/>
				{displayHeader && <DialogHeader statusApplication={statusApplication} uid={uid} info={info} onBack={onBack} onViewInfo={this.handleViewInfo} deletedMessage={this.props.deletedMessage} handlerOpenDialogDelete={this.handleOpenDialogDelete} onClearChooseMessage={this.props.onClearChooseMessage} />}
				<div className="dialog__main">
					<section className="dialog__container">
						<MessageList
							uid={uid}
							peer={peer}
							messages={messages}
							isEditing={isEditing}
							deletedMessage={this.props.deletedMessage}
							messagesChangeReason={messageChangeReason}
							unreadMessageId={info.unreadId}
							status={messageStatus}
							onGetViewers={this.handleGetViewers}
							onLoadMore={onLoadMessages}
							onReadMessage={onReadMessage}
							onMessageReply={onMessageReply}
							onChooseMessage={onChooseMessage}
							onEditMessage={onEditMessage}/>
						{info.type !== 'ANNOUNCEMENT' && <DialogFooter
							onChangeStatusApplication={onChangeStatusApplication}
							onLoadMore={onLoadMessages} messages={messages} uid={uid} peer={peer} replyTo={replyMessage}
							onReadMessage={onReadMessage} onSendMessage={onSendMessage}
							onEditChatStatus={onEditChatStatus} onMessageReply={onMessageReply}
							onCancelEditMessage={onCancelEditMessage} editedMessage={editedMessage}
							onUpdateMessage={onUpdateMessage} creatorId={info.creatorId}/>}
					</section>
					{viewInfo && (
						<section className="dialog__info">
							<DialogInfo uid={uid} info={info} onEditChatTitle={onEditChatTitle} onAddChatUser={onAddChatUser} onRemoveChatUser={onRemoveChatUser} onUpdateNotifySettings={onUpdateNotifySettings}/>
						</section>
					)}
				</div>

				{this.state.openModal && (
					<Modal isOpen={this.state.openModal} contentLabel="modal" style={modalStyle} onRequestClose={this.closeModal} ariaHideApp={false}>
						<div className="tabs">
							<ul className="tabs__nav grid--align-spread">
								<li className="tabs__item text-title--caps active">
									<a className="tabs__link">{`Просмотров (${message && message.views})`}</a>
								</li>
								<li className="tabs__item text-title--caps" onClick={this.closeModal}>
									<a className="tabs__link">Закрыть</a>
								</li>
							</ul>
							<div className="tabs__content tabs__content--p-horizontal grow">
								{(!message || !message.viewedBy) && <Spinner/>}
								{message && message.viewedBy && (
									<AutoSizer>
										{({height, width}) => <List className="scroller__container" rowCount={message.viewedBy.length} rowHeight={48} rowRenderer={this.userRenderer} width={width} height={height}/>}
									</AutoSizer>
								)}
							</div>
						</div>
					</Modal>
				)}

				<DialogModal
					title="Удалить сообщение"
					open={this.state.openDialogDelete}
					onRequestClose={() => this.handleCloseDialogDelete()}
					actions={actions}
					autoScrollBodyContent
					autoDetectWindowHeight
					repositionOnUpdate>
					<section className="grid grid--vertical p-vertical--medium">
						<p>Вы действительно хотите <b> удалить </b> {`${this.props.deletedMessage.length} ${defCase(this.props.deletedMessage.length, ['сообщение', 'сообщения', 'сообщений'])}`}?</p>
					</section>
				</DialogModal>
			</div>
		);
	}
}
const modalStyle = {
	content: {
		position: 'relative',
		display: 'flex',
		top: '10rem',
		margin: '0 auto',
		maxWidth: '30rem',
		left: null,
		bottom: null,
		right: null,
		border: null,
		padding: null,
		flex: '1 0 auto',
		minHeight: 0,
		maxHeight: '50%'
	},
	overlay: {
		display: 'flex',
		backgroundColor: 'rgba(0, 0, 0, 0.54)',
		zIndex: 1,
	}
};