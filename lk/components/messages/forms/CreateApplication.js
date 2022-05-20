import React from 'react';
import PropTypes from 'prop-types';
import {change, Field, reduxForm} from 'redux-form';
import CreateChat from './CreateChat';
import {requireFields} from '../../../../utils/utility';
import {
	getApplicationsByDepartment,
	getApplicationsDepartment
} from '../../../../utils/api';
import Spinner from '../../common/Spinner';
import Scroller from '../../common/Scroller';
import {Card, CardText} from 'material-ui/Card';
import {rfPicklist} from '../../common/redux-form-wrapper';
import PickListItem from '../../common/forms/PicklistItem';
import {APPLICATION_TYPES_STATUS} from '../../../../constants/AppConstants';


class CreateSupportForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedDepartment: false,
			selectedTheme: false,
		}
	}

	static propTypes = {
		appeals: PropTypes.array.isRequired,
		departments: PropTypes.array.isRequired,
		applications: PropTypes.array.isRequired,
		onCreateChat: PropTypes.func.isRequired,
		onLoadApplicationsByDepartment: PropTypes.func.isRequired
	};

	static defaultProps = {
		appeals: [],
		applications: [],
	};

	submit = (values) => {
		const {id} = values;
		const application = this.props.applications.find(elem => elem.id === id);
		const message = `Здравствуйте, я хочу получить следующую справку: ${application.name}`;
		return this.props.onCreateChat({type: 'APPEAL', message, users: [application.groupId], statusApplication: APPLICATION_TYPES_STATUS.SUBMITTED});
	};

	handleChange = (event, value) => {
		if (value !== '' || value !== undefined) {
			this.setState({selectedDepartment: true});
			this.props.dispatch(change('CreateChat', 'id', '-'));
			this.props.onLoadApplicationsByDepartment(value);
		}
	};

	render() {
		const {applications, departments, handleSubmit, valid, submitting} = this.props;
		return (
			<Scroller>
				<div className="chat__create is-relative">
					{submitting && <Spinner/>}
					<Card style={{marginTop: '20px', marginBottom: '20px'}}>
						<CardText>
							<p>Здесь вы можете получить справки у подразделений</p>
						</CardText>
					</Card>
					<form className="form--stacked" onSubmit={handleSubmit(this.submit)} style={{width: '100%'}} autoComplete="off">
						<Field name="department" component={rfPicklist} label="Подразделение" required onChange={this.handleChange}>
							{departments
								.sort((s1, s2) => s1.departmentShortName.localeCompare(s2.departmentShortName))
								.map(departments => <PickListItem key={departments.departmentCode} value={departments.departmentCode} label={`(${departments.departmentShortName}) ${departments.departmentName}`} />)}
						</Field>
						{this.state.selectedDepartment &&
						<Field name="id" component={rfPicklist} label="Справки" required>
							{applications.sort((s1, s2) => s1.name.localeCompare(s2.name))
								.map(application => {
									return <PickListItem
										key={application.id} value={application.id}
										label={application.name}/>
								})}
						</Field>
						}
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

const validate = values => requireFields('department', 'id')(values);
const CreateSupportFormWrapper = reduxForm({form: 'CreateChat', validate})(CreateSupportForm);

export default class CreateSupportContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			appeals: [],
			applications: [],
			departments: [],
			isLoading: true
		};
	}

	static propTypes = {
		onCreateChat: PropTypes.func.isRequired,
		onSuccess: PropTypes.func.isRequired
	};

	componentDidMount() {
		getApplicationsDepartment().then(data => this.setState({departments: data, isLoading: false}));
	}

	handleLoadApplications = (code) => {
		getApplicationsByDepartment(code).then(data => this.setState({applications: data}))
	};


	render() {
		if (this.state.isLoading) {
			return (
				<div className="p-around--medium is-relative">
					<Spinner/>
				</div>
			);
		} else {
			return (<CreateSupportFormWrapper applications ={this.state.applications} departments={this.state.departments} onCreateChat={this.props.onCreateChat} onSubmitSuccess={this.props.onSuccess} onLoadApplicationsByDepartment={this.handleLoadApplications}/>);
		}
	}
}