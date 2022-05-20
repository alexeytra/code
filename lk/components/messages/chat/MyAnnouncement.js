import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Linkify from 'react-linkify';
import DateUtils from '../../../../utils/dateUtils';
import UserAvatar from './../../common/UserAvatar';
import Attachments from './../Attachments';
import {Link} from 'react-router-dom';
import IconVisibity from 'material-ui/svg-icons/action/visibility';
import IconGroup from 'material-ui/svg-icons/social/group';
import {getUserFIO, getUserInfos} from '../utils';
import ButtonGroup from '../../common/ButtonGroup';
import {defCase} from '../../../../utils/utility';
import Modal from 'react-modal';
import {AutoSizer, List} from 'react-virtualized';
import Tabs from '../../common/tabs/Tabs';
import Tab from '../../common/tabs/Tab';
import ChatParticipant from '../dialog/ChatParticipant';
import Spinner from '../../common/Spinner';
import {ConnectedUser} from '../components';
import AnnButton from './AnnButton';
import CheckBoxIcon from 'material-ui/svg-icons/action/check-circle';
import IconEdit from 'material-ui/svg-icons/content/create'
import {withRouter} from 'react-router';

/**
 * Компонент - Мои объявления
 */
class MyAnnouncement extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			openModal: false,
			activeTab: 'participants',
			deleteModal: false
		};
	}

	static propTypes = {
		chat: PropTypes.object.isRequired,
		onDelete: PropTypes.bool,
		onDeleteMyAnnouncement: PropTypes.func.isRequired,
		onGetChatFull: PropTypes.func.isRequired,
		onGetConfirmFull: PropTypes.func.isRequired,
		onGetViewers: PropTypes.func.isRequired,
		onReadMessage: PropTypes.func.isRequired,
		uid: PropTypes.string.isRequired,
	};

	static defaultProps = {
		onReadMessage: () => {
		},
		onDelete: false
	};

	handleMouseEnter = () => {
		const {uid, chat, onReadMessage} = this.props;
		if (!(chat.lastMessage.flags & 0x1) && !(chat.lastMessage.flags & 0x2)) {
			/* if (!(chat.lastMessage.flags & 0x1)) {*/
			onReadMessage(uid, {peer: {chatId: chat.id}, maxId: chat.lastMessage.id});

		}
	};

	handleOpenModal = (tab) => {
		const {chat, onGetViewers, onGetChatFull, onGetConfirmFull} = this.props;
		onGetChatFull(chat.id);
		onGetViewers(chat.lastMessage.id);
		onGetConfirmFull(chat.id);
		this.setState({openModal: true, activeTab: tab});
	};
	handleDeleteModal = () => {
		const {chat} = this.props;
		this.setState({deleteModal: true});
	};

	handleCloseModal = () => {
		this.setState({openModal: false, activeTab: 'participants'});
	};

	handleSelectTab = (tab) => {
		if (tab === 'close') {
			this.handleCloseModal();
		} else {
			this.setState({activeTab: tab});
		}
	};

	handleEditAnnouncement = (id) => {
		const {match, location, history} = this.props;
		history.push(`${match.url}/edit/${id}`);
	};

	participantRenderer = ({key, index, isScrolling, isVisible, style}) =>
		// const isAdmin = !!(this.props.chat.flags & 0x2);
		(
			<div key={key} style={style}>
				<ChatParticipant
					uid={this.props.uid} participant={this.props.chat.participants[index]}
					canRemoveChatParticipant={false}/>
			</div>
		)
	;

	userRenderer = ({key, index, isScrolling, isVisible, style}) => (
		<div key={key} style={style}>
			<ConnectedUser userId={this.props.chat.lastMessage.viewedBy[index]}/>
		</div>
	);

	confirmUserRenderer = ({key, index, isScrolling, isVisible, style}) => (
		<div key={key} style={style}>
			<ConnectedUser userId={this.props.chat.confirmBy[index]}/>
		</div>
	);

	render() {
		const {chat, onDelete} = this.props;
		const {lastMessage, user, viewConfirm} = chat;
		const isUnread = !(lastMessage.flags & 0x1) && !(lastMessage.flags & 0x2);
		const hidden = chat.type === 'MYANNOUNCEMENT';
		return (
			<div
				className={classNames('announcement', {'announcement--unread': isUnread})}
				 onMouseEnter={this.handleMouseEnter} style={this.props.style}>
				<header className="announcement__header">
					<div className="media media--center">
						<div className="media__figure">
							<UserAvatar user={chat.user} linkTo={`/im/dialogues/${user.id}`}/>
						</div>
						<div className="media__body">
							<div>
								<Link
									to={`/im/dialogues/${user.id}`}
									  className="text-body--strong text-link--reset-color m-right--x-small">{getUserFIO(user)}</Link>
								<span className="text-body--small">{DateUtils.moment(chat.lastMessage.date)
									.format(DateUtils.announcementFormat(chat.lastMessage.date))}</span>
								<span
									className="text-body--small announcement__header__id">{`	Номер (${chat.id})`}</span>
							</div>
							<p className="text-body--small">{getUserInfos(user)}</p>
						</div>
					</div>
				</header>
				<div className="announcement__content">
					<h3 className="text-heading--small m-bottom--small">{chat.name}</h3>
					<Linkify properties={{target: '_blank'}}>{chat.lastMessage.message}</Linkify>
					{chat.lastMessage.attachments && chat.lastMessage.attachments.length > 0 &&
					<Attachments className="announcement__attachments" attachments={chat.lastMessage.attachments}/>}
				</div>
				<footer className="announcement__footer">
					<div className="announcement__footer__info">
						<ButtonGroup>
							<AnnButton
								chat={chat} hidden={hidden}
								onDeleteMyAnnouncement={this.props.onDeleteMyAnnouncement}/>
							<button
								type="button" className="button button--neutral"
								style={{color: 'inherit', border: 'none'}} title="Редактировать"
								onClick={() => this.handleEditAnnouncement(chat.id)}>
								<IconEdit
									className="button__icon button__icon--left" style={{
										color: 'inherit',
										width: '18px',
										height: '18px',
										verticalAlign: 'middle'
									}}/>
								<span className="text-body--strong">Редактировать</span>
							</button>
							<button
								type="button" className="button button--neutral"
								style={{color: 'inherit', border: 'none'}}
								title={`${chat.participantsCount} ${defCase(chat.participantsCount, ['получатель', 'получателя', 'получателей'])}`}
								onClick={() => this.handleOpenModal('participants')}>
								<IconGroup
									className="button__icon button__icon--left" style={{
										color: 'inherit',
										width: '18px',
										height: '18px',
										verticalAlign: 'middle'
									}}/>
								<span className="text-body--strong">{chat.participantsCount}</span>
							</button>
							<button
								type="button" className="button button--neutral"
								style={{color: 'inherit', border: 'none'}}
								title={`${chat.lastMessage.views} ${defCase(chat.lastMessage.views, ['просмотр', 'просмотра', 'просмотров'])}`}
								onClick={() => this.handleOpenModal('views')}>
								<IconVisibity
									className="button__icon button__icon--left" style={{
										color: 'inherit',
										width: '18px',
										height: '18px',
										verticalAlign: 'middle'
									}}/>
								<span className="text-body--strong">{chat.lastMessage.views}</span>
							</button>
							{viewConfirm === 'YES' ?
								<button
									type="button" className="button button--neutral"
									style={{color: 'inherit', border: 'none'}}
									title={`${chat.confirmCount} ${defCase(chat.confirmCount, ['подтверждение', 'подтверждения', 'подтверждений'])}`}
									onClick={() => this.handleOpenModal('confirm')}>
									<CheckBoxIcon
										className="button__icon button__icon--left" style={{
											color: 'inherit',
											width: '18px',
											height: '18px',
											verticalAlign: 'middle'
										}}/>
									<span className="text-body--strong">{chat.confirmCount}</span>
								</button>
								: <React.Fragment/>}
						</ButtonGroup>
					</div>
				</footer>

				{this.state.openModal && (
					<Modal
						isOpen={this.state.openModal} onRequestClose={() => this.setState({openModal: false})}
						   contentLabel="Modal" style={modalStyle} ariaHideApp={false}>
						<Tabs activeKey={this.state.activeTab} onSelect={this.handleSelectTab}>
							<Tab
								className="grow p-vertical--small p-horizontal--medium" eventKey="participants"
								 title={`Получатели (${chat.participantsCount})`}>
								{!chat.participants && <Spinner/>}
								{chat.participants && (
									<div style={{flex: '1 1 auto'}}>
										<AutoSizer>
											{({height, width}) => <List
												className="scroller__container"
												rowCount={chat.participants.length}
												rowHeight={48}
												rowRenderer={this.participantRenderer}
												width={width} height={height}/>}
										</AutoSizer>
									</div>
								)}
							</Tab>

							<Tab
								className="grow p-vertical--small p-horizontal--medium" eventKey="views"
								 title={`Просмотров (${lastMessage.views})`}>
								{!lastMessage.viewedBy && <Spinner/>}
								{lastMessage.viewedBy && (
									<AutoSizer>
										{({height, width}) => <List
											className="scroller__container"
											rowCount={lastMessage.viewedBy.length}
											rowHeight={48} rowRenderer={this.userRenderer}
											width={width} height={height}/>}
									</AutoSizer>
								)}
							</Tab>
							{viewConfirm === 'YES' ?
								<Tab
									className="grow p-vertical--small p-horizontal--medium" eventKey="confirm"
									 title={`Подтвердившие (${chat.confirmCount})`}>
									{!chat.confirmBy && <Spinner/>}
									{chat.confirmBy && (
										<AutoSizer>
											{({height, width}) => <List
												className="scroller__container"
												rowCount={chat.confirmBy.length} rowHeight={48}
												rowRenderer={this.confirmUserRenderer}
												width={width} height={height}/>}
										</AutoSizer>
									)}
								</Tab> : <React.Fragment/>}


							<Tab
								eventKey="close" title="Закрыть" className="grow"
								 style={{flex: '1 0 auto', textAlign: 'right'}} linkStyle={{display: 'initial'}}/>
						</Tabs>
					</Modal>
				)}

			</div>
		);
	}
}

export default withRouter(MyAnnouncement)

const modalStyle = {
	content: {
		position: 'relative',
		display: 'flex',
		top: '10rem',
		margin: '0 auto',
		maxWidth: '35rem',
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

const deleteStyle = {
	content: {
		position: 'relative',
		display: 'flex',
		top: '1rem',
		margin: '0 auto',
		maxWidth: '30rem',
		left: null,
		bottom: null,
		right: null,
		border: null,
		padding: null,
		flex: '1 0 auto',
		minHeight: 0,
		maxHeight: '20%'
	},
	overlay: {
		display: 'flex',
		backgroundColor: 'rgba(0, 0, 0, 0.54)',
		zIndex: 1,
	}
};