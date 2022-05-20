import React from 'react'
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import {rfTextarea} from '../../../common/redux-form-wrapper';

/**
 * Компонент - Отрисовка Результата пользователя
 */
class RenderUserResult extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			checkSendViewed: true,
		};
	}

	static propTypes = {
		chatId: PropTypes.number.isRequired,
		handleSubmit: PropTypes.func,
		onCloseModal: PropTypes.func,
		onSendViewed: PropTypes.func,
		userResult: PropTypes.object,
	};

	handleMouseEnter = () => {
		const {uid, chat, onReadMessage} = this.props;

		if (!(chat.lastMessage.flags & 0x1) && !(chat.lastMessage.flags & 0x2)) {
			onReadMessage(uid, {peer: {chatId: chat.id}, maxId: chat.lastMessage.id});

		}
	};


	handleSendViewed = () => {
		const {onSendViewed,userResult} = this.props;
		const obj = {
			userId: userResult.userId,
			chatId: this.props.chatId,
		};
		this.setState({checkSendViewed: false});
		onSendViewed(obj);
	};

	renderTextarea = ({input, label, meta: {touched, error}}) => (
		<div>
			<label className="quiz__content__title_input">{label}</label>
			<div>
				<textarea {...input} placeholder={label} cols="200"/>
				{touched && error && <span>{error}</span>}
			</div>
		</div>
	);

	renderVariant = (variants) =>
		(
			<table className="table stripes numeration hover-rows">
				<thead>
					<tr>
						<th>№</th>
						<th>Вопросы</th>
						<th>Ответы</th>
						<th>Баллы</th>
					</tr>
				</thead>
				<tbody>
					{variants.map((variant, index) => {
						if (variant.isUserTextAnswer === 'true'&& variant.resultUserTextValue === 0) {
							return (
								<tr key={index}>

									<td>{index + 1}</td>
									<td>{variant.formQuestionName}</td>
									<td>{variant.resultUserText} (Поле было заполнено в ручную)</td>
									<td>
										<Field
											name={`text_${variant.formUserAnswerId}`}
											value={`${variant.formUserAnswerId}`}
											component={rfTextarea}
											cols="3"/>
									</td>
								</tr>
							);
						}
						if (variant.isUserTextAnswer === 'false') {
							return (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{variant.formQuestionName}</td>
									<td>{variant.formQuestionVariantName}</td>
									<td>{variant.formQuestionVariantValue}</td>
								</tr>
							);
						}
						if (variant.isUserTextAnswer === 'true' && variant.resultUserTextValue !== 0) {
							return (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{variant.formQuestionName}</td>
									<td>{variant.resultUserText} (Поле было заполнено в ручную)</td>
									<td>{variant.resultUserTextValue}</td>
								</tr>
							);
						}
					})}
				</tbody>

			</table>
		);

	renderMainAnswer = (variants) =>
		(
			<div>
				{variants.map((variant, index) => {
					if (variant.formQuestionVariantName == null) {
						return (

							<div key={index} className={'quiz__main_answer'}>
								<p>Полученый пользователем результат: <b>{variant.userAnswersResult}</b></p>
								<p>Количество набранных баллов: <b>{variant.userAnswerValue}</b></p>
							</div>
						);
					}
				})}

			</div>
		);

	render() {
		const {userResult} = this.props;
		const {handleSubmit} = this.props;
		if(this.state.checkSendViewed===true) {
			return (
				<div>
					<form onSubmit={handleSubmit}>
						{
							this.renderMainAnswer(userResult.userTestResults)
						}
						{
							this.renderVariant(userResult.resultList)
						}
						<button type="submit" className="button button--brand m-top--medium">Сохранить изменения
						</button>
						<button className="button button--brand m-top--medium" onClick={this.handleSendViewed}>Перенести
							в проверенные
						</button>
					</form>
				</div>
			);
		} else{
			return (
				<div>Студент перемещен в проверенные, перезапустить окно</div>
			);
		}
	}
}
export default reduxForm({
	form: 'renderUserResult',
})(RenderUserResult);
