import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import Chip from 'material-ui/Chip';
import FilePicker from './../../common/forms/FilePicker';
import Spinner from './../../common/Spinner';
import MessageItem from './MessageItem';
import IconReply from 'material-ui/svg-icons/content/reply';
import Picker, {SKIN_TONE_NEUTRAL} from 'emoji-picker-react';
import IconInsertEmoji from 'material-ui/svg-icons/editor/insert-emoticon';
import IconAttach from 'material-ui/svg-icons/editor/attach-file';
import IconSend from 'material-ui/svg-icons/content/send';
import IconCheck from 'material-ui/svg-icons/action/check-circle';
import IconInsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import Avatar from 'material-ui/Avatar';
import {defCase} from '../../../../utils/utility';
import {APPLICATION_TYPES_STATUS} from '../../../../constants/AppConstants';

/**
 * Компонент - Нижняя часть диалога
 */
export default class DialogFooter extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			open: false,
			uploading: false,
			showEmojiPicker: false,
			message: '',
			files: []
		};
	}

	static propTypes = {
		editedMessage: PropTypes.object.isRequired,
		messages: PropTypes.array.isRequired,
		onCancelEditMessage: PropTypes.func.isRequired,
		onLoadMore: PropTypes.func,
		onMessageReply: PropTypes.func,
		onReadMessage: PropTypes.func.isRequired,
		onSendMessage: PropTypes.func.isRequired,
		onChangeStatusApplication: PropTypes.func.isRequired,
		onEditChatStatus: PropTypes.func.isRequired,
		onUpdateMessage: PropTypes.func.isRequired,
		creatorId: PropTypes.string,
		peer: PropTypes.object,
		replyTo: PropTypes.object,
		uid: PropTypes.string,
	};

	static defaultProps = {
		messages: [],
	};

	handleClearTextArea = () => {
		this.refs.message.value = '';
		this.setState({message: ''})
	};

	handleSendMessageText = () => {
		const {uid, peer, replyTo, creatorId} = this.props;
		const message = this.refs.message.value.trim();
		if (message.length) {
			if (replyTo) {
				this.props.onSendMessage(uid, {peer, message, replyToId: replyTo.id});
			} else {
				this.props.onSendMessage(uid, {peer, message});
			}
			if(uid !== creatorId){
				this.props.onChangeStatusApplication(APPLICATION_TYPES_STATUS.ACCEPTED);
			}
			this.handleClearTextArea();
		}
	};

	handleSendMessageWithMedia = () => {
		const {uid, peer, creatorId} = this.props;
		const files = this.state.files;
		const message = this.refs.message.value.trim();
		if (message.length) {
			this.props.onSendMessage(uid, {peer, message, files});
		} else {
			this.props.onSendMessage(uid, {peer, files});
		}
		if(uid !== creatorId){
			this.props.onChangeStatusApplication(APPLICATION_TYPES_STATUS.ACCEPTED);
		}
		this.setState({files: []});
		this.handleClearTextArea();
	};

	handleUpdateMessage = () => {
		const text = this.refs.message.value.trim();
		if (text.length) {
			this.props.onUpdateMessage(text)
		}
	};

	handleSendMessage = () => {
		const files = this.state.files.length;
		if (files > 0) {
			this.handleSendMessageWithMedia();
		} else {
			this.handleSendMessageText();
		}
	};

	handleKeyDown = event => {
		if (this.isSendEvent(event)) {
			this.handleSendMessage();
		}
		this.props.onReadMessage();
	};

	isSendEvent = event => {
		if (event.keyCode !== 13) {
			return false;
		}
		return event.ctrlKey || event.metaKey;
	};

	handleAttachFiles = () => {
		const files = this.refs.filePicker.getFiles();
		this.setState({files, open: false});
	};

	renderReplyTo = () => {
		const {replyTo: message, onMessageReply} = this.props;
		if (message) {
			return (
				<div style={{borderLeft: 'medium solid #2196F3', paddingLeft: '1rem'}}>
					<div style={{position: 'absolute', left: 0, paddingLeft: '1rem'}}>
						<IconReply
							className="button__icon"
							style={{fill: 'rgb(84, 105, 141)', width: '36px', height: '36px'}}/>
					</div>
					<MessageItem message={message} isQuoted onMessageReply={(id) => onMessageReply(null)}/>
				</div>
			);
		}
		return null;
	};

	closeDialog() {
		if (!this.state.uploading) {
			this.setState({open: false});
		}
	}

	handleMessageChange = (event) => {
		this.setState({message: event.target.value});
	};

	onEmojiClick = (event, emojiObject) => {
		this.setState({
			message: this.state.message + emojiObject.emoji
		});
	};

	onOpenEmojiPicker = () => {
		this.setState({showEmojiPicker: !this.state.showEmojiPicker},
			() => {
				if (this.state.showEmojiPicker)
					document.addEventListener('click', this.onCloseEmojiPicker);
				else
					document.removeEventListener('click', this.onCloseEmojiPicker);
			});
	};

	onCloseEmojiPicker = (e) => {
		if (this.emojiPicker !== null && !this.emojiPicker.contains(e.target)) {
			this.setState({showEmojiPicker: !this.state.showEmojiPicker},
				() => document.removeEventListener('click', this.onCloseEmojiPicker)
			);
		}
	};

	render() {
		const {editedMessage, onCancelEditMessage} = this.props;
		const fileCount = this.state.files.length;
		const editing = Object.keys(editedMessage).length !== 0;
		const actions = (
			<div className="grid grid--align-spread">
				<button type="submit" className="button button--destructive" onClick={() => this.closeDialog()}>
					Отмена
				</button>
				<button type="submit" className="button button--brand" onClick={this.handleAttachFiles}>
					Прикрепить
				</button>
			</div>
		);

		let fileChip = <React.Fragment/>;
		if (fileCount > 0 && !editing) {
			fileChip = (
				<div>
					<Chip
						onClick={() => this.setState({open: true})}
						style={{marginBottom: '16px'}}>
						<Avatar icon={<IconInsertDriveFile/>}/>
						{fileCount} {defCase(fileCount, ['вложение', 'вложения', 'вложений'])}
					</Chip>
				</div>
			);
		}
		return (
			<section className="dialog__footer">
				{this.state.showEmojiPicker &&
				<span ref={el => (this.emojiPicker = el)}>
					<Picker
						onEmojiClick={this.onEmojiClick}
						native disableAutoFocus={true}
						skinTone={SKIN_TONE_NEUTRAL}
						disableSkinTonePicker={true}
						disableSearchBar={true}
						groupVisibility={{
							flags: false,
						}}
						groupNames={groupNames}
						pickerStyle={styles.emojiPicker}/>
				</span>
				}
				{this.renderReplyTo()}
				{fileChip}
				{!editing ? (
					<div>
						<textarea
							className="send-message"
							value={this.state.message}
							onChange={this.handleMessageChange}
							placeholder="Введите сообщение" ref="message" onKeyDown={this.handleKeyDown}/>
						<div className="actions">
							<button
								type="button" className="button button--icon"
								onClick={() => this.setState({open: true})} title="Прикрепление файлов">
								<IconAttach style={{color: 'inherit'}}/>
							</button>
							<button
								type="button" className="button button--icon"
								onClick={this.onOpenEmojiPicker} title="Emoji">
								<IconInsertEmoji style={{color: 'inherit'}}/>
							</button>
							<div style={{flex: '1 0 auto'}}/>
							<button
								type="button" className="button button--icon" onClick={this.handleSendMessage}
								title="Отправить">
								<IconSend style={{color: 'inherit'}}/>
							</button>
						</div>
					</div>
				) : (
					<div>
						<Chip
							backgroundColor="#d17a4b"
							onRequestDelete={onCancelEditMessage}
							labelColor="#fff"
							style={{marginBottom: '16px'}}>
							Редактирование сообщения
						</Chip>
						<textarea className="send-message" placeholder="Редактирование" ref="message"
								  defaultValue={editedMessage.message} onKeyDown={this.handleKeyDown}/>
						<div className="actions">
							<div style={{flex: '1 0 auto'}}/>
							<button type="button" className="button button--icon" onClick={this.handleUpdateMessage}>
								<IconCheck style={{color: 'inherit'}}/>
							</button>
						</div>
					</div>
				)}


				{this.state.open && (
					<Dialog
						title="Прикрепление файлов" open={this.state.open} onRequestClose={() => this.closeDialog()}
						actions={actions} autoScrollBodyContent autoDetectWindowHeight repositionOnUpdate>
						<section className="grid grid--vertical p-vertical--medium">
							{this.state.uploading && <Spinner/>}
							<FilePicker files={this.state.files} ref="filePicker" maxFiles={10}/>
						</section>
					</Dialog>
				)}
			</section>
		);
	}
}

const styles = {
	emojiPicker: {
		position: 'absolute',
		bottom: '35%',
		left: '10%',
		cssFloat: 'left',
		zIndex: 1
	}
};

const groupNames = {
	smileys_people: 'Эмоции и люди',
	animals_nature: 'Животные и растения',
	food_drink: 'Еда и напитки',
	travel_places: 'Путешествия и транспорт',
	activities: 'Спорт и активности',
	objects: 'Предметы',
	symbols: 'Символы',
	recently_used: 'Часто используемые',
};
