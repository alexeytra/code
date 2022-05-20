import React from 'react';
import PropTypes from 'prop-types';
import {TransitionGroup} from 'react-transition-group';
import {findMembers} from './../../../../utils/api';
import IconSearch2 from './../../common/icons/utility/search';
import IconClear from './../../common/icons/utility/clear';
import Spinner from './../../common/Spinner';
import Scroller from '../../common/Scroller';
import {User} from '../components';
import debounce from 'lodash/debounce';
import {FadeTransition} from '../../common/csstransitions';

/**
 * Компонент - Создание диалога
 */
export default class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			searchText: '',
			results: [],
			hasMore: true
		};
		this.dimensions = null;
		this.isLoading = false;
		this.loadMembers = debounce(this.loadMembers, 250);
	}

	static propTypes = {
		onSelectUser: PropTypes.func.isRequired,
	};

	componentDidMount() {
		this.restoreScroll();
	}

	componentWillReceiveProps() {
		this.updateDimensions(this.refs.scroller.getDimensions());
	}

	updateDimensions(dimensions) {
		if (dimensions.scrollHeight === dimensions.scrollTop + dimensions.offsetHeight) {
			this.dimensions = null;
		} else {
			this.dimensions = dimensions;
		}
	}

	handleScroll = () => {
		const {searchText, results, hasMore} = this.state;
		const dimensions = this.refs.scroller.getDimensions();
		const coef = (dimensions.offsetHeight + dimensions.scrollTop) / dimensions.scrollHeight;
		if (!this.isLoading && hasMore && coef > 0.75) {
			this.loadMembers({query: searchText, offset: results.length}, false);
		}
	};

	loadMembers = (params, invalidateState) => {
		this.isLoading = true;
		findMembers(params)
			.then(payload => {
				this.isLoading = false;
				this.setState({results: invalidateState ? payload : [...this.state.results, ...payload], hasMore: payload.length === 100});
			});
	};

	handleChange = (event) => {
		const searchText = event.target.value;
		this.setState({searchText});
		return this.loadMembers({query: searchText}, true);
	};

	handleClear = () => {
		this.setState({searchText: '', results: []});
	};

	handleSelectUser = (user) => {
		this.props.onSelectUser(user.id);
	};

	restoreScroll() {
		const {dimensions, refs: {scroller}} = this;
		if (dimensions) {
			scroller.scrollTo(dimensions.scrollTop);
		} else {
			scroller.scrollToTop();
		}
	}

	render() {
		const {state: {searchText, results}, isLoading} = this;
		return (
			<div className="grid grid--vertical">
				<div className="input-has-icon input-has-icon--left-right">
					<IconSearch2 className="input__icon input__icon--left icon-text-default"/>
					<input className="input" value={searchText} placeholder="Поиск по ФИО, должности, подразделению, группе" onChange={this.handleChange}/>
					{searchText && (
						<button className="input__icon input__icon--right button button--icon" onClick={this.handleClear}>
							<IconClear className="button__icon"/>
						</button>
					)}
				</div>
				<Scroller ref="scroller" className="scroller__container--p-none p-vertical--small" onScroll={this.handleScroll}>
					<TransitionGroup component="ul" className="has-list-interactions has-dividers--top">
						{isLoading && (
							<FadeTransition>
								<li className="p-around--medium is-relative">
									<Spinner/>
								</li>
							</FadeTransition>
						)}
						{results.map(user => (
							<FadeTransition key={user.id}>
								<li className="list__item">
									<User className="p-vertical--x-small p-horizontal--medium" user={user} onClick={() => this.handleSelectUser(user)}/>
								</li>
							</FadeTransition>
						))}
					</TransitionGroup>
				</Scroller>
			</div>
		);
	}
}