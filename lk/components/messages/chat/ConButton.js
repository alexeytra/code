import React from 'react';
import CheckBoxIcon from 'material-ui/svg-icons/action/check-circle';
import PropTypes from 'prop-types';

/**
 * Компонент - Кнопка
 */
export default class ConButton extends React.Component {

	static propTypes = {
		chatId: PropTypes.number.isRequired,
		onConfirm: PropTypes.func.isRequired,
	};

	static defaultProps = {
		onConfirm: () => {},
	};


	render() {
		return (
			<button
				type="button" className="button button--neutral" style={{color: 'inherit', border: 'none'}}
				title={'Подтвердить объявление'} onClick={() => this.props.onConfirm(this.props.chatId)}>
				<CheckBoxIcon
					className="button__icon button__icon--left"
					style={{color: 'inherit', width: '18px', height: '18px', verticalAlign: 'middle'}}/>
				<span className="text-body--strong">Подтвердить</span>
			</button>
		);

	}

};