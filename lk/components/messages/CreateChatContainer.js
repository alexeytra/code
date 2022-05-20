import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SubmissionError} from 'redux-form';
import CreateAnnouncement from './forms/CreateAnnouncement';
import CreateDialog from './forms/CreateDialog';
import CreateChat from './forms/CreateChat';
import CreateSupport from './forms/CreateSupport';
import IconChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import {createChat} from '../../../actions/MessengerActions';
import CreateAppeal from './forms/CreateAppeal';
import CreateApplication from './forms/CreateApplication';
import CreateMyQuiz from './forms/PostMyQuiz';

/**
 * Контейнер - Создание диалогов чатов обращений техподдержек
 */
class CreateChatContainer extends React.Component {

	static propTypes = {
		chatType: PropTypes.string.isRequired,
		createChat: PropTypes.func.isRequired,
		history: PropTypes.object,
		location: PropTypes.object,
		match: PropTypes.object,
		users: PropTypes.array,
	};

	handleCancel = () => {
		const {history, match} = this.props;
		history.push(match.url.substring(0, match.url.lastIndexOf('/')));
		if(match.params.type === 'applications') history.push('/im/appeals');
	};

	handleSelectUser = (userId) => this.props.history.push(`/im/dialogues/${userId}`);

	handleSubmit = (chat) => this.props.createChat(chat).then(action => {
		if (action.type.endsWith('_COMPLETED')) {
			return action.payload.chats[0];
		} else {
			throw new SubmissionError({_error: 'При отправке данных возникла ошибка.'});
		}
	});

	handleSubmitSuccess = (chat) => {
		console.log('handleSubmitSuccess', chat.type);
		const {history} = this.props;
		if (chat.type === 'ANNOUNCEMENT') {
			return history.push('/im/announcements');
		} else if(chat.type === 'QUIZ') {

			return history.push('/im/quizs');
		} else {
			return history.push(`/im/${chat.type.toLowerCase()}s/${chat.id}`);
		}
	};

	render() {
		const {chatType, users} = this.props;
		return (
			<div className="container container--wb">
				<div className="toolbar">
					<div className="toolbar__first">
						<button type="button" className="button button--icon" onClick={this.handleCancel}>
							<IconChevronLeft style={{color: 'inherit'}}/>
						</button>
					</div>
					<div className="toolbar__title">
						{CREATE_NEW_CHAT[chatType]}
					</div>
				</div>
				{chatType === 'ANNOUNCEMENT' && <CreateAnnouncement onCreateChat={this.handleSubmit} onSubmitSuccess={this.handleSubmitSuccess}/>}
				{chatType === 'MYANNOUNCEMENT' && <CreateAnnouncement onCreateChat={this.handleSubmit} onSubmitSuccess={this.handleSubmitSuccess}/>}
				{chatType === 'DIALOGUE' && <CreateDialog onSelectUser={this.handleSelectUser}/>}
				{chatType === 'CHAT' && <CreateChat initialValues={{users}} membersLabel="Участники обсуждения" nameLabel="Тема обсуждения" onCreateChat={this.handleSubmit} onSubmitSuccess={this.handleSubmitSuccess}/>}
				{chatType === 'SUPPORT' && <CreateSupport onCreateChat={this.handleSubmit} onSuccess={this.handleSubmitSuccess}/>}
				{chatType === 'APPEAL' && <CreateAppeal onCreateChat={this.handleSubmit} onSuccess={this.handleSubmitSuccess}/>}
				{chatType === 'APPLICATION' && <CreateApplication onCreateChat={this.handleSubmit} onSuccess={this.handleSubmitSuccess}/>}

				{chatType === 'QUIZ' && <CreateMyQuiz onCreateChat={this.handleSubmit} onSubmitSuccess={this.handleSubmitSuccess}/>}
				{/*{chatType === 'MYQUIZ' && <CreateMyQuiz onCreateChat={this.handleSubmit} onSuccess={this.handleSubmitSuccess}/>}*/}

			</div>
		);
	}
}

const CREATE_NEW_CHAT = {
	'ANNOUNCEMENT': 'Создать новое объявление',
	'MYANNOUNCEMENT': 'Создать новое объявление',
	'CHAT': 'Создать новое обсуждение',
	'DIALOGUE': 'Создать новый диалог',
	'SUPPORT': 'Создать новое обращение в техподдержку',
	'APPEAL': 'Создать обращение',
	'APPLICATION': 'Получить справку',
	//'MYQUIZ': 'Создать новый опрос',
	'QUIZ': 'Отправить опрос на прохождение'
};

function mapStateToProps(state, ownProps) {
	const params = new URLSearchParams(ownProps.location.search);
	return {
		users: params.has('users') ? params.get('users').split(',') : [],
		chatType: ownProps.match.params.type.toUpperCase().slice(0, ownProps.match.params.type.length - 1)
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({createChat}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateChatContainer);