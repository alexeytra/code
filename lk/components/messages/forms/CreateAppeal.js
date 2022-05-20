import React from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm, change, untouch} from 'redux-form';
import {rfPicklist, rfTextarea} from './../../common/redux-form-wrapper';
import PickListItem from './../../common/forms/PicklistItem';
import {requireFields} from './../../../../utils/utility';
import Scroller from './../../common/Scroller';
import Spinner from './../../common/Spinner';
import {getAppealsDepartment, getAppealsByDepartment} from './../../../../utils/api';
import {rfFilePicker} from '../../common/redux-form-wrapper';
import {Card, CardText} from 'material-ui/Card';

/**
 * Компонент - Создание Обращения
 */
class CreateSupportForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedDepartment: false,
		}
	}

	static propTypes = {
		appeals: PropTypes.array.isRequired,
		departments: PropTypes.array.isRequired,
		onCreateChat: PropTypes.func.isRequired,
		onLoadSupportsByDepartment: PropTypes.func.isRequired
	};

	static defaultProps = {
		appeals: []
	};

	submit = (values) => {
		const {message, users, files} = values;
		return this.props.onCreateChat({type: 'APPEAL', message, users: [users], files});
	};

	handleChange = (event, value) => {
		if (value !== '' || value !== undefined) {
			this.setState({selectedDepartment: true});
			this.props.dispatch(change('CreateChat', 'users', null));
			this.props.onLoadSupportsByDepartment(value);
		}
	};

	render() {
		const {appeals, departments, handleSubmit, valid, submitting} = this.props;
		return (
			<Scroller>
				<div className="chat__create is-relative">
					{submitting && <Spinner/>}
					<Card style={{marginTop: '20px', marginBottom: '20px'}}>
						<CardText>
							<p>Здесь вы можете обратиться к подразделению с вопросом</p>
						</CardText>
					</Card>
					<form className="form--stacked" onSubmit={handleSubmit(this.submit)} style={{width: '100%'}} autoComplete="off">
						<Field name="department" component={rfPicklist} label="Подразделение" required onChange={this.handleChange}>
							{departments
								.sort((s1, s2) => s1.departmentShortName.localeCompare(s2.departmentShortName))
								.map(departments => <PickListItem key={departments.departmentCode} value={departments.departmentCode} label={`${departments.departmentName} (${departments.departmentShortName}) `} />)}
						</Field>
						{this.state.selectedDepartment &&
						<Field name="users" component={rfPicklist} label="Тема" required>
							{appeals.sort((s1, s2) => s1.shortName.localeCompare(s2.shortName))
								.map(appeal => <PickListItem
									key={appeal.id} value={appeal.id}
									label={appeal.shortName}/>)}
						</Field>
						}
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

const validate = values => requireFields('message', 'department', 'users')(values);
const CreateSupportFormWrapper = reduxForm({form: 'CreateChat', validate})(CreateSupportForm);

export default class CreateSupportContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			appeals: [],
			departments: [],
			isLoading: true
		};
	}

	static propTypes = {
		onCreateChat: PropTypes.func.isRequired,
		onSuccess: PropTypes.func.isRequired
	};

	componentDidMount() {
		getAppealsDepartment().then(data => this.setState({departments: data, isLoading: false}));
	}

	handleLoadSupports = (code) => {
		getAppealsByDepartment(code).then(data => this.setState({appeals: data}));
	};

	render() {
		if (this.state.isLoading) {
			return (
				<div className="p-around--medium is-relative">
					<Spinner/>
				</div>
			);
		} else {
			return (<CreateSupportFormWrapper appeals={this.state.appeals} departments={this.state.departments} onCreateChat={this.props.onCreateChat} onSubmitSuccess={this.props.onSuccess} onLoadSupportsByDepartment={this.handleLoadSupports}/>);
		}
	}
}