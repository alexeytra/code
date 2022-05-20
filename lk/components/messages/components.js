import React from 'react';
import {connect} from 'react-redux';
import {getUserFIO, getUserInfos} from './utils';
import UserAvatar from '../common/UserAvatar';
import classNames from 'classnames';

/**
 * Компонент -
 * @param className
 * @param userId
 * @param user
 * @param onClick
 * @returns {*}
 * @constructor
 */
export const User = ({className, userId, user, onClick}) => (
	<div className={classNames('media media--center', className)} onClick={onClick}>
		<div className="media__figure">
			<UserAvatar user={user} rounded/>
		</div>
		<div className="media__body">
			<p className="truncate text-body--strong" title={getUserFIO(user)}>{getUserFIO(user)}</p>
			<p className="truncate text-body--small">{getUserInfos(user)}</p>
		</div>
	</div>
);

/**
 * Компонент -
 * @param className
 * @param uid
 * @param userGroup
 * @param onClick
 * @returns {*}
 * @constructor
 */
export const UserGroup = ({className, uid, userGroup, onClick}) => (
	<div className={classNames('media media--center', className)} onClick={onClick}>
		<div className="media__figure">
			<UserAvatar text={userGroup.name} rounded/>
		</div>
		<div className="media__body">
			<p className="truncate text-body--strong" title={userGroup.name}>{userGroup.name}</p>
			<p className="truncate text-body--small">{`Участники: ${userGroup.usersCount}`}</p>
		</div>
	</div>
);

export const ConnectedUser = connect((state, ownProps) => ({user: state.messenger.users[ownProps.userId]}))(User);
