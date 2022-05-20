import React from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import {rfInput, rfTextarea, rfCheckbox} from './../../common/redux-form-wrapper';
import {requireFields} from './../../../../utils/utility';
import Scroller from './../../common/Scroller';

/**
 * Компонент - Редактирование объявления
 */
class EditAnnouncement extends React.Component {

	static propTypes = {
		handleSubmit: PropTypes.func,
		initialize: PropTypes.func,
		message: PropTypes.string,
		name: PropTypes.string,
		onEditAnnouncement: PropTypes.func.isRequired,
		submitting: PropTypes.bool,
		valid: PropTypes.bool
	};

	componentDidMount(): void {
		this.props.initialize({ name: this.props.name, message: this.props.message });
	}

	submit = (values) => {
		const {name, message} = values;
		return this.props.onEditAnnouncement({name, message});
	};

	render() {
		const {handleSubmit, valid, submitting} = this.props;
		return (
			<Scroller>
				<div className="chat__create is-relative">
					<form
						className="form--stacked" onSubmit={handleSubmit(this.submit)} style={{width: '100%'}}
						  autoComplete="off">
						<Field name="name" component={rfInput} label="Тема" required/>
						<Field name="message" component={rfTextarea} label="Сообщение" required/>
						{/* <Field name="files" component={rfFilePicker} maxFiles={10}/>*/}
						<div className="form-element">
							<div className="grid grid--align-end">
								<button type="submit" className="button button--brand" disabled={!valid || submitting}>
									Изменить
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
export default reduxForm({
	form: 'EditAnnouncement',
	asyncBlurFields: ['name', 'message'],
	validate
})(EditAnnouncement);