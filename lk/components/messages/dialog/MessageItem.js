import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Attachments from './../Attachments';
import UserAvatar from './../../common/UserAvatar';
import Linkify from 'react-linkify';
import moment from 'moment';
import IconReply from 'material-ui/svg-icons/content/reply';
import IconClear from 'material-ui/svg-icons/content/clear';
import IconVisibity from 'material-ui/svg-icons/action/visibility';
import IconDelete from 'material-ui/svg-icons/action/delete';
import IconCancel from 'material-ui/svg-icons/navigation/cancel';
import IconEdit from 'material-ui/svg-icons/content/create'
import {getUserFIO, getUserInfos} from '../utils';
import {Link} from 'react-router-dom';
import {defCase} from './../../../../utils/utility';

/**
 * Компонент - Элемент сообщения
 */
export default class MessageItem extends React.Component {

	static propTypes = {
		choosed: PropTypes.bool,
		isEditing: PropTypes.bool,
		isQuoted: PropTypes.bool,
		isReposted: PropTypes.bool,
		isShort: PropTypes.bool,
		message: PropTypes.object,
		onChooseMessage: PropTypes.func,
		onEditMessage: PropTypes.func,
		onGetViewers: PropTypes.func,
		onMessageReply: PropTypes.func,
		uid: PropTypes.string,
	};

	handleShowViewers = () => {
		this.props.onGetViewers(this.props.message.id);
	};

	handleReplyMessage = () => {
		this.props.onMessageReply(this.props.message.id);
	};

