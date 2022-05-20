import React from 'react';
import PropTypes from 'prop-types';
import TreeSelect, {SHOW_PARENT} from 'rc-tree-select';
import {getSubgroups, getUsersGroups} from '../../../../utils/api';
import classNames from 'classnames';
import {getUserFIO, getUserInfos} from '../utils';

/**
 * Компонент - Выбор студента
 */
export default class StudentPicker extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			treeData: props.treeData,
			value: props.value || undefined
		};
	}

	static propTypes = {
		label: PropTypes.string,
		onChange: PropTypes.func,
		treeData: PropTypes.array.isRequired,
		value: PropTypes.any
	};

	static defaultProps = {
		treeData: [
			{key: 'GROUP_STUDENTS', value: 'GROUP_STUDENTS', label: 'Группа', isLeaf: false}
		],
		label: 'Получатели'
	};

	componentWillMount() {
		if (Array.isArray(this.props.value) && this.props.value.length > 0) {
			getUsersGroups(this.props.value)
				.then(payload => payload.map(group => ({key: group.id, value: group.id, label: `${group.name} (${group.usersCount})`, isLeaf: (!group.hasSubgroups && !group.usersCount)})))
				.then(data =>
					this.setState({treeData: data}));
		}
	}

	handleChange = (value) => {
		this.setState({value});
		if (this.props.onChange) {
			this.props.onChange(value);
		}
	};
	handleLoadData = (treeNode) => getSubgroups(treeNode.props.value)
		.then(payload => [...payload.users.map(user => ({key: user.id, value: user.id, label: `${getUserFIO(user)} ${getUserInfos(user)}`, isLeaf: true}))])
		.then(data => {
			this.setState({treeData: setChildren(this.state.treeData, treeNode.props.eventKey, data)}
			);
		});

	handleFocus = (e) => {
		if (this.props.onFocus) {
			this.props.onFocus(e);
		}
	};
	handleBlur = () => {
		if (this.props.onBlur) {
			this.props.onBlur(this.props.value);
		}
	};
	handleSearch = (t, e) => {
		console.log(t);
		console.log(e);
	};

	render() {
		return (
			<div className={classNames('form-element', {'has-error': !!this.props.errorText})} onFocus={this.handleFocus} onBlur={this.handleBlur}>
				<label className="form-element__label">
					{this.props.label}
					{this.props.required && <abbr className="required">*</abbr>}
				</label>
				<TreeSelect
					ref="treeSelect"
					style={{width: '100%'}}
					treeData={this.state.treeData}
					value={this.state.value}
					onSelect={this.handleSelect}
					onChange={this.handleChange}
					loadData={this.handleLoadData}
					onSearch={this.handleSearch}
					dropdownStyle={{maxHeight: '500px', overflow: 'auto', zIndex: 1500}}
					treeNodeFilterProp="label"
					notFoundContent="Не найдено"
					showCheckedStrategy={SHOW_PARENT}
					treeCheckable={this.props.treeCheckable}
					inputValue={null}
					treeLine/>
				{this.props.errorText && <span className="form-element__help">{this.props.errorText}</span>}
			</div>
		);
	}
}
const setChildren = (data, curKey, child) => data.map(item => item.key === curKey ? ({...item, children: child}) : (item.children ? ({...item, children: setChildren(item.children, curKey, child)}) : item));