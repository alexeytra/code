import React from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import {rfInput, rfTextarea, rfCheckbox} from './../../common/redux-form-wrapper';
import {requireFields} from './../../../../utils/utility';
import Scroller from './../../common/Scroller';
import Spinner from './../../common/Spinner';
import {rfFilePicker, rfUsersPicker} from '../../common/redux-form-wrapper';
import {Card, CardText} from 'material-ui/Card';

/**
 * Компонент - Создание Объявления
 */
class CreateAnnouncement extends React.Component {

	static propTypes = {
		onCreateChat: PropTypes.func.isRequired
	};

	submit = (values) => {
		const {name, message, users, files, confirm} = values;
		return this.props.onCreateChat({type: 'ANNOUNCEMENT', name, message, users, files, confirm});
	};

	render() {
		const {handleSubmit, valid, submitting} = this.props;
		return (
			<Scroller>
				<div className="chat__create is-relative">
					{submitting && <Spinner/>}
					<Card style={{marginTop: '20px', marginBottom: '20px'}}>
						<CardText>
							Чтобы сообщить какую-то информацию нескольким людям, вы можете использовать объявления.
							Получатели смогут просмотреть ваше сообщение, но не смогут ответить на него или
							прокомментировать.
							<p/>Если вам нужно создать диалог с несколькими пользователями, вы можете использовать
							обсуждения.
							<div style={{marginTop: '10px'}}>
								<p/><b>Внимание!</b> Пожалуйста, относитесь ответственно к выбору получателей (поле
								"Получатели"),
								чтобы сотрудники и студенты нашего университета не тратили своё время на просмотр
								ненужной информации.
							</div>
						</CardText>
					</Card>
					<form className="form--stacked" onSubmit={handleSubmit(this.submit)} style={{width: '100%'}}
						  autoComplete="off">
						<Field name="name" component={rfInput} label="Тема" required/>
						<Field name="users" component={rfUsersPicker} label="Получатели" required treeCheckable/>
						<Field name="message" component={rfTextarea} label="Сообщение" required/>
						<hr />
						<p>Подтверждение о прочтении (например, отправка важной информации). Подтвердивших пользователей Вы можете посмотреть в разделе <b>'Мои объявления'</b>.</p>
						<p />
						<Field name="confirm" component={rfCheckbox} label="Требуется подтверждение"/>
						<hr />
						<Field name="files" component={rfFilePicker} maxFiles={10}/>
						<div className="form-element">
							<div className="grionSubmitSuccessd grid--align-end">
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
	const errors = requireFields('name', 'message')(values);
	if (!values.users || values.users.length === 0) {
		errors.users = 'Обязательное поле';
	}
	return errors;
};
export default reduxForm({
	form: 'CreateAnnouncement',
	asyncBlurFields: ['users', 'name', 'message', 'confirm'],
	validate
})(CreateAnnouncement);