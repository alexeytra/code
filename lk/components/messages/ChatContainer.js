import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
	getChatFull,
	getDialogs,
	getHistory,
	getMessageViewers,
	readHistory,
	clearDialogsState,
	setSupportFilter,
	deleteMyAnnouncement,
	readAllHistory
} from './../../../actions/MessengerActions';
import ChatList from './chat/ChatList';
import QuizList from './chat/quiz/QuizList';
import AnnouncementList from './chat/AnnouncementListOld';
import MyAnnouncementList from './chat/MyAnnouncementList';
import {CHAT_ACTIONS, CHAT_TYPES, CHAT_TYPES_READ} from './../../../constants/AppConstants';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconDesc from 'material-ui/svg-icons/action/description';
import IconDraft from 'material-ui/svg-icons/content/drafts';
import FilterList from 'material-ui/svg-icons/content/filter-list';
import {getFilteredDialogs, userIdSelector} from '../../../selectors/messenger';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {getSupportChats} from './../../../utils/api';
import Chip from 'material-ui/Chip';
import {getInputPeer} from './utils';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CircularProgress from 'material-ui/CircularProgress';
import {changeConfirm, getConfirmFull} from '../../../actions/MessengerActions';
import {getAppealsChats, getUsersListQuiz} from '../../../utils/api';
import {getQuiz, getUserResults, sendResult, getUserNotAnswer, sendViewed, updateUserResult} from '../../../actions/QuizActions';

/**
 * Компонент - Чат
 */
