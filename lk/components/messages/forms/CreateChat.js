import React from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import {rfInput, rfTextarea} from './../../common/redux-form-wrapper';
import {requireFields} from './../../../../utils/utility';
import Scroller from './../../common/Scroller';
import Spinner from './../../common/Spinner';
import {rfUsersPicker} from '../../common/redux-form-wrapper';
import {Card, CardText} from 'material-ui/Card';

/**
 * Компонент - Создание чата
 */
class CreateChat extends React.Component {

	static propTypes = {
		onCreateChat: PropTypes.func.isRequired,
		users: PropTypes.array,
	};

	submit = (values) => {
		const {name, message, users, files} = values;
		return this.props.onCreateChat({type: 'CHAT', name, message, users, files});
	};

	render() {
		const {handleSubmit, valid, submitting} = this.props;
		return (
			<Scroller>
				<div className="chat__create is-relative">
					{submitting && <Spinner/>}
					<Card style={{marginTop: '20px', marginBottom: '20px'}}>
						<CardText>
							<p/><b>Внимание!</b> Пожалуйста, относитесь ответственно к выбору получателей (поле "Участники обсуждения"), чтобы сотрудники и студенты нашего университета не тратили своё время на просмотр ненужной информации.
						</CardText>
					</Card>
					<form className="form--stacked" onSubmit={handleSubmit(this.submit)} style={{width: '100%'}} autoComplete="off">
						<Field name="name" component={rfInput} label="Тема" required/>
						<Field name="message" component={rfTextarea} label="Сообщение" required/>
						<Field name="users" component={rfUsersPicker} label="Участники обсуждения" required treeCheckable/>
						<div className="form-element">
							<div className="grid grid--align-end">
								<button type="submit" className="button button--brand" disabled={!valid || submitting}>
									Создать
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
	const errors = requireFields('name', 'message')(values);
	if (!values.users || values.users.length === 0) {
		errors.users = 'Обязательное поле';
	}
	return errors;
};
export default reduxForm({form: 'CreateChat', asyncBlurFields: ['users', 'name', 'message'], validate})(CreateChat);