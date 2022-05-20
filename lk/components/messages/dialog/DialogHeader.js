import React from 'react';
import PropTypes from 'prop-types';
import UserAvatar from './../../common/UserAvatar';
import IconInfo from 'material-ui/svg-icons/action/info';
import IconChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import IconNotificationsOff from 'material-ui/svg-icons/social/notifications-off';
import {getUserFIO, getUserInfos} from '../utils';
import {defCase} from '../../../../utils/utility';
import {APPLICATION_TYPES_STATUS} from "../../../../constants/AppConstants";

/**
 * Компонент - Заголовок диалога
 */
export default class DialogHeader extends React.Component {

	static propTypes = {
		deletedMessage: PropTypes.array.isRequired,
		handlerOpenDialogDelete: PropTypes.func.isRequired,
		info: PropTypes.object,
		onBack: PropTypes.func.isRequired,
		onClearChooseMessage: PropTypes.func.isRequired,
		onViewInfo: PropTypes.func.isRequired,
		uid: PropTypes.string.isRequired,
		statusApplication: PropTypes.string,
	};

	static defaultProps = {
		onBack: () => {},
		onViewInfo: () => {}
	};

	renderPeerInfo = () => {
		const {uid, info, deletedMessage, statusApplication} = this.props;
		switch (info.type) {
			case 'DIALOGUE':
				return (
					<div className="dialog__header__peer">
						<div className="media media--center">
							<div className="media__figure">
								<UserAvatar user={info.user}/>
							</div>
							<div className="media__body">
								<p className="truncate text-body--strong">
									{info.notify !== undefined && !info.notify && <IconNotificationsOff style={{color: 'rgba(0,0,0,0.6)', height: '16px', width: '16px', verticalAlign: 'middle'}}/>}
									<span>{getUserFIO(info.user)}</span>
								</p>
								<p className="truncate text-body--small">{getUserInfos(info.user)}</p>
							</div>
						</div>
					</div>
				);
			case 'SUPPORT':
				return (
					<div className="dialog__header__peer">
						<div className="media media--center">
							<div className="media__figure">
								<UserAvatar text={info.name}/>
							</div>
							<div className="media__body">
								<p className="truncate text-body--strong">
									{info.notify !== undefined && !info.notify && <IconNotificationsOff style={{color: 'rgba(0,0,0,0.6)', height: '16px', width: '16px', verticalAlign: 'middle'}}/>}
									<span>{info.name}</span>
								</p>
								<p className="truncate text-body--small">
									{info.user && info.user.id !== uid ? getUserInfos(info.user) : 'Обращение в техподдержку'}
								</p>
							</div>
						</div>
					</div>
				);
			default:
				return (
					<div className="dialog__header__peer">
						<div className="media media--center">
							<div className="media__figure">
								<UserAvatar text={info.name}/>
							</div>
							<div className="media__body">
								<p className="truncate text-body--strong" >
									{info.notify !== undefined && !info.notify && <IconNotificationsOff style={{color: 'rgba(0,0,0,0.6)', height: '16px', width: '16px', verticalAlign: 'middle'}}/>}
									<span>{info.name}</span>

								</p>
								<p className="truncate text-body--small">{`Участников: ${info.participantsCount}`}</p>
							</div>
							<div className="m-left--large">
								{statusApplication === APPLICATION_TYPES_STATUS.SUBMITTED && <div
									className="chat__status chat__status__submitted">{statusApplication}</div>}
								{statusApplication === APPLICATION_TYPES_STATUS.PROGRESS &&
								<div className="chat__status chat__status__progress">{statusApplication}</div>}
								{statusApplication === APPLICATION_TYPES_STATUS.ACCEPTED &&
								<div className="chat__status chat__status__complete">{statusApplication}</div>}

							</div>
						</div>
					</div>
				);
		}
	};

	render() {
		return (
			<section className="dialog__header">
				<div className="dialog__header__back">
					<button type="button" className="button button--icon" onClick={this.props.onBack}>
						<IconChevronLeft style={{color: 'inherit'}}/>
					</button>
				</div>
				{this.props.deletedMessage.length > 0 &&
				<div >
					<button type="button" className="button button--destructive" onClick={() => this.props.handlerOpenDialogDelete()}>
						Удалить {`${this.props.deletedMessage.length } ${ defCase(this.props.deletedMessage.length, ['сообщение', 'сообщения', 'сообщений'])}`}
					</button>

					<button type="submit" className="button button--brand" onClick={() => this.props.onClearChooseMessage()}>
                        Отмена
					</button>
				</div>}
				{this.props.deletedMessage.length === 0 && [this.renderPeerInfo(),
					<div className="dialog__header__actions">
						<button type="button" className="button button--icon" onClick={() => this.props.onViewInfo()}>
							<IconInfo style={{color: 'inherit'}}/>
						</button>
					</div>]}
			</section>
		);
	}
}