	render() {
		const {message, isShort, isReposted, isQuoted, onChooseMessage, choosed, uid, onEditMessage, isEditing} = this.props;
		const isService = message.type === 0;
		const isUnread = !(message.flags & 0x1) && !(message.flags & 0x2);
		if (isService) {
			return (
				<div className="message message--service">
					{`${getUserFIO(message.sender)} ${message.message}`}
				</div>
			);
		}
		return (
			<div className={classNames('message', {'message--short': isShort, 'message--unread': isUnread,'message--choosed': choosed})}>
				{!isShort ?
					<div className="message__sender__avatar">
						<UserAvatar user={message.sender} linkTo={`/im/dialogues/${message.sender.id}`} size={36}/>
					</div>
					: null
				}
				<div className="message__body" /* onClick={() => onChooseMessage(message)}*/>
					{!isShort ? (
						<div className="message__info">
							<div className="grid grid--vertical">
								<div className="grid grid--vertical-align-center">
									<Link to={`/im/dialogues/${message.sender.id}`} className="message__info__name" title={getUserInfos(message.sender)}>{getUserFIO(message.sender)}</Link>
									<div>
										<span className="message__info__time">{isReposted ? moment(message.date)
											.format('lll') : moment(message.date)
											.format('LT')}</span>
										<span className="text-body--small message__info__id">{`	Номер (${message.id})`}</span>
									</div>
								</div>
								<p className="text-body--small">{getUserInfos(message.sender)}</p>
							</div>
							<div className="message__actions">
								<div className="button-group">
									{(!isQuoted && !isReposted && !isEditing) && (
										<button type="button" className="button button--neutral" style={{color: 'inherit', border: 'none'}} title={`${message.views} ${defCase(message.views, ['просмотр', 'просмотра', 'просмотров'])}`} onClick={this.handleShowViewers}>
											<IconVisibity className="button__icon button__icon--left" style={{color: 'inherit', width: '18px', height: '18px', verticalAlign: 'middle'}}/>
											<span className="text-body--strong">{message.views}</span>
										</button>
									)}
									{(!isQuoted && !isReposted && !isEditing) && (
										<button type="button" className="button button--icon-border" style={{color: 'inherit', border: 'none'}} title="Ответить" onClick={this.handleReplyMessage}>
											<IconReply className="button__icon" style={{color: 'inherit', verticalAlign: 'middle'}}/>
										</button>
									)}
									{(!isQuoted && !isReposted && !isEditing && !choosed && (message.from === uid) && ((message.attachments.length === 0  || message.message) && moment(message.date).diff(moment(), 'days') === 0)) && (
										<button type="button" className="button button--icon-border" style={{color: 'inherit', border: 'none'}} title="Редактировать сообщение" onClick={() => onEditMessage(message)}>
											<IconEdit className="button__icon" style={{color: 'inherit', verticalAlign: 'middle'}}/>
										</button>
									)}
									{(!isQuoted && !isReposted && !isEditing && !choosed && (message.from === uid)) && (
										<button type="button" className="button button--icon-border" style={{color: 'inherit', border: 'none'}} title="Удалить сообщение" onClick={() => onChooseMessage(message)}>
											<IconDelete className="button__icon" style={{color: 'inherit', verticalAlign: 'middle'}}/>
										</button>
									)}
									{(!isQuoted && !isReposted && choosed && (message.from === uid)) && (
										<button type="button" className="button button--icon-border" style={{color: 'inherit', border: 'none'}} title="Отмена" onClick={() => onChooseMessage(message)}>
											<IconCancel className="button__icon" style={{color: 'inherit', verticalAlign: 'middle'}}/>
										</button>
									)}
									{isQuoted && (
										<button type="button" className="button button--icon-border" style={{color: 'inherit', border: 'none'}} onClick={this.handleReplyMessage}>
											<IconClear className="button__icon" style={{color: 'inherit', verticalAlign: 'middle'}}/>
										</button>
									)}
								</div>
							</div>
						</div>
					) : (
						<div className="message__time">
							<div className="message__info__time">{isReposted ? moment(message.date)
								.format('lll') : moment(message.date)
								.format('LT')}</div>
						</div>
					)}
					<div className="message__content">
						{!isQuoted && message.fwdMessage && (
							<div style={{borderLeft: 'medium solid #2196F3', paddingLeft: '1rem'}}>
								<MessageItem message={message.fwdMessage} isReposted/>
							</div>
						)}
						<div className={classNames('message__content__text', {'truncate': isQuoted})}>
							<Linkify properties={{target: '_blank'}}>
								{isQuoted ? (message.message || '').substring(0, 128) : message.message}
							</Linkify>
						</div>
						{!isQuoted ? <Attachments className="message__content__attachments" attachments={message.attachments}/> : message.attachments.length > 0 ? <p className="text-body--small">{'<Вложение>'}</p> : null}
					</div>
				</div>
				{isShort && (
					<div className="message__actions">
						<div className="button-group">
							{(!isQuoted && !isReposted && !isEditing) && (
								<button type="button" className="button button--neutral" style={{color: 'inherit', border: 'none'}} title={`${message.views} ${defCase(message.views, ['просмотр', 'просмотра', 'просмотров'])}`} onClick={this.handleShowViewers}>
									<IconVisibity className="button__icon button__icon--left" style={{color: 'inherit', width: '18px', height: '18px', verticalAlign: 'middle'}}/>
									<span className="text-body--strong">{message.views}</span>
								</button>
							)}
							{(!isQuoted && !isReposted && !isEditing) && (
								<button type="button" className="button button--icon-border" style={{color: 'inherit', border: 'none'}} title="Ответить" onClick={this.handleReplyMessage}>
									<IconReply className="button__icon" style={{color: 'inherit', verticalAlign: 'middle'}}/>
								</button>
							)}
							{(!isQuoted && !isReposted && !choosed && !isEditing && (message.from === uid) && ((message.attachments.length === 0 || message.message) && moment(message.date).diff(moment(), 'days') === 0)) && (
								<button type="button" className="button button--icon-border" style={{color: 'inherit', border: 'none'}} title="Редактировать сообщение" onClick={() => onEditMessage(message)}>
									<IconEdit className="button__icon" style={{color: 'inherit', verticalAlign: 'middle'}}/>
								</button>
							)}
							{(!isQuoted && !isReposted && !choosed && !isEditing && (message.from === uid)) && (
								<button type="button" className="button button--icon-border" style={{color: 'inherit', border: 'none'}} onClick={() => onChooseMessage(message)}>
									<IconDelete className="button__icon" style={{color: 'inherit', verticalAlign: 'middle'}}/>
								</button>
							)}
							{(!isQuoted && !isReposted && choosed && !isEditing && (message.from === uid)) && (
								<button type="button" className="button button--icon-border" style={{color: 'inherit', border: 'none'}} title="Отмена" onClick={() => onChooseMessage(message)}>
									<IconCancel className="button__icon" style={{color: 'inherit', verticalAlign: 'middle'}}/>
								</button>
							)}
							{isQuoted && (
								<button type="button" className="button button--icon-border" style={{color: 'inherit', border: 'none'}} onClick={this.handleReplyMessage}>
									<IconClear className="button__icon" style={{color: 'inherit', verticalAlign: 'middle'}}/>
								</button>
							)}
						</div>
					</div>
				)}
			</div>
		);
	}
}