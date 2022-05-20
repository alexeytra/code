import React from 'react';
import CheckBoxIcon from 'material-ui/svg-icons/action/check-circle';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import PropTypes from 'prop-types';

/**
 * Компонент - Кнопка
 */
export default class AnnButton extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			hidden: null,
		};
	}

	static propTypes = {
		chat: PropTypes.object.isRequired,
		hidden: PropTypes.bool.isRequired,
		onDeleteMyAnnouncement: PropTypes.func.isRequired,
	};
	static defaultProps = {
		onClick: () => {}
	};

	componentDidMount() {
		const {hidden, chat} = this.props;
		this.setState({
			hidden,
			status: chat.type === 'ANNOUNCEMENT' ? 'ANNOUNCEMENT' : 'MYANNOUNCEMENT'
		});
	};

	handleStatus = () => {
		const {chat} = this.props;
		const {hidden, status} = this.state;
		const request = {
			chatId: chat.id,
			status: chat.type === 'ANNOUNCEMENT' ? 'MYANNOUNCEMENT' : 'ANNOUNCEMENT'
		};
		this.props.onDeleteMyAnnouncement(request);
		if (hidden)
			this.setState({hidden: false});
		else
			this.setState({hidden: true})

	};

	render() {
		const {hidden} = this.state;
		if (hidden)
			return (
				<button type="button" className="button button--neutral" style={{color: 'inherit', border: 'none'}} title={'Удалить объявление'} onClick={() => this.handleStatus()}>
					<CheckBoxIcon className="button__icon button__icon--left" style={{color: 'inherit', width: '18px', height: '18px', verticalAlign: 'middle'}}/>
					<span className="text-body--strong">Показать</span>
				</button>
			);
		else return (
			<button type="button" className="button button--neutral" style={{color: 'inherit', border: 'none'}} title={'Удалить объявление'} onClick={() => this.handleStatus()}>
				<DeleteIcon className="button__icon button__icon--left" style={{color: 'inherit', width: '18px', height: '18px', verticalAlign: 'middle'}}/>
				<span className="text-body--strong">Удалить</span>
			</button>
		);
	}

};