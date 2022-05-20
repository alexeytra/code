import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Linkify from 'react-linkify';
import DateUtils from '../../../../../utils/dateUtils';
import UserAvatar from '../../../common/UserAvatar';
import Attachments from '../../Attachments';
import {Link} from 'react-router-dom';
import CheckBoxIcon from 'material-ui/svg-icons/action/check-circle';
import VisibilityIcon from 'material-ui/svg-icons/action/visibility';
import {getUserFIO, getUserInfos} from '../../utils';
import Modal from 'react-modal';
import ChatParticipant from '../../dialog/ChatParticipant';
import Spinner from '../../../common/Spinner';
import {ConnectedUser} from '../../components';
import ShowQuizTest from './ShowQuizTest';
import UserQuizResult from './UserQuizResult';
import {AutoSizer, List} from 'react-virtualized';
import Tabs from '../../../common/tabs/Tabs';
import Tab from '../../../common/tabs/Tab';
import IconGroup from 'material-ui/svg-icons/social/group';
import ButtonGroup from '../../../common/ButtonGroup';

/**
 * Компонент - Опрос
 */
export default class Quiz extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			openModal: false,
			openModalResult: false,
			openModalStats: false,
		};
	}

	static propTypes = {
		chat: PropTypes.object.isRequired,
		getQuiz: PropTypes.func.isRequired,
		getUserNotAnswer: PropTypes.func.isRequired,
		getUserResults: PropTypes.func.isRequired,
		loading: PropTypes.bool,
		loadingQuizResult: PropTypes.bool,
		onCommit: PropTypes.bool,
		onGetChatFull: PropTypes.func.isRequired,
		onGetViewers: PropTypes.func.isRequired,
		onHandleConfirm: PropTypes.func.isRequired,
		onReadMessage: PropTypes.func.isRequired,
		onSendResult: PropTypes.func.isRequired,
		onSendViewed: PropTypes.func.isRequired,
		quiz: PropTypes.object,
		uid: PropTypes.string.isRequired,
		updateUserResult: PropTypes.func,
		userNotAnswer: PropTypes.object,
		userResult: PropTypes.object,

	};

	static defaultProps = {
		onReadMessage: () => {
		},
		onCommit: false
	};

	handleSubmit = (values) => {
		const {chat, onSendResult, uid} = this.props;
		const {user} = chat;
		const obj = {
			userId: uid,
			userAnswers: []
		};
		const size2 = Object.keys(values).length;
		const size = Object.keys(this.props.quiz.questions).length;

		Object.entries(values)
			.forEach(([key, value]) => {
				const questionId = key.split('_')[1];
				const selectedVariants = Object.entries(value)
					.map(([key, value]) => {
						if (!!key.split('_')[1]) {
							const variantId = key.split('_')[1];
							const nameField = key.split('_')[0];
							if (nameField === 'text')
								return {
									variantId,
									answer: value,
									isTextAnswer: 'true'
								};
							else
								return {
									variantId,
									answer: value,
									isTextAnswer: 'false'
								}
						} else {
							return {
								variantId: value,
								answer: value,
								isTextAnswer: false
							}
						}
					});
				obj.userAnswers.push({
					questionId,
					selectedVariants
				})
			});

		if (size2 !== size) {
			alert('Пожалуйста заполните все поля');
		} else {
			onSendResult(obj);
			this.setState({openModal: false}, () => {
				alert('Ваш опрос отправлен');
			});
		}
	};

	handleMouseEnter = () => {
		const {uid, chat, onReadMessage} = this.props;

		if (!(chat.lastMessage.flags & 0x1) && !(chat.lastMessage.flags & 0x2)) {
			onReadMessage(uid, {peer: {chatId: chat.id}, maxId: chat.lastMessage.id});

		}
	};

	handleOpenModal = (tab) => {
		const {chat, onGetViewers, onGetChatFull, getQuiz, uid} = this.props;
		getQuiz(chat.id, uid);
		onGetChatFull(chat.id);
		onGetViewers(chat.lastMessage.id);
		this.setState({openModal: true, activeTab: tab});
	};

	handleOpenModalResult = (tab) => {
		const {chat, onGetViewers, onGetChatFull} = this.props;
		onGetChatFull(chat.id);
		onGetViewers(chat.lastMessage.id);
		this.setState({openModalResult: true, activeTab: tab});
	};

	handleOpenModalStats = (tab) => {
		const {chat, onGetViewers, onGetChatFull, getUserNotAnswer} = this.props;
		getUserNotAnswer(chat.id);
		onGetChatFull(chat.id);
		onGetViewers(chat.lastMessage.id);
		this.setState({openModalStats: true, activeTab: tab});
	};

	handleDeleteModal = () => {
		this.setState({deleteModal: true});
	};

	handleCloseModal = () => {
		this.setState({openModal: false});
	};

	handleCloseModalShow = () => {
		this.setState({openModalResult: false});
	};

	handleCloseModalStats = () => {
		this.setState({openModalStats: false});
	};

	handleSelectTab = (tab) => {
		if (tab === 'close') {
			this.handleCloseModalStats();
		} else {
			this.setState({activeTab: tab});
		}
	};


	participantRenderer = ({key, index, isScrolling, isVisible, style}) =>
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

	userNotAnswer = ({key, index, isScrolling, isVisible, style}) => (
		<div key={key} style={style}>
			<ConnectedUser userId={this.props.userNotAnswer.confirmBy[index]}/>
		</div>
	);

	render() {
		const {chat, uid} = this.props;
		const {lastMessage, user} = chat;
		const isUnread = !(lastMessage.flags & 0x1) && !(lastMessage.flags & 0x2);

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
						{uid === user.id ?
							<ButtonGroup>
								<button
									type="button" className="button button--neutral"
									style={{color: 'inherit', border: 'none'}}
									title={'Просмотреть ответы пользователей'} onClick={() => {
										this.handleOpenModalResult('views');
									}}>
									<VisibilityIcon
										className="button__icon button__icon--left"
										style={{
											color: 'inherit',
											width: '18px',
											height: '18px',
											verticalAlign: 'middle'
										}}/>
									<span className="text-body--strong">Просмотреть ответы пользователей</span>
								</button>
								<button
									type="button" className="button button--neutral"
									style={{color: 'inherit', border: 'none'}} title={'Краткая информация'}
									onClick={() => this.handleOpenModalStats('participants')}>
									<IconGroup
										className="button__icon button__icon--left" style={{
											color: 'inherit',
											width: '18px',
											height: '18px',
											verticalAlign: 'middle'
										}}/>
									<span className="text-body--strong">Краткая информация</span>
								</button>
							</ButtonGroup> : <React.Fragment/>}
						{
							uid !== user.id ?
								<button
									type="button" className="button button--neutral"
									style={{color: 'inherit', border: 'none'}}
									title={'Пройти опрос'} onClick={() => {
										this.handleOpenModal('participants');
										this.props.getQuiz(chat.id, uid);
									}}>
									<CheckBoxIcon
										className="button__icon button__icon--left"
										style={{
											color: 'inherit',
											width: '18px',
											height: '18px',
											verticalAlign: 'middle'
										}}/>
									<span className="text-body--strong">Пройти опрос</span>
								</button> : <React.Fragment/>}
					</div>
				</footer>

				{this.state.openModal && (
					<Modal isOpen={this.state.openModal} contentLabel="Modal" style={modalStyle} ariaHideApp={false}>
						{this.props.loading ?
							<Spinner/>
							: <ShowQuizTest
								onSubmit={this.handleSubmit}
								onCloseModal={this.handleCloseModal}
								quiz={this.props.quiz}/>}
					</Modal>
				)}

				{this.state.openModalResult && (
					<Modal
						isOpen={this.state.openModalResult} contentLabel="Modal" style={modalStyle}
						ariaHideApp={false}>
						<UserQuizResult
							chatId={chat.id}
							onSendViewed={this.props.onSendViewed}
							onCloseModal={this.handleCloseModalShow}
							loadingQuizResult={this.props.loadingQuizResult}
							getUserResults={this.props.getUserResults}
							updateUserResult={this.props.updateUserResult}
							userResult={this.props.userResult}/>
					</Modal>
				)
				}

				{this.state.openModalStats && (
					<Modal
						isOpen={this.state.openModalStats} contentLabel="Modal" style={modalStyle} ariaHideApp={false}>
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
								 title={`Просмотревшие опрос (${lastMessage.views})`}>
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
							{!this.props.userNotAnswer.confirmBy ? <Spinner/> :
								<Tab
									className="grow p-vertical--small p-horizontal--medium" eventKey="notAnswer"
									title={`Не прошедшие (${this.props.userNotAnswer.confirmBy.length})`}>
									{!this.props.userNotAnswer.confirmBy && <Spinner/>}
									{this.props.userNotAnswer.confirmBy && (
										<AutoSizer>
											{({height, width}) => <List
												className="scroller__container"
												rowCount={this.props.userNotAnswer.confirmBy.length}
												rowHeight={48} rowRenderer={this.userNotAnswer}
												width={width} height={height}/>}
										</AutoSizer>
									)}
								</Tab>
							}
							<Tab
								eventKey="close" title="Закрыть" className="grow"
								 style={{flex: '1 0 auto', textAlign: 'right'}} linkStyle={{display: 'initial'}}/>
						</Tabs>
					</Modal>
				)
				}
			</div>
		);
	}
}
const modalStyle = {
	content: {
		position: 'relative',
		display: 'flex',
		top: '3%',
		margin: '0 auto',
		maxWidth: '90%',
		left: null,
		bottom: null,
		right: null,
		border: null,
		padding: null,
		flex: '1 0 auto',
		minHeight: 0,
		maxHeight: '90%'
	},
	overlay: {
		display: 'flex',
		backgroundColor: 'rgba(0, 0, 0, 0.54)',
		zIndex: 1,
	}
};
