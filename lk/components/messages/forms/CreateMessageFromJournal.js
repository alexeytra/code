import React from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import {rfTextarea} from './../../common/redux-form-wrapper';
import {requireFields} from './../../../../utils/utility';
import Scroller from './../../common/Scroller';
import Spinner from './../../common/Spinner';
import {rfFilePicker, rfUsersPicker} from '../../common/redux-form-wrapper';
import Input from '../../common/forms/Input';

/**
 * Компонент - Создание сообщения из журнала
 */
class CreateMessageFromJournal extends React.Component {

	static propTypes = {
		isChat: PropTypes.boolean,
		onChangeName: PropTypes.func,
		onCreateChat: PropTypes.func.isRequired,
		themeName: PropTypes.string
	};

	static defaultProps={
		isChat: false,
	};

	submit = (values) => {
		const {name, message, users, files} = values;
		return this.props.onCreateChat({type: this.props.isChat?'CHAT':'ANNOUNCEMENT', name, message, users, files});
	};

	render() {
		const {handleSubmit, valid, submitting} = this.props;
		return (
			<Scroller>
				<div className="chat__create is-relative">
					{submitting && <Spinner/>}
					<form className="form--stacked" onSubmit={handleSubmit(this.submit)} style={{width: '100%'}} autoComplete="off">
						<Input name="name" label="Тема" value={this.props.themeName} onChange={(val) => this.props.onChangeName(val)}/>
						<Field name="message" component={rfTextarea} label="Сообщение" required/>
						<Field name="files" component={rfFilePicker} maxFiles={10}/>
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
	return requireFields('name', 'message')(values);
};
export default reduxForm({form: 'CreateMessageFromJournal', asyncBlurFields: ['name', 'message'], validate})(CreateMessageFromJournal);