class ChatContainer extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			isFiltered: false,
			openPopover: false,
			openPopoverActions: false,
			filterCriteria: [],
		};
	}

	static propTypes = {
		changeConfirm: PropTypes.func.isRequired,
		chatType: PropTypes.oneOf(['ANNOUNCEMENT', 'MYANNOUNCEMENT', 'CHAT', 'DIALOGUE', 'SUPPORT', 'CONTEXT', 'APPEAL', 'APPLICATION', 'QUIZ', 'MYQUIZ']).isRequired,
		chats: PropTypes.array.isRequired,
		clearDialogsState: PropTypes.func.isRequired,
		deleteMyAnnouncement: PropTypes.func.isRequired,
		getChatFull: PropTypes.func,
		getConfirmFull: PropTypes.func,
		getDialogs: PropTypes.func.isRequired,
		getMessageViewers: PropTypes.func.isRequired,
		getQuiz: PropTypes.func.isRequired,
		getUserNotAnswer: PropTypes.func.isRequired,
		getUserResults: PropTypes.func.isRequired,
		hasMoreChats: PropTypes.bool.isRequired,
		history: PropTypes.object,
		isReadingAllHistory: PropTypes.bool.isRequired,
		loadingQuiz: PropTypes.bool,
		loadingQuizResult: PropTypes.bool,
		location: PropTypes.object,
		match: PropTypes.object,
		quiz: PropTypes.object,
		readAllHistory: PropTypes.func.isRequired,
		readHistory: PropTypes.func.isRequired,
		sendResult: PropTypes.func,
		sendViewed: PropTypes.func,
		setSupportFilter: PropTypes.func.isRequired,
		status: PropTypes.string.isRequired,
		uid: PropTypes.string.isRequired,
		updateUserResult: PropTypes.func,
		userNotAnswer: PropTypes.object,
		userResult: PropTypes.object,


	};

	componentWillMount() {
		if (this.props.chatType === 'SUPPORT') {
			this.props.getDialogs({
				type: this.props.chatType,
				limit: 30,
				filter: this.getFilterBy(this.props.chatType)
			});
		} else {
			this.props.getDialogs({type: this.props.chatType, limit: 30});
		}
	}

	componentDidMount() {
		this.getFilterData(this.props.chatType)
	}

	componentWillReceiveProps(nextProps) {
		this.getFilterData(nextProps.chatType);
		if (this.props.chatType !== nextProps.chatType) {
			if (nextProps.chatType === 'SUPPORT' || nextProps.chatType === 'APPEAL') {
				this.props.getDialogs({
					type: nextProps.chatType,
					limit: 30,
					filter: this.getFilterBy(nextProps.chatType)
				});
			} else {
				this.props.getDialogs({type: nextProps.chatType, limit: 30});
			}
			this.setState({isLoading: true});
		}
		if (this.props.chatType === nextProps.chatType && nextProps.status === 'LOADED') {
			this.setState({isLoading: false});
		}
	}

	getFilterBy = (chatType) => {
		if (JSON.parse(localStorage.getItem(chatType) !== null)) {
			const {filterBy} = JSON.parse(localStorage.getItem(chatType));
			return filterBy;
		} else {
			return '';
		}
	};

	getFilterData = (chatType) => {
		switch (chatType) {
			case 'SUPPORT': {
				const support = {
					id: 'SUPPORT',
					shortName: 'Техподдержка',
				};
				getSupportChats()
					.then(data => {
						this.setState({filterCriteria: [...data, support]})
					});
				break;
			}
			case 'APPEAL': {
				getAppealsChats()
					.then(data => {
						this.setState({filterCriteria: data})
					});
				break
			}
		}
	};

	handleSelectChat = (chatId) => {
		const {history, match} = this.props;
		history.push(`${match.url}/${chatId}`);
	};

	handleCreateChat = () => {
		const {history, match} = this.props;
		history.push(`${match.url}/create`);
	};

	handleCreateApplicationChat = () => {
		const {history, match} = this.props;
		history.push('/im/applications/create');
	};

	handleLoadMore = (params) => {
		if (!this.state.isLoading) {
			return this.props.getDialogs({...params, filter: this.getFilterBy(this.props.chatType)});
		}
	};

	handleOpenPopover = (event) => {
		event.preventDefault();
		this.setState({
			openPopover: true,
			anchorEl: event.currentTarget,
		});
	};

	handleOpenPopoverActions = (event) => {
		event.preventDefault();
		this.setState({
			openPopoverActions: true,
			anchorEl: event.currentTarget,
		})
	};

	handlePopoverClose = () => {
		this.setState({openPopover: false});
	};

	handlePopoverActionsClose = () => {
		this.setState({openPopoverActions: false});
	};

	handleOnItemClick = (event, menuItem, index) => {
		localStorage.setItem(this.props.chatType, JSON.stringify({filterBy: menuItem.props.value}));
		this.setState({openPopover: false, isLoading: true});
		this.props.clearDialogsState();
		this.props.getDialogs({type: this.props.chatType, limit: 30, filter: menuItem.props.value});
	};

	handleRequestDelete = () => {
		localStorage.setItem(this.props.chatType, JSON.stringify({filterBy: ''}));
		this.props.clearDialogsState();
		this.props.getDialogs({type: this.props.chatType, limit: 30});
	};

	handleReadMessages = () => {
		this.setState({openPopoverActions: false});
		const messages = this.props.chats.filter(chat => chat.unreadCount > 0)
			.map(chat => ({peer: getInputPeer(String(chat.id)), maxId: chat.lastMessage.id}));
		if (messages.length !== 0) {
			this.props.readAllHistory(this.props.uid, messages)
		}
	};

	renderChat = () => {
		const {chatType, uid, chats, readHistory, hasMoreChats, status, quiz} = this.props;
		if (chatType === 'ANNOUNCEMENT')
			return (
				<AnnouncementList
					uid={uid} hasMoreChats={hasMoreChats} chats={chats}
					onGetChatFull={this.props.getChatFull} onGetViewers={this.props.getMessageViewers}
					onLoadMore={this.handleLoadMore} onReadMessage={readHistory}
					onHandleConfirm={this.handleConfirm}/>
			);
		else if (chatType === 'MYANNOUNCEMENT') {
			return (<MyAnnouncementList
				uid={uid} hasMoreChats={hasMoreChats}
				chats={chats}
				onGetChatFull={this.props.getChatFull}
				onGetViewers={this.props.getMessageViewers}
				onGetConfirmFull={this.props.getConfirmFull}
				onLoadMore={this.handleLoadMore}
				onReadMessage={readHistory}
				onDeleteMyAnnouncement={this.props.deleteMyAnnouncement}/>);
		} else if (chatType === 'QUIZ') {
			return (<QuizList
				uid={uid} hasMoreChats={hasMoreChats}
				chats={chats}
				quiz={quiz}
				loading={this.props.loadingQuiz}
				loadingQuizResult={this.props.loadingQuizResult}
				onGetChatFull={this.props.getChatFull}
				onGetViewers={this.props.getMessageViewers}
				getQuiz={this.props.getQuiz}
				getUserResults={this.props.getUserResults}
				getUserNotAnswer={this.props.getUserNotAnswer}
				onLoadMore={this.handleLoadMore}
				onReadMessage={readHistory}
				onHandleConfirm={this.handleConfirm}
				onSendResult={this.props.sendResult}
				onSendViewed={this.props.sendViewed}
				userResult={this.props.userResult}
				userNotAnswer={this.props.userNotAnswer}
				updateUserResult={this.props.updateUserResult}/>);
		} else {
			return (<ChatList
				chats={chats} chatType={chatType} hasMoreChats={hasMoreChats}
				onSelectChat={this.handleSelectChat} onLoadMore={this.handleLoadMore}/>);
		}
	};

	handleConfirm = (chatId) => {
		this.props.changeConfirm({chatId, userId: this.props.uid});
	};


	render() {
		const {chatType} = this.props;
		const filterBy = this.getFilterBy(chatType);
		return (
			<div className="container container--transparent grow">
				<header className="toolbar">
					<div className="toolbar__title">
						<div>{CHAT_TYPES[chatType]}</div>
						{((chatType === 'SUPPORT' || chatType === 'APPEAL') && filterBy !== '') &&
						<Chip
							onRequestDelete={this.handleRequestDelete}
							style={{margin: '8px'}}>
							{filterBy}
						</Chip>
						}
					</div>
					<div className="toolbar__actions">
						{this.props.isReadingAllHistory && <CircularProgress size={25} thickness={3} color="#009688"/>}
						{(chatType === 'SUPPORT' || chatType === 'APPEAL') &&
						<div>
							<button
								type="button" className="button button--icon" title="Фильтр"
								onClick={this.handleOpenPopover}><FilterList style={{color: 'inherit'}}/></button>
							<Popover
								open={this.state.openPopover}
								anchorEl={this.state.anchorEl}
								anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
								targetOrigin={{horizontal: 'left', vertical: 'top'}}
								onRequestClose={this.handlePopoverClose}
								autoCloseWhenOffScreen={true}
								animated={false}>
								{this.state.filterCriteria.length === 0 ?
									<Menu desktop={true}>
										<MenuItem>Нет доступных фильтров</MenuItem>
									</Menu>
									:
									<Menu onItemClick={this.handleOnItemClick} desktop={true}>
										{this.state.filterCriteria.sort((s1, s2) => s1.shortName.localeCompare(s2.shortName))
											.map(fc => <MenuItem
												key={fc.id} value={fc.shortName}
												primaryText={fc.shortName}/>)}
									</Menu>
								}
							</Popover>
						</div>
						}
						<div>
							<button
								type="button" className="button button--icon" title="Меню"
								onClick={this.handleOpenPopoverActions}><MoreVertIcon style={{color: 'inherit'}}/>
							</button>
							<Popover
								open={this.state.openPopoverActions}
								anchorEl={this.state.anchorEl}
								anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
								targetOrigin={{horizontal: 'left', vertical: 'top'}}
								onRequestClose={this.handlePopoverActionsClose}
								autoCloseWhenOffScreen={true}
								animated={false}>
								{chatType !== 'QUIZ' && <Menu desktop={true}>
									<MenuItem
										primaryText={CHAT_ACTIONS[chatType]} leftIcon={<IconAdd/>}
										onClick={this.handleCreateChat}/>
									{chatType === 'APPEAL' &&
									<MenuItem
										primaryText={CHAT_ACTIONS.APPLICATION} leftIcon={<IconDesc/>}
										onClick={this.handleCreateApplicationChat}/>}
									{chatType !== 'MYANNOUNCEMENT' &&
									<MenuItem
										primaryText={CHAT_TYPES_READ[chatType]} leftIcon={<IconDraft/>}
										onClick={this.handleReadMessages}/>}
								</Menu>
								}
								{(chatType === 'QUIZ' && (this.props.uid === 'e27864' || this.props.uid ==='e15142')) &&
								<Menu desktop={true}>
									<MenuItem
										primaryText={CHAT_ACTIONS[chatType]} leftIcon={<IconAdd/>}
										onClick={this.handleCreateChat}/>
								</Menu>
								}
							</Popover>
						</div>
					</div>

				</header>
				{this.renderChat(this.props)}
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	const chatType = ownProps.match.params.type !== 'support' ? ownProps.match.params.type.toUpperCase()
		.slice(0, ownProps.match.params.type.length - 1) : 'support';
	return {
		chatType,
		isReadingAllHistory: state.messenger.isReadingAllHistory,
		uid: userIdSelector(state),
		chats: getFilteredDialogs(state, {type: chatType}),
		hasMoreChats: state.messenger.hasMoreDialogs[chatType],
		status: state.messenger.status,
		quiz: state.quiz.quiz,
		loadingQuiz: state.quiz.loadingQuiz,
		loadingQuizResult: state.quiz.loadingQuizResult,
		userResult: state.quiz.userResult,
		userNotAnswer: state.quiz.chats,
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		getDialogs,
		getHistory,
		readHistory,
		readAllHistory,
		getMessageViewers,
		getQuiz,
		getChatFull,
		getUserNotAnswer,
		clearDialogsState,
		setSupportFilter,
		deleteMyAnnouncement,
		changeConfirm,
		getConfirmFull,
		getUserResults,
		sendResult,
		updateUserResult,
		sendViewed
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);