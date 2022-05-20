import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import UserAvatar from '../../common/UserAvatar';
import {getUserFIO, getUserInfos} from '../utils';
import IconClear from 'material-ui/svg-icons/content/clear';
import IconStar from 'material-ui/svg-icons/toggle/star';

/**
 * Компонент - Участники чата
 */
export default class ChatParticipant extends React.Component {

	static propTypes = {
		canRemoveChatParticipant: PropTypes.bool,
		className: PropTypes.string,
		onRemoveChatParticipant: PropTypes.func,
		participant: PropTypes.object.isRequired,
		uid: PropTypes.string.isRequired,
	};

	static defaultProps = {
		canRemoveChatParticipant: false
	};

	handleRemoveChatUser = () => this.props.onRemoveChatParticipant && this.props.onRemoveChatParticipant(this.props.participant.id);

	render() {
		const {uid, className, canRemoveChatParticipant, participant} = this.props;
		const {user} = participant;
		const userName = participant.type === 'USER' ? getUserFIO(user) : (user.name || 'Удаленная группа');
		const userInfo = participant.type === 'USER' ? getUserInfos(user) : `Участники: ${user.usersCount || 0}`;
		const isCreator = !!(participant.flags & 0x1);
		const isAdmin = !!(participant.flags & 0x2);

		return (
			<div className={classNames(className, 'chat__participant media media--center')}>
				<div className="media__figure">
					<UserAvatar type={participant.type} user={user}/>
				</div>
				<div className="media__body">
					<div className="grid grid--align-spread">
						<div>
							<p className="text-body--strong">
								{isAdmin && <IconStar style={{height: '16px', width: '16px', verticalAlign: 'middle', color: '#2196f3'}}/>}
								<span>{userName}</span>
							</p>
							<p className="text-body--small">{userInfo}</p>
						</div>
						{canRemoveChatParticipant && participant.id !== uid && !isCreator && (
							<div className="chat__participant-action">
								<button type="button" className="button button--icon button--icon-error" onClick={this.handleRemoveChatUser}>
									<IconClear style={{cursor: 'pointer', color: 'inherit', height: '18px', width: '18px'}}/>
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}
