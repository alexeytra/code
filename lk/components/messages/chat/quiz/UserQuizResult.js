import React from 'react'
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form'
import {rfPicklist} from '../../../common/redux-form-wrapper';
import {Divider} from 'material-ui';
import {getUsersCheckListQuiz, getUsersListQuiz} from '../../../../../utils/api';
import Spinner from '../../../common/Spinner';
import PicklistItem from '../../../common/forms/PicklistItem';
import RenderUserResult from './RenderUserResult';

/**
 * Компонент - Результат пользователя
 */
class UserQuizResult extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userList: [],
			userCheckList: [],
			isUserChoosen: false,
			onCloseModal: PropTypes.func,
		};
	}

	static propTypes = {
		chatId: PropTypes.number.isRequired,
		getUserResults:PropTypes.func.isRequired,
		loadingQuizResult:PropTypes.bool,
		onCloseModal: PropTypes.func,
		onSendViewed: PropTypes.func,
		updateUserResult:PropTypes.func.isRequired,
		userResult:PropTypes.object,
	};

	componentDidMount() {
		getUsersListQuiz(this.props.chatId).then(res => {
			this.setState({userList: res});
		});
		getUsersCheckListQuiz(this.props.chatId).then(resCheck => {
			this.setState({userCheckList: resCheck});
		});
	}

	handleChange = (_, userId) => {
		this.props.getUserResults(this.props.chatId, userId);
		this.setState({isUserChoosen: true});
	};

	handleSubmit = (values) => {
		const {updateUserResult} = this.props;
		const obj = {
			updateResultLists: []
		};
		Object.entries(values).forEach(([key, value]) => {
			const answerId = key.split('_')[1];
			Object.entries(value).map(([key, value]) => {
				obj.updateResultLists.push({
					answerId,
					newResult: value,
				})
			});
		});
		updateUserResult(obj);
	};

	render() {
		return (
			<div className="quiz">
				<div className="quiz__title">
					<div>Результаты опроса</div>
					<div><button className="button button--destructive" onClick={this.props.onCloseModal}>Закрыть</button></div>
				</div>
				<Divider />
				<div className="quiz__content">
					<form
						className="form--stacked" style={{width: '100%'}}
						autoComplete="off">
						<Field name="quizId" component={rfPicklist} label="Опрашиваемые" required onChange={this.handleChange}>
							{this.state.userList
								.map(selectQuiz => <PicklistItem key={selectQuiz.id} value={selectQuiz.id} label={`${selectQuiz.lastName} ${selectQuiz.firstName} ${selectQuiz.patronymic} (${selectQuiz.information})`}/>)}
						</Field>
						<Field name="checkUser" component={rfPicklist} label="Проверенные" required onChange={this.handleChange}>
							{this.state.userCheckList
								.map(selectQuizCheck => <PicklistItem key={selectQuizCheck.id} value={selectQuizCheck.id} label={`${selectQuizCheck.lastName} ${selectQuizCheck.firstName} ${selectQuizCheck.patronymic} (${selectQuizCheck.information})`}/>)}
						</Field>
					</form>
				</div>
				<Divider />
				<div className="quiz__content">
					{this.state.isUserChoosen && (this.props.loadingQuizResult ?
						<Spinner/>
						:
						<RenderUserResult userResult={this.props.userResult} onSendViewed={this.props.onSendViewed} chatId={this.props.chatId} onSubmit={this.handleSubmit} onCloseModal={this.props.onCloseModal}/>
					)}
				</div>
			</div>

		);
	}
}

export default reduxForm({
	form: 'userQuizResult',
})(UserQuizResult);