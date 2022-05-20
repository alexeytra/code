import {dropUndefined} from '../../../utils/utility';

/**
 * Получение идентиифкатора пользователя
 * @param {*} inputPeer Пользователь
 * @returns {{peer: {chatId: *}}|{peer: {userId: *}}}
 */
export const getPeer = (inputPeer) => {
	if (inputPeer.startsWith('e') || inputPeer.startsWith('s')) {
		return {peer: {userId: inputPeer}};
	}
	return {peer: {chatId: inputPeer}};
};

/**
 * Получение идентиифкатора пользователя, чата
 * @param {*} peer Идентификатор чата или диалога
 * @returns {*}
 */
export const getPeerId = (peer) => peer.chatId || peer.userId;

/**
 * Получение идентификатор студента или сотрудника
 * @param {*} inputPeer идентиифкатор
 * @returns {{userId: *}|{chatId: number}}
 */
export const getInputPeer = (inputPeer) => {
	if (inputPeer.startsWith('e') || inputPeer.startsWith('s')) {
		return {userId: inputPeer};
	}
	return {chatId: parseInt(inputPeer)};
};

/**
 * Сравнение идентификаторов
 * @param {*} peer1 Первый идентиифкатор
 * @param {*} peer2 Второй идентификатор
 * @returns {boolean}
 */
export const peerEquals = (peer1, peer2) => peer1.userId === peer2.userId || peer1.chatId === peer2.chatId;

/**
 * Сортировка чатов
 * @param {*} c1 Первый чат
 * @param {*} c2 Второй чат
 * @returns {number}
 */
export const chatSort = (c1, c2) => (c2.lastMessage && c2.lastMessage.date || c2.date) - (c1.lastMessage && c1.lastMessage.date || c1.date);

/**
 * Получение фио пользователя
 * @param {*} user Пользователь
 * @param {*} initials Инициалы
 * @returns {string|*}
 */
export const getUserFIO = (user, initials = false) => {
	if (!isEmptyUser(user)) {
		if (initials) {
			return dropUndefined`${user.lastName} ${user.firstName[0]}.${user.patronymic[0]}`;
		}
		return dropUndefined`${user.lastName} ${user.firstName} ${user.patronymic}`;
	}
	return 'Пользователь удалён';
};

/**
 * Получение информации о пользователе
 * @param {*} user Пользователь
 * @returns {string}
 */
export const getUserInfos = user => (!isEmptyUser(user) ? user.information : 'Информация отсутствует');

/**
 * Проверку на пустого пользователя
 * @param {*} user Пользователь
 * @returns {boolean}
 */
export const isEmptyUser = (user) => user != null && user !== undefined && user.id !== null && user.id !== undefined && user.information === undefined;

/**
 * Проверка на пустую группу
 * @param {*} userGroup Группа пользователей
 * @returns {boolean}
 */
export const isEmptyUserGroup = (userGroup) => userGroup != null && userGroup !== undefined && userGroup.id !== null && userGroup.id !== undefined && userGroup.name === undefined;