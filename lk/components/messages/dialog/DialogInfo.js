import React from 'react';
import PropTypes from 'prop-types';
import Scroller from './../../common/Scroller';
import UserAvatar from './../../common/UserAvatar';
import IconNotifications from 'material-ui/svg-icons/social/notifications';
import IconExit from 'material-ui/svg-icons/action/exit-to-app';
import IconPeople from 'material-ui/svg-icons/social/people';
import IconGroupAdd from 'material-ui/svg-icons/social/group-add';
import IconModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Toggle from './../../common/forms/Toggle';
import ChatParticipant from './ChatParticipant';
import {getUserFIO, getUserInfos} from '../utils';
import Modal from 'react-modal';
import Input from '../../common/forms/Input';
import UsersPicker from '../forms/UsersPicker';

/**
 * Компонент - Информация о диалоге
 */
export default class DialogInfo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			viewMembers: false,
			modalOpen: false,
			title: null,
			users: [],
		};
	}

	static propTypes = {
		info: PropTypes.object.isRequired,
		onAddChatUser: PropTypes.func.isRequired,
		onEditChatTitle: PropTypes.func.isRequired,
		onRemoveChatUser: PropTypes.func.isRequired,
		onUpdateNotifySettings: PropTypes.func.isRequired,
		uid: PropTypes.string.isRequired,
	};

	updateNotifySettings = (event) => {
		event.preventDefault();
		event.stopPropagation();
		return this.props.onUpdateNotifySettings();
	};

	closeModal = () => {
		this.setState({modalOpen: false, users: [], title: null});
	};

	addChatUser = () => {
		const {users} = this.state;
		users.map(user => this.props.onAddChatUser({chatId: this.props.info.id, user}));
		this.closeModal();
	};

	removeChatUser = () => {
		this.props.onRemoveChatUser({chatId: this.props.info.id, user: this.state.userId});
		this.closeModal();
	};

	editChatTitle = () => {
		if (this.props.info.name !== this.state.title && this.state.title.length > 0) {
			this.props.onEditChatTitle({chatId: this.props.info.id, title: this.state.title});
		}
		this.closeModal();
	};

	handleEditChat = () => {
		this.setState({modalOpen: true, type: 'EDIT_CHAT', title: this.props.info.name});
	};

	handleAddChatUser = () => {
		this.setState({modalOpen: true, type: 'ADD_USER'});
	};

	handleRemoveChatUser = (userId) => {
		if (userId === this.props.uid) {
			this.setState({modalOpen: true, type: 'LEAVE_CHAT', userId});
		} else {
			this.setState({modalOpen: true, type: 'REMOVE_USER', userId});
		}
	};
	handleLeaveChat = () => this.handleRemoveChatUser(this.props.uid);

	renderModal() {
		const {type, userId, title, users} = this.state;
		switch (type) {
			case 'REMOVE_USER': {
				const participant = this.props.info.participants.find(participant => participant.id === userId);
				const userName = participant.type === 'USER' ? getUserFIO(participant.user) : participant.user.name;
				return (
					<div className="grid grid--vertical">
						<div className="p-around--medium text-body--strong">
							{`Удалить ${participant.type === 'GROUP' ? 'группу' : 'пользователя'} «${userName}» из обсуждения?`}
						</div>
						<div className="grid grid--align-end p-around--small">
							<button type="button" className="btn" onClick={this.closeModal}>Отмена</button>
							<button type="button" className="btn text-color--error" onClick={this.removeChatUser}>Удалить</button>
						</div>
					</div>
				);
			}
			case 'EDIT_CHAT':
				return (
					<div className="grid grid--vertical">
						<div style={{padding: '1.5rem 1.5rem 0 1.5rem'}}>
							<div className="text-body--large text-body--strong">
								Редактирование чата
							</div>
							<Input value={title} onChange={(value) => this.setState({title: value})} label="Название обсуждения" autoFocus/>
						</div>
						<div className="grid grid--align-end p-around--small">
							<button type="button" className="btn" onClick={this.closeModal}>Отмена</button>
							<button type="button" className="btn" onClick={this.editChatTitle}>Сохранить</button>
						</div>
					</div>
				);
			case 'LEAVE_CHAT':
				return (
					<div className="grid grid--vertical">
						<div className="p-around--medium text-body--strong">
							Вы действительно хотите покинуть обсуждение?
						</div>
						<div className="grid grid--align-end p-around--small">
							<button type="button" className="btn" onClick={this.closeModal}>Отмена</button>
							<button type="button" className="btn text-color--error" onClick={this.removeChatUser}>Покинуть</button>
						</div>
					</div>
				);

			case 'ADD_USER':
				return (
					<div className="grid grid--vertical">
						<div style={{padding: '1.5rem 1.5rem 0 1.5rem'}}>
							<UsersPicker value={users} onChange={(value) => this.setState({users: value})} label="Пригласить пользователей" treeCheckable/>
						</div>
						<div className="grid grid--align-end p-around--small">
							<button type="button" className="btn" onClick={this.closeModal}>Отмена</button>
							<button type="button" className="btn" onClick={this.addChatUser} disabled={this.state.users.length === 0}>Пригласить</button>
						</div>
					</div>
				);
		}
	}

	render() {
		const {uid, info} = this.props;
		const isCreator = !!(info.flags & 0x1);
		const isAdmin = !!(info.flags & 0x2);
		return (
			<div className="grid grow p-left--medium p-vertical--medium has-flexi-truncate">
				<Scroller>
					<ul className="has-dividers--bottom-space has-list-interactions">
						<li className="has-divider--bottom-space">
							<DialogInfoHeader uid={uid} info={info} onEditChat={this.handleEditChat}/>
						</li>
						<li className="list__item" onClick={this.updateNotifySettings}>
							<div className="media media--center">
								<div className="media__figure">
									<IconNotifications style={{color: '#f5a623', verticalAlign: 'middle'}}/>
								</div>
								<div className="media__body">
									<div className="grid grid--align-spread has-flexi-truncate">
										<p>Уведомления</p>
										<Toggle checked={info.notify}/>
									</div>
								</div>
							</div>
						</li>
						{info.type !== 'DIALOGUE' && (
							<li className="list__item" onClick={() => this.setState({viewMembers: !this.state.viewMembers})}>
								<div className="media media--center" style={{cursor: 'pointer'}}>
									<div className="media__figure">
										<IconPeople style={{color: '#f5a623', verticalAlign: 'middle'}}/>
									</div>
									<div className="media__body">
										<div className="grid grid--align-spread has-flexi-truncate">
											<p>Участники</p>
											<p>{info.participantsCount}</p>
										</div>
									</div>
								</div>
							</li>
						)}
						{info.type !== 'DIALOGUE' && this.state.viewMembers && (
							<li>
								<ul className="has-dividers--bottom">
									{info.participants.map(participant => (
										<li key={participant.id} className="list__item">
											<ChatParticipant uid={uid} canRemoveChatParticipant={info.type === 'CHAT' && isAdmin} participant={participant} onRemoveChatParticipant={this.handleRemoveChatUser}/>
										</li>
									))}
								</ul>
							</li>
						)}
						{info.type === 'CHAT' && (
							<li className="list__item" onClick={this.handleAddChatUser}>
								<div className="media media--center" style={{cursor: 'pointer'}}>
									<div className="media__figure">
										<IconGroupAdd style={{color: '#f5a623', verticalAlign: 'middle'}}/>
									</div>
									<div className="media__body">
										<div className="grid grid--align-spread has-flexi-truncate">
											<p>Пригласить пользователей</p>
										</div>
									</div>
								</div>
							</li>
						)}
						{info.type === 'CHAT' && !isCreator && (
							<li className="list__item" onClick={this.handleLeaveChat}>
								<div className="media media--center">
									<div className="media__figure">
										<IconExit style={{color: '#f5a623', verticalAlign: 'middle'}}/>
									</div>
									<div className="media__body">
										<p className="text-color--error">Покинуть обсуждение</p>
									</div>
								</div>
							</li>
						)}
					</ul>
				</Scroller>

				{this.state.modalOpen && (
					<Modal isOpen={this.state.modalOpen} contentLabel="Редактирование чата" style={modalStyle} ariaHideApp={false}>
						{this.renderModal()}
					</Modal>
				)}
			</div>
		);
	}
}
const modalStyle = {
	overlay: {
		position: 'fixed',
		top: '0',
		left: '0',
		right: '0',
		bottom: '0',
		backgroundColor: 'rgba(0, 0, 0, 0.54)',
		zIndex: '1',
	},
	content: {
		position: 'fixed',
		padding: null,
		outline: '0',
		border: '0',
		borderRadius: '4px',
		backgroundColor: '#FFFFFF',
		top: '50%',
		left: '50%',
		bottom: 'auto',
		right: 'auto',
		transform: 'translate(-50%, -50%)',
		minWidth: '20rem',
		maxWidth: '30rem',
		width: '100%',
	}
};

