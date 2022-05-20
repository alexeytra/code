import React from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import {rfInput, rfStudentsPicker, rfTextarea} from './../../common/redux-form-wrapper';
import {requireFields} from './../../../../utils/utility';
import Scroller from './../../common/Scroller';
import Spinner from './../../common/Spinner';

/**
 * Компонент - Создание чата для студентов
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
					<form className="form--stacked" onSubmit={handleSubmit(this.submit)} style={{width: '100%'}} autoComplete="off">
						<Field name="name" component={rfInput} label="Тема" required/>
						<Field name="message" component={rfTextarea} label="Сообщение" required/>
						<Field name="users" component={rfStudentsPicker} label="Участники обсуждения" required treeCheckable/>
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