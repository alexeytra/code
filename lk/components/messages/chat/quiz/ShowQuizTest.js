import React from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import {rfCheckbox} from '../../../common/redux-form-wrapper';
import FormSection from 'redux-form/es/FormSection';
import {Divider} from 'material-ui';

/**
 * Компонент - Показывать опрос
 */
class ShowQuizTest extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			openModal: false,
			activeTab: 'participants',
			deleteModal: false,
			btnStatus: false
		};
	}

	static propTypes = {
		handleSubmit: PropTypes.func,
		onCloseModal: PropTypes.func,
		quiz: PropTypes.object,
	};

	componentDidMount() {
		const {questions} = this.props.quiz;
	}

	renderRadio = ({input, label, type, meta: {touched, error}}) => (
		<div className="quiz__content__item__form_radio">
			<input {...input} type={type} placeholder={label}/> {touched && error && <span>{error}</span>}
			<label>{label}</label>
		</div>
	);

	renderTextarea = ({input, label, meta: {touched, error}}) => (
		<div>
			<label className="quiz__content__title_input">{label}</label>
			<div>
				<textarea {...input} placeholder={label} cols="200"/>
				{touched && error && <span>{error}</span>}
			</div>
		</div>
	);

	radioChange = (e) => {
		this.setState((prevState) => {
		});
	};

	renderVariants = ({fields, variants, type, id}) =>
		(

			<div>
				{variants.map((variant, index) => {
					if (variant.variantType === 'checkbox') {
						return (
							<div key={index}>

								<div>
									{
										type === 'YES'
										&& variant.variantName === null ?
											(<Field
												name={`text_${variant.variantId}`}
												value={`${variant.variantId}`}
												component={this.renderTextarea}
												label="Введите ваш ответ:"/>)
											:
											(<Field
												name={`variant_${variant.variantId}`}
												type="checkbox"
												value={`${variant.variantId}`}
												component={rfCheckbox}
												label={variant.variantName}
												format={v => v === `${variant.variantId}`}
												normalize={v => (v ? `${variant.variantId}` : '0')}/>

											)
									}
								</div>
							</div>
						);
					}
					if (variant.variantType === 'radiobutton') {
						return (
							<div key={index}>
								<Field
									name={'variant'}
									onChange={this.radioChange}
									type="radio"
									value={`${variant.variantId}`}
									// value={variant.variantId}
									component={this.renderRadio}
									label={variant.variantName}/>
							</div>
						);
					}
				})}

			</div>
		);

	render() {
		const {quizName, questions, checkUserResult, state} = this.props.quiz;
		const showQuizCheck = false;
		const {handleSubmit} = this.props;
		const question = questions;
		if (showQuizCheck === false) {
			if (checkUserResult === 'NO') {
				return (
					<div className="quiz">
						<div className="quiz__title">
							<div>{quizName}</div>
							<div>
								<button
									className="button button--destructive"
									onClick={this.props.onCloseModal}>Закрыть
								</button>
							</div>
						</div>
						<div><Divider/></div>
						<div className="quiz__content">

							<form onSubmit={handleSubmit}>
								{question.map((quest, index) => (
									<div key={quest.questionId} className="quiz__content__item">
										<div className="quiz__content__item_name">
											{`${index + 1 }) ${ quest.questionName}`}
										</div>
										<div>
											<FormSection
												name={`question_${ quest.questionId}`}
												component={this.renderVariants}
												variants={quest.questionVariants}
												id={quest.questionId}
												type={quest.isTextarea}/>
										</div>
									</div>
								)
								)}
								<Divider/>
								<button type="submit" className="button button--brand m-top--medium">Отправить</button>
							</form>
						</div>
					</div>
				);
			} else {
				if (state === 'CLOSED') {
					return (
						<div className="quiz">
							<div className="quiz__title">
								<div>Опрос был закрыт</div>
								<div>
									<button
										className="button button--destructive"
										onClick={this.props.onCloseModal}>Закрыть
									</button>
								</div>
							</div>
						</div>
					);
				} else {
					return (
						<div className="quiz">
							<div className="quiz__title">
								<div>Вы уже прошли этот опрос</div>
								<div>
									<button
										className="button button--destructive"
										onClick={this.props.onCloseModal}>Закрыть
									</button>
								</div>
							</div>
						</div>
					);
				}
			}
		}
	}
}

export default reduxForm({
	form: 'showQuizTest',
})(ShowQuizTest);

