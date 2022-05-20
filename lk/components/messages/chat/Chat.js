import React from 'react';
import PropTypes from 'prop-types';
import DateUtils from './../../../../utils/dateUtils';
import UserAvatar from './../../common/UserAvatar';
import classNames from 'classnames';
import IconNotificationsOff from 'material-ui/svg-icons/social/notifications-off';
import Linkify from 'react-linkify';
import {getUserFIO, getUserInfos} from '../utils';
import {APPLICATION_TYPES_STATUS} from '../../../../constants/AppConstants';

/**
 * Компонент - Сообщение
 */
class Message extends React.Component {

	static propTypes = {
		message: PropTypes.object,
		user: PropTypes.object
	};

	render() {
		const {message, user} = this.props;
		if (message) {
			const messageContent = message.message || '';
			const isMine = message.flags & 0x1;
			return (
				<div className="truncate text-body--small">
					<span style={{color: isMine ? '#0070d2' : null}}>{isMine ? 'Вы: ' : user ? `${getUserFIO(user)}: ` : ''}</span>
					{messageContent.length > 0 && <Linkify properties={{target: '_blank', onClick: (e) => e.stopPropagation()}}>{messageContent.length > 140 ? `${messageContent.slice(0, 140)}...` : messageContent}</Linkify>}
					{messageContent.length === 0 && message.attachments.length > 0 && <span>{'<Вложение>'}</span>}
				</div>
			);
		}
		return null;
	}
}

/**
 * Компонент - Чат
 */
export default class Chat extends React.Component {

	static propTypes = {
		chat: PropTypes.object.isRequired,
		chatType: PropTypes.string.isRequired,
		onSelectChat: PropTypes.func.isRequired
	};

	static defaultProps = {
		chatType: 'DIALOGUE',
		onSelectChat: () => {}
	};

	handleSelectChat = (chat) => {
		this.props.onSelectChat(chat.id);
	};

	render() {
		const {chat, chatType} = this.props;
		switch (chatType) {
			case 'DIALOGUE': {
				const {user} = chat;
				return (
					<div className={classNames('chat media media--center aldar', {'chat--unread': chat.notify && chat.unreadCount > 0})} onClick={() => this.handleSelectChat(chat)} style={this.props.style}>
						<div className="media__figure">
							<UserAvatar user={user}/>
						</div>
						<div className="media__body">
							<div className="grid grid--align-spread">
								<div className="grid grid--vertical grow has-flexi-truncate">
									<h3 className="grid grid--vertical-align-center">
										{!chat.notify && <IconNotificationsOff style={{color: 'rgba(0,0,0,0.6)', height: '16px', width: '16px'}}/>}
										<p className="truncate text-body--strong">{getUserFIO(user)}</p>
										<p className="truncate text-body--small" style={{padding: '0 0 0 2px'}}>
											<span>{getUserInfos(user)}</span>
										</p>
									</h3>
									<div className="media media--center">
										<Message message={chat.lastMessage}/>
									</div>
								</div>
								<div className="grid grid--vertical grid--align-center grid--vertical-align-center shrink-none m-left--medium">
									{chat.unreadCount > 0 && <div className="chat__counter">{chat.unreadCount}</div>}
									{chat.lastMessage && <p className="text-body--small">{`${DateUtils.moment(chat.lastMessage.date)
										.format(DateUtils.momentFormat(chat.lastMessage.date))}`}</p>}
								</div>
							</div>
						</div>
					</div>
				);
			}
			case 'SUPPORT': {
				const {user} = chat;
				return (
					<div className={classNames('chat media media--center aldar', {'chat--unread': chat.notify && chat.unreadCount > 0})} onClick={() => this.handleSelectChat(chat)} style={this.props.style}>
						<div className="media__figure">
							<UserAvatar text={chat.name}/>
						</div>
						<div className="media__body">
							<div className="grid grid--align-spread">
								<div className="grid grid--vertical grow has-flexi-truncate">
									<h3 className="grid grid--vertical-align-center">
										{!chat.notify && <IconNotificationsOff style={{color: 'rgba(0,0,0,0.6)', height: '18px', width: '18px'}}/>}
										<p className="truncate text-body--strong" title={chat.name}>{chat.name}</p>
									</h3>
									<div className="media media--center">
										<Message message={chat.lastMessage} user={user}/>
									</div>
								</div>
								<div className="grid grid--vertical grid--align-center grid--vertical-align-center shrink-none m-left--medium">
									{chat.unreadCount > 0 && <div className="chat__counter">{chat.unreadCount}</div>}
									{chat.lastMessage && <p className="text-body--small">{`${DateUtils.moment(chat.lastMessage.date)
										.format(DateUtils.momentFormat(chat.lastMessage.date))}`}</p>}
								</div>
							</div>
						</div>
					</div>
				);
			}
			default: {
				const {user} = chat;
				return (
					<div className={classNames('chat media media--center aldar', {'chat--unread': chat.notify && chat.unreadCount > 0})} onClick={() => this.handleSelectChat(chat)} style={this.props.style}>
						<div className="media__figure">
							<UserAvatar text={chat.name}/>
						</div>
						<div className="media__body">
							<div className="grid grid--align-spread">
								<div className="grid grid--vertical grow has-flexi-truncate">
									<h3 className="grid grid--vertical-align-center">
										{!chat.notify && <IconNotificationsOff style={{color: 'rgba(0,0,0,0.6)', height: '16px', width: '16px'}}/>}
										<p className="truncate text-body--strong" title={chat.name}>{chat.name}</p>
									</h3>
									<div className="media media--center">
										<Message message={chat.lastMessage} user={user}/>
									</div>
								</div>
								<div
									className="grid grid--vertical grid--align-center grid--vertical-align-center shrink-none m-left--medium">
									{chat.statusApplication === APPLICATION_TYPES_STATUS.SUBMITTED && <div
										className="chat__status chat__status__submitted">{chat.statusApplication}</div>}
									{chat.statusApplication === APPLICATION_TYPES_STATUS.PROGRESS &&
										<div className="chat__status chat__status__progress">{chat.statusApplication}</div>}
									{chat.statusApplication === APPLICATION_TYPES_STATUS.ACCEPTED &&
										<div className="chat__status chat__status__complete">{chat.statusApplication}</div>}

								</div>
								<div
									className="grid grid--vertical grid--align-center grid--vertical-align-center shrink-none m-left--medium"
									style={{minWidth: '3rem'}}>
									{chat.unreadCount > 0 && <div className="chat__counter">{chat.unreadCount}</div>}
									{chat.lastMessage && <p className="text-body--small">{`${DateUtils.moment(chat.lastMessage.date)
										.format(DateUtils.momentFormat(chat.lastMessage.date))}`}</p>}
									{!chat.lastMessage && <p className="text-body--small">{`${DateUtils.moment(chat.date)
										.format(DateUtils.momentFormat(chat.date))}`}</p>}
								</div>
							</div>
						</div>
					</div>
				);
			}
		}
	}
}