const DialogInfoHeader = ({uid, info, onEditChat}) => {
	switch (info.type) {
		case 'DIALOGUE': {
			return (
				<div className="media media--center">
					<div className="media__figure">
						<UserAvatar user={info.user}/>
					</div>
					<div className="media__body">
						<p className="text-body--strong">{getUserFIO(info.user)}</p>
						{info.user && info.user.info && info.user.info.map(info => <p key={info.userCode} className="truncate text-body--small">{info.info}</p>)}
						<p className="truncate text-body--small" title={getUserInfos(info.user)}>{getUserInfos(info.user)}</p>
					</div>
				</div>
			);
		}
		case 'SUPPORT': {
			if (info.user && info.user.id !== uid) {
				return (
					<div className="media media--center">
						<div className="media__figure">
							<UserAvatar user={info.user}/>
						</div>
						<div className="media__body">
							<p className="text-body--strong">{getUserFIO(info.user)}</p>
							<p className="truncate text-body--small" title={getUserInfos(info.user)}>{getUserInfos(info.user)}</p>
						</div>
					</div>
				);
			} else {
				return (
					<div className="media media--center">
						<div className="media__figure">
							<UserAvatar text={info.name}/>
						</div>
						<div className="media__body">
							<p className="truncate text-body--strong">Техподдержка</p>
							<p className="text-body--small">{`«${info.name}»`}</p>
						</div>
					</div>
				);
			}
		}
		default: {
			const isCreator = !!(info.flags & 0x2);
			return (
				<div className="media">
					<div className="media__figure">
						<UserAvatar text={info.name}/>
					</div>
					<div className="media__body">
						<div className="dialog__info-chat">
							<div className="grid grow">
								<p className="text-body--strong">
									{info.name}
								</p>
							</div>
							{isCreator && (
								<div className="dialog__info-chat_edit">
									<button type="button" className="button button--icon" onClick={() => onEditChat()}>
										<IconModeEdit style={{color: 'inherit'}}/>
									</button>
								</div>
							)}
						</div>
						{info.user && <p className="text-body--small" title={`${getUserFIO(info.user)}, ${getUserInfos(info.user)}`}>{`Создатель: ${getUserFIO(info.user)}, ${getUserInfos(info.user)}`}</p>}
					</div>
				</div>
			);
		}
	}
};