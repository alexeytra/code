import React from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import {rfInput, rfTextarea} from './../../common/redux-form-wrapper';
import {requireFields} from './../../../../utils/utility';
import Scroller from './../../common/Scroller';
import Spinner from './../../common/Spinner';
import {rfPicklist, rfUsersPicker} from '../../common/redux-form-wrapper';
import {getQuizList} from '../../../../utils/api';
import PicklistItem from '../../common/forms/PicklistItem';

/**
 * Компонент - Публикация опроса
 */
class PostMyQuiz extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			quizzes: [],
		};
	}

	static propTypes = {
		onCreateChat: PropTypes.func.isRequired
	};

	submit = (values) => {
		const {name, message, users, files , quizId} = values;
		return this.props.onCreateChat({type: 'QUIZ', name, message, users, files, quizId});
	};

	componentDidMount() {
		getQuizList().then(res => {
			this.setState({quizzes: res.selectQuiz});
		})
	}

	render() {
		const {handleSubmit, valid, submitting} = this.props;
		return (
			<Scroller>
				<div className="chat__create is-relative">
					{submitting && <Spinner/>}
					<form
						className="form--stacked" onSubmit={handleSubmit(this.submit)} style={{width: '100%'}}
						  autoComplete="off">
						<Field name="name" component={rfInput} label="Тема" required/>
						<Field name="message" component={rfTextarea} label="Сообщение" required/>
						<Field name="users" component={rfUsersPicker} label="Получатели" required treeCheckable/>
						<Field name="quizId" component={rfPicklist} label="Опрос" required onChange={this.handleChange}>
							{this.state.quizzes
								.map(selectQuiz => <PicklistItem key={selectQuiz.formId} value={selectQuiz.formId} label={`${selectQuiz.formName}`} />)}
						</Field>
						<div className="form-element">
							<div className="grid grid--align-end">
								<button type="submit" className="button button--brand" disabled={!valid || submitting}>
									Отправить
								</button>
							</div>
						</div>
					</form>
				</div>
			</Scroller>
		);
	}
}

const validate = values => {
	const errors = requireFields('name', 'message','quizId')(values);
	if (!values.users || values.users.length === 0) {
		errors.users = 'Обязательное поле';
	}
	return errors;
};
export default reduxForm({
	form: 'PostMyQuiz',
	asyncBlurFields: ['users', 'name', 'quizId','message'],
	validate
})(PostMyQuiz);