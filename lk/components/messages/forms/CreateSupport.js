import React from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import {rfPicklist, rfTextarea} from './../../common/redux-form-wrapper';
import PickListItem from './../../common/forms/PicklistItem';
import {requireFields} from './../../../../utils/utility';
import Scroller from './../../common/Scroller';
import Spinner from './../../common/Spinner';
import {getSupportChats} from './../../../../utils/api';
import {rfFilePicker} from '../../common/redux-form-wrapper';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import moment from 'moment';

/**
 * Компонент - Создание сообщения в техподдержку
 */
class CreateSupportForm extends React.Component {

	static propTypes = {
		onCreateChat: PropTypes.func.isRequired,
		supports: PropTypes.array.isRequired
	};

	static defaultProps = {
		supports: []
	};

	submit = (values) => {
		const {message, users, files} = values;
		return this.props.onCreateChat({type: 'SUPPORT', message, users: [users], files});
	};

	render() {
		const {supports, handleSubmit, valid, submitting} = this.props;
		return (
			<Scroller>
				<div className="chat__create is-relative">
					{submitting && <Spinner/>}
					<Card style={{marginTop: '20px', marginBottom: '20px'}}>
						<CardHeader
							title="Техподдержка"
							subtitle={moment().format('lll')}/>
						<CardText>
							<p>Если вопрос связан с <b>Microsoft Teams</b>, выберите в поле “Техподдержка (тема)” - “Teams”.</p>
							<p>Если вопрос связан с <b>MOODLE</b>, выберите в поле “Техподдержка (тема)” - "Сервер дистанционного образования (Moodle)"</p>
						</CardText>
					</Card>
					<form className="form--stacked" onSubmit={handleSubmit(this.submit)} style={{width: '100%'}} autoComplete="off">
						<Field name="users" component={rfPicklist} label="Техподдержка (тема)" required>
							{supports.sort((s1, s2) => s1.shortName.localeCompare(s2.shortName)).map(support  => <PickListItem key={support.id} value={support.id} label={support.shortName}/>)}
						</Field>
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

const validate = values => requireFields('message', 'users')(values);
const CreateSupportFormWrapper = reduxForm({form: 'CreateChat', validate})(CreateSupportForm);

export default class CreateSupportContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			supports: [],
			isLoading: true
		};
	}

	static propTypes = {
		onCreateChat: PropTypes.func.isRequired,
		onSuccess: PropTypes.func.isRequired
	};

	componentDidMount() {
		getSupportChats().then(data => this.setState({supports: data, isLoading: false}));
	}

	render() {
		if (this.state.isLoading) {
			return (
				<div className="p-around--medium is-relative">
					<Spinner/>
				</div>
			);
		} else {
			return (<CreateSupportFormWrapper supports={this.state.supports} onCreateChat={this.props.onCreateChat} onSubmitSuccess={this.props.onSuccess}/>);
		}
	}
}