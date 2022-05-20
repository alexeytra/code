import Api from './../utils/api';
import moment from 'moment';
import axios from 'axios';

/**
 * Константы для редюсеров
 * @type {string}
 */
const GET_DIALOGS_REQUEST = 'GET_DIALOGS_REQUEST';
const GET_DIALOGS_COMPLETED = 'GET_DIALOGS_COMPLETED';
const GET_DIALOGS_FAILED = 'GET_DIALOGS_FAILED';
const CLEAR_DIALOGS_STATE = 'CLEAR_DIALOGS_STATE';
const SET_SUPPORT_FILTER = 'SET_SUPPORT_FILTER';

const CREATE_CHAT_REQUEST = 'CREATE_CHAT_REQUEST';
const CREATE_CHAT_COMPLETED = 'CREATE_CHAT_COMPLETED';
const CREATE_CHAT_FAILED = 'CREATE_CHAT_FAILED';

const GET_HISTORY_REQUEST = 'GET_HISTORY_REQUEST';
const GET_HISTORY_COMPLETED = 'GET_HISTORY_COMPLETED';
const GET_HISTORY_FAILED = 'GET_HISTORY_FAILED';

const DELETE_HISTORY_REQUEST = 'DELETE_HISTORY_REQUEST';
const DELETE_HISTORY_COMPLETED = 'DELETE_HISTORY_COMPLETED';
const DELETE_HISTORY_FAILED = 'DELETE_HISTORY_FAILED';

const UPDATE_MESSAGE_REQUEST = 'UPDATE_MESSAGE_REQUEST';
const UPDATE_MESSAGE_COMPLETED = 'UPDATE_MESSAGE_COMPLETED';
const UPDATE_MESSAGE_FAILED = 'UPDATE_MESSAGE_FAILED';

const READ_HISTORY_REQUEST = 'READ_HISTORY_REQUEST';
const READ_HISTORY_COMPLETED = 'READ_HISTORY_COMPLETED';
const READ_HISTORY_FAILED = 'READ_HISTORY_FAILED';

const READ_ALL_HISTORY_REQUEST = 'READ_ALL_HISTORY_REQUEST';
const READ_ALL_HISTORY_COMPLETED = 'READ_ALL_HISTORY_COMPLETED';
const READ_ALL_HISTORY_FAILED = 'READ_ALL_HISTORY_FAILED';

const GET_CHAT_UPDATES_REQUEST = 'GET_CHAT_UPDATES_REQUEST';
const GET_CHAT_UPDATES_COMPLETED = 'GET_CHAT_UPDATES_COMPLETED';
const GET_CHAT_UPDATES_FAILED = 'GET_CHAT_UPDATES_FAILED';

const GET_NEWER_MESSAGES_REQUEST = 'GET_NEWER_MESSAGES_REQUEST';
const GET_NEWER_MESSAGES_COMPLETED = 'GET_NEWER_MESSAGES_COMPLETED';
const GET_NEWER_MESSAGES_FAILED = 'GET_NEWER_MESSAGES_FAILED';
const GET_NEWER_MESSAGES_CANCELLED = 'GET_NEWER_MESSAGES_CANCELLED';

const SEND_MESSAGE_REQUEST = 'SEND_MESSAGE_REQUEST';
const SEND_MESSAGE_COMPLETED = 'SEND_MESSAGE_COMPLETED';
const SEND_MESSAGE_FAILED = 'SEND_MESSAGE_FAILED';

const ADD_CHAT_USER_REQUEST = 'ADD_CHAT_USER_REQUEST';
const ADD_CHAT_USER_COMPLETED = 'ADD_CHAT_USER_COMPLETED';
const ADD_CHAT_USER_FAILED = 'ADD_CHAT_USER_FAILED';

const REMOVE_CHAT_USER_REQUEST = 'REMOVE_CHAT_USER_REQUEST';
const REMOVE_CHAT_USER_COMPLETED = 'REMOVE_CHAT_USER_COMPLETED';
const REMOVE_CHAT_USER_FAILED = 'REMOVE_CHAT_USER_FAILED';

const UPDATE_NOTIFY_SETTINGS_REQUEST = 'UPDATE_NOTIFY_SETTINGS_REQUEST';
const UPDATE_NOTIFY_SETTINGS_COMPLETED = 'UPDATE_NOTIFY_SETTINGS_COMPLETED';
const UPDATE_NOTIFY_SETTINGS_FAILED = 'UPDATE_NOTIFY_SETTINGS_FAILED';

const GET_CHAT_FULL_REQUEST = 'GET_CHAT_FULL_REQUEST';
const GET_CHAT_FULL_COMPLETED = 'GET_CHAT_FULL_COMPLETED';
const GET_CHAT_FULL_FAILED = 'GET_CHAT_FULL_FAILED';

const GET_CONFIRM_FULL_REQUEST = 'GET_CONFIRM_FULL_REQUEST';
const GET_CONFIRM_FULL_COMPLETED = 'GET_CONFIRM_FULL_COMPLETED';
const GET_CONFIRM_FULL_FAILED = 'GET_CONFIRM_FULL_FAILED';

const GET_USER_FULL_REQUEST = 'GET_USER_FULL_REQUEST';
const GET_USER_FULL_COMPLETED = 'GET_USER_FULL_COMPLETED';
const GET_USER_FULL_FAILED = 'GET_USER_FULL_FAILED';

const GET_MESSAGE_VIEWERS_REQUEST = 'GET_MESSAGE_VIEWERS_REQUEST';
const GET_MESSAGE_VIEWERS_COMPLETED = 'GET_MESSAGE_VIEWERS_COMPLETED';
const GET_MESSAGE_VIEWERS_FAILED = 'GET_MESSAGE_VIEWERS_FAILED';

const EDIT_CHAT_TITLE_REQUEST = 'EDIT_CHAT_TITLE_REQUEST';
const EDIT_CHAT_TITLE_COMPLETED = 'EDIT_CHAT_TITLE_COMPLETED';
const EDIT_CHAT_TITLE_FAILED = 'EDIT_CHAT_TITLE_FAILED';

const EDIT_CHAT_STATUS_REQUEST = 'EDIT_CHAT_STATUS_REQUEST';
const EDIT_CHAT_STATUS_COMPLETED = 'EDIT_CHAT_STATUS_COMPLETED';
const EDIT_CHAT_STATUS_FAILED = 'EDIT_CHAT_STATUS_FAILED';

const REPLY_MESSAGE = 'REPLY_MESSAGE';
const GET_CHAT_UPDATES_CANCELLED = 'GET_CHAT_UPDATES_CANCELLED';

const DELETE_MYANNOUNCEMENT_REQUEST = 'DELETE_MYANNOUNCEMENT_REQUEST';
const DELETE_MYANNOUNCEMENT_COMPLETED = 'DELETE_MYANNOUNCEMENT_COMPLETED';
const DELETE_MYANNOUNCEMENT_FAILED = 'DELETE_MYANNOUNCEMENT_FAILED';

const CHANGE_CONFIRM_REQUEST = 'CHANGE_CONFIRM_REQUEST';
const CHANGE_CONFIRM_COMPLETED = 'CHANGE_CONFIRM_COMPLETED';
const CHANGE_CONFIRM_FAILED = 'CHANGE_CONFIRM_FAILED';

const EDIT_ANNOUNCEMENT_REQUEST = 'EDIT_ANNOUNCEMENT_REQUEST';
const EDIT_ANNOUNCEMENT_COMPLETED = 'EDIT_ANNOUNCEMENT_COMPLETED';
const EDIT_ANNOUNCEMENT_FAILED = 'EDIT_ANNOUNCEMENT_FAILED';

/**
 * Получение диалогов
 * @param {*} params Параметры
 * @returns {function(*): *}
 */
export const getDialogs = (params) => dispatch => {
	dispatch(getDialogsRequest());
	return Api.getDialogs(params)
		.then(data => dispatch(getDialogsCompleted(params, data)))
		.catch(error => dispatch(getDialogsFailed(error)));
};
/**
 * Получение контекста диалогов
 * @param {*} params Параметры
 * @returns {function(*): *}
 */
export const getContextDialogs = (params) => dispatch => {
	dispatch(getDialogsRequest());
	return Api.getContextDialogs(params)
		.then(data => dispatch(getDialogsCompleted(params, data)))
		.catch(error => dispatch(getDialogsFailed(error)));
};
/**
 * Очистка состояния диалогов
 * @returns {Function}
 */
export const clearDialogsState = () => dispatch => {
	dispatch(clearDialogs());
};
/**
 * Фильтр для техподдержек
 * @param {*} filterBy Фильтрация
 * @returns {Function}
 */
export const setSupportFilter = (filterBy) => dispatch => {
	dispatch(supportFilter(filterBy));
};
/**
 * Запрос
 * @returns {{type: string}}
 */
const getDialogsRequest = () => ({type: GET_DIALOGS_REQUEST});
/**
 * Запрос завершен
 * @param {*} params Параметры
 * @param {*} payload Ответ пользователя
 * @returns {{payload: *, type: string, params: *}}
 */
const getDialogsCompleted = (params, payload) => ({type: GET_DIALOGS_COMPLETED, params, payload});
/**
 * Запрос завершен с ошибкой
 * @param {*} error Ошибка
 * @returns {{type: string, error: *}}
 */
const getDialogsFailed = (error) => ({type: GET_DIALOGS_FAILED, error});
/**
 * Очистка диалогов
 * @returns {{type: string}}
 */
const clearDialogs = () => ({type: CLEAR_DIALOGS_STATE});
/**
 * Фильтрация техподдержек
 * @param {*} filterBy Фильтрация по
 * @returns {{type: string, filterBy: *}}
 */
const supportFilter = (filterBy) => ({type: SET_SUPPORT_FILTER, filterBy});

/**
 * Ответ на сообщение
 * @param {*} messageId Иднтификатор сообщения
 * @returns {{messageId: *, type: string}}
 */
export const replyMessage = (messageId) => ({type: REPLY_MESSAGE, messageId});

/**
 * Создание чата
 * @param {*} chat Чат
 * @returns {function(*): *}
 */
export const createChat = (chat) => dispatch => {
	dispatch(createChatRequest(chat));
	return Api.createChat(chat)
		.then(payload => dispatch(createChatCompleted(payload)))
		.catch(err => dispatch(createChatFailed(chat, err)));
};
/**
 * Запрос
 * @param {*} chat Чат
 * @returns {{chat: *, type: string}}
 */
const createChatRequest = (chat) => ({type: CREATE_CHAT_REQUEST, chat});
/**
 * Запрос завершен
 * @param {*} payload Ответ сервера
 * @returns {{payload: *, type: string}}
 */
const createChatCompleted = (payload) => ({type: CREATE_CHAT_COMPLETED, payload});
/**
 * Запрос завершен с ошибкой
 * @param {*} chat Чат
 * @param {*} error Ошибка
 * @returns {{chat: *, type: string, error: *}}
 */
const createChatFailed = (chat, error) => ({type: CREATE_CHAT_FAILED, chat, error});

/**
 * Получение истории сообщений
 * @param {*} params Параметры
 * @returns {function(*): *}
 */
export const getHistory = (params) => dispatch => {
	dispatch(getHistoryRequest(params));
	return Api.getHistory(params)
		.then(payload => dispatch(getHistoryCompleted(params, payload)))
		.catch(err => dispatch(getHistoryFailed(params, err)));
};
/**
 * Запрос
 * @param {*} params Параметры
 * @returns {{type: string, params: *}}
 */
const getHistoryRequest = (params) => ({type: GET_HISTORY_REQUEST, params});
/**
 * Запрос завершен
 * @param {*} params Параметры
 * @param {*} payload Ответ с сервера
 * @returns {{payload: *, type: string, params: *}}
 */
const getHistoryCompleted = (params, payload) => ({type: GET_HISTORY_COMPLETED, params, payload});
/**
 * Запрос завершен с ошибкой
 * @param {*} params Параметры
 * @param {*} error Ошибка
 * @returns {{type: string, params: *, error: *}}
 */
const getHistoryFailed = (params, error) => ({type: GET_HISTORY_FAILED, params, error});

/**
 * Удаление сообщений
 * @param {*} params Параметры
 * @returns {function(*): *}
 */
export const deleteHistory = (params) => dispatch => Api.deleteMessage(params)
	.then(payload => dispatch(deleteHistoryCompleted(params, payload)))
	.catch(err => dispatch(deleteHistoryFailed(params, err)));
/**
 * Запрос завершен
 * @param {*} params Параметры
 * @param {*} payload Ответ сервера
 * @returns {{payload: *, type: string, params: *}}
 */
const deleteHistoryCompleted = (params, payload) => ({type: DELETE_HISTORY_COMPLETED, params, payload});
/**
 * Запрос завершен с ошибкой
 * @param {*} params Параметры
 * @param {*} error Ошибка
 * @returns {{type: string, params: *, error: *}}
 */
const deleteHistoryFailed = (params, error) => ({type: DELETE_HISTORY_FAILED, params, error});

/**
 * Обновление сообщения
 * @param {*} params Параметры
 * @returns {function(*): *}
 */
export const updateMessage = (params) => dispatch => {
	dispatch(updateMessageRequest(params));
	return Api.updateMessage(params)
		.then(payload => dispatch(updateMessageCompleted(params, payload)))
		.catch(err => dispatch(updateMessageFailed(params, err)))
};
/**
 * Запрос
 * @param {*} params Параметры
 * @returns {{type: string, params: *}}
 */
const updateMessageRequest = (params) => ({type: UPDATE_MESSAGE_REQUEST, params});
/**
 * Запрос завершен
 * @param {*} params Параметры
 * @param {*} payload Ответ сервера
 * @returns {{payload: *, type: string, params: *}}
 */
const updateMessageCompleted = (params, payload) => ({type: UPDATE_MESSAGE_COMPLETED, params, payload});
/**
 * Запрос завершен
 * @param {*} params Параметры
 * @param {*} error Ошибка
 * @returns {{type: string, params: *, error: *}}
 */
const updateMessageFailed = (params, error) => ({type: UPDATE_MESSAGE_FAILED, params, error});

/**
 * Отмена загрузки обновления чатов
 * @param {*} peer Идентфикатор диалага или чата
 * @returns {function(*, *): *}
 */
export const cancelGetChatUpdates = (peer) => (dispatch, getState) => {
	const cancelAxios = (state) => state.messenger.axiosSource && state.messenger.axiosSource.cancel('GET_CHAT_UPDATES_CANCELLED');
	return cancelAxios(getState());
};

/**
 * Получение обновлений
 * @param {*} uid Идентификатор
 * @param {*} peer Идентификатор диалога или чата
 * @param {*} lastMessageId Идентификатор последнего сообщения
 * @returns {function(*): *}
 */
export const getChatUpdates = (uid, peer, lastMessageId) => dispatch => {
	cancelGetChatUpdates(peer);
	const CancelToken = axios.CancelToken;
	const source = CancelToken.source();
	dispatch(getChatUpdatesRequest(uid, peer, lastMessageId, source));
	return Api.getChatUpdates((peer.chatId || peer.userId), lastMessageId, source.token)
		.then(payload => dispatch(getChatUpdatesCompleted(uid, peer, payload)))
		.catch(err => {
			if (axios.isCancel(err)) {
				dispatch(getChatUpdatesCancelled(peer));
			} else {
				dispatch(getChatUpdatesFailed(peer, err));
			}
		});
};
/**
 * Запрос
 * @param {*} uid Идентификатор
 * @param {*} peer Идентификатор диалога или чата
 * @param {*} lastMessageId Идентификатор последнего сообщения
 * @param {*} source Источник
 * @returns {{uid: *, peer: *, lastMessageId: *, source: *, type: string}}
 */
const getChatUpdatesRequest = (uid, peer, lastMessageId, source) => ({
	type: GET_CHAT_UPDATES_REQUEST,
	uid,
	peer,
	lastMessageId,
	source
});
/**
 * Запрос завершен
 * @param {*} uid Идентификатор
 * @param {*} peer Идентификатор диалога или чата
 * @param {*} payload Ответ сервера
 * @returns {{uid: *, payload: *, peer: *, type: string, receivedAt: number}}
 */
const getChatUpdatesCompleted = (uid, peer, payload) => ({
	type: GET_CHAT_UPDATES_COMPLETED, uid, peer, payload, receivedAt: moment()
		.valueOf()
});
/**
 * Запрос завершен с ошибкой
 * @param {*} peer Идентификатор диалога или чата
 * @param {*} error Ошибка
 * @returns {{peer: *, type: string, error: *}}
 */
const getChatUpdatesFailed = (peer, error) => ({type: GET_CHAT_UPDATES_FAILED, peer, error});
/**
 * Получение обновлений остановлено
 * @param {*} peer Идентификатор диалога или чата
 * @returns {{peer: *, type: string}}
 */
const getChatUpdatesCancelled = (peer) => ({type: GET_CHAT_UPDATES_CANCELLED, peer});

/**
 * Получение новых сообщений
 * @param {*} time Время
 * @returns {function(*): *}
 */
export const getNewerMessages = (time) => dispatch => {
	cancelGetNewerMessages();
	const CancelToken = axios.CancelToken;
	const source = CancelToken.source();
	dispatch(getNewerMessagesRequest(time, source));
	return Api.getNewerMessages(time, source.token)
		.then(payload => dispatch(getNewerMessagesCompleted(payload)))
		.catch(err => {
			if (axios.isCancel(err)) {
				dispatch(getNewerMessagesCancelled(err));
			} else {
				dispatch(getNewerMessagesFailed(err));
			}
		});
};
/**
 * Запрос
 * @param {*} time Время
 * @param {*} axios Аксиос
 * @returns {{axios: *, time: *, type: string}}
 */
const getNewerMessagesRequest = (time, axios) => ({type: GET_NEWER_MESSAGES_REQUEST, time, axios});
/**
 * Запрос завершен
 * @param {*} payload Ответ сервера
 * @returns {{payload: *, type: string, receivedAt: number}}
 */
const getNewerMessagesCompleted = (payload) => ({
	type: GET_NEWER_MESSAGES_COMPLETED, payload, receivedAt: moment()
		.valueOf()
});
/**
 * Запрос завершен с ошибкой
 * @param {*} error Ошибка
 * @returns {{type: string, error: *}}
 */
const getNewerMessagesFailed = (error) => ({type: GET_NEWER_MESSAGES_FAILED, error});
/**
 * Отмена получения новых сообщений
 * @param {*} error Ошибка
 * @returns {{type: string, error: *}}
 */
const getNewerMessagesCancelled = (error) => ({type: GET_NEWER_MESSAGES_CANCELLED, error});

/**
 * Отмена получения новых сообщений
 * @returns {function(*, *): *}
 */
export const cancelGetNewerMessages = () => (dispatch, getState) => {
	const cancelAxios = (state) => state.messenger.axios.GET_NEWER_MESSAGES && state.messenger.axios.GET_NEWER_MESSAGES.cancel('GET_NEWER_MESSAGES_CANCELLED');
	return cancelAxios(getState());
};

/**
 * Отправка сообщения
 * @param {*} uid Идентификатор
 * @param {*} message Сообщение
 * @returns {function(*): *}
 */
export const sendMessage = (uid, message) => dispatch => {
	dispatch(sendMessageRequest(uid, message));
	return Api.sendMessage(message)
		.then(payload => dispatch(sendMessageCompleted(uid, message, payload)))
		.catch(err => dispatch(sendMessageFailed(message, err)));
};
/**
 * Запрос
 * @param {*} uid Идентификатор
 * @param {*} message Сообщение
 * @returns {{uid: *, type: string, message: *}}
 */
const sendMessageRequest = (uid, message) => ({type: SEND_MESSAGE_REQUEST, uid, message});
/**
 * Запрос завершен
 * @param {*} uid Идентификатор
 * @param {*} message Сообщение
 * @param {*} payload Ответ сервера
 * @returns {{uid: *, payload: *, type: string, message: *}}
 */
const sendMessageCompleted = (uid, message, payload) => ({type: SEND_MESSAGE_COMPLETED, uid, message, payload});
/**
 * Запрос завершен с ошибкой
 * @param {*} uid Идентификатор
 * @param {*} message Сообщение
 * @param {*} error Ошибка
 * @returns {{uid: *, type: string, message: *, error: *}}
 */
const sendMessageFailed = (uid, message, error) => ({type: SEND_MESSAGE_FAILED, uid, message, error});

/**
 * Прочитать сообщение
 * @param {*} uid Идентификатор
 * @param {*} peer Идентификатор диалога или чата
 * @param {*} maxId Максимальный Идентификатор сообщения
 * @returns {function(*): *}
 */
export const readHistory = (uid, {peer, maxId}) => dispatch => {
	dispatch(readHistoryRequest(uid, peer, maxId));
	return Api.readHistory({peer, maxId})
		.then(payload => dispatch(readHistoryCompleted(uid, peer, maxId, payload)))
		.catch(err => dispatch(readHistoryFailed(uid, peer, maxId, err)));
};
/**
 * Запрос
 * @param {*} uid Идентификатор
 * @param {*} peer Идентификатор диалога или чата
 * @param {*} messageId Максимальный Идентификатор сообщения
 * @returns {{uid: *, peer: *, messageId: *, type: string}}
 */
const readHistoryRequest = (uid, peer, messageId) => ({type: READ_HISTORY_REQUEST, uid, peer, messageId});
/**
 * Запрос завершен
 * @param {*} uid Идентификатор
 * @param {*} peer Идентификатор диалога или чата
 * @param {*} messageId Идентификатор сообщения
 * @param {*} payload Ответ сервера
 * @returns {{uid: *, payload: *, peer: *, messageId: *, type: string}}
 */
const readHistoryCompleted = (uid, peer, messageId, payload) => ({
	type: READ_HISTORY_COMPLETED,
	uid,
	peer,
	messageId,
	payload
});
/**
 * Запрос завершен с ошибкой
 * @param {*} uid Идентификатор
 * @param {*} peer Идентификатор диалога или чата
 * @param {*} messageId Идентификатор сообщения
 * @param {*} error Ошибка
 * @returns {{uid: *, peer: *, messageId: *, type: string, error: *}}
 */
const readHistoryFailed = (uid, peer, messageId, error) => ({type: READ_HISTORY_FAILED, uid, peer, messageId, error});

/**
 * Прочитать все сообщения
 * @param {*} uid Идентификатор
 * @param {*} messages Сообщения
 * @returns {function(*): *}
 */
export const readAllHistory = (uid, messages) => dispatch => {
	dispatch(readAllHistoryRequest(uid, messages));
	return Api.readAllHistory(messages)
		.then(payload => dispatch(readAllHistoryCompleted(uid, messages, payload)))
		.catch(err => dispatch(readAllHistoryFailed(uid, messages, err)));
};
/**
 * Запрос
 * @param {*} uid Идентификатор
 * @param {*} messages Сообщения
 * @returns {{uid: *, messages: *, type: string}}
 */
const readAllHistoryRequest = (uid, messages) => ({type: READ_ALL_HISTORY_REQUEST, uid, messages});
/**
 * Запрос завершен
 * @param {*} uid Идентификатор
 * @param {*} messages Сообщения
 * @param {*} payload Ответ с сервера
 * @returns {{uid: *, payload: *, messages: *, type: string}}
 */
const readAllHistoryCompleted = (uid, messages, payload) => ({
	type: READ_ALL_HISTORY_COMPLETED,
	uid,
	messages,
	payload
});
/**
 * Запрос завершен с ошибкой
 * @param {*} uid Идентифкатор
 * @param {*} messages Сообщения
 * @param {*} error Ошибка
 * @returns {{uid: *, messages: *, type: string, error: *}}
 */
const readAllHistoryFailed = (uid, messages, error) => ({type: READ_ALL_HISTORY_FAILED, uid, messages, error});

/**
 * Добавление пользователя к чату
 * @param {*} chatId Идентифкатор чата
 * @param {*} user Пользователь
 * @returns {function(*): *}
 */
export const addChatUser = ({chatId, user}) => dispatch => {
	dispatch(addChatUserRequest());
	return Api.addChatUser({chatId, user})
		.then(payload => dispatch(addChatUserCompleted(chatId, payload)))
		.catch(err => dispatch(addChatUserFailed(chatId, user, err)));
};
/**
 * Запрос
 * @returns {{type: string}}
 */
const addChatUserRequest = () => ({type: ADD_CHAT_USER_REQUEST});
/**
 * Запрос завершен
 * @param {*} chatId Идентифкатор чата
 * @param {*} payload Ответ с сервера
 * @returns {{chatId: *, payload: *, type: string}}
 */
const addChatUserCompleted = (chatId, payload) => ({type: ADD_CHAT_USER_COMPLETED, chatId, payload});
/**
 * Запрос завершен с ошибкой
 * @param {*} chatId Идентифкатор чата
 * @param {*} user Пользователь
 * @param {*} error Ошибка
 * @returns {{chatId: *, type: string, error: *, user: *}}
 */
const addChatUserFailed = (chatId, user, error) => ({type: ADD_CHAT_USER_FAILED, chatId, user, error});
/**
 * Удаление пользователя из чата
 * @param {*} uid Идентификатор
 * @param {*} chatId Идентифкатор чата
 * @param {*} user Пользователь
 * @returns {function(*): *}
 */
export const removeChatUser = (uid, {chatId, user}) => dispatch => {
	dispatch(removeChatUserRequest());
	return Api.removeChatUser({chatId, user})
		.then(payload => dispatch(removeChatUserCompleted(uid, chatId, user, payload)))
		.catch(err => dispatch(removeChatUserFailed(err)));
};
/**
 * Запрос
 * @returns {{type: string}}
 */
const removeChatUserRequest = () => ({type: REMOVE_CHAT_USER_REQUEST});
/**
 * Запрос завершен
 * @param {*} uid Идентификатор
 * @param {*} chatId Идентифкатор чата
 * @param {*} user Пользователь
 * @param {*} payload Ответ с сервера
 * @returns {{uid: *, chatId: *, payload: *, type: string, user: *}}
 */
const removeChatUserCompleted = (uid, chatId, user, payload) => ({
	type: REMOVE_CHAT_USER_COMPLETED,
	uid,
	chatId,
	user,
	payload
});
/**
 * Запрос завершен с ошибкой
 * @param {*} error Ошибка
 * @returns {{type: string, error: *}}
 */
const removeChatUserFailed = (error) => ({type: REMOVE_CHAT_USER_FAILED, error});

/**
 * Обновление настроек уведомлений
 * @param {*} notifySettings Уведомления
 * @returns {function(*): *}
 */
export const updateNotifySettings = (notifySettings) => dispatch => {
	dispatch(updateNotifySettingsRequest(notifySettings));
	return Api.updateNotifySettings(notifySettings)
		.then(payload => dispatch(updateNotifySettingsCompleted(notifySettings, payload)))
		.catch(err => dispatch(updateNotifySettingsFailed(notifySettings, err)));
};
/**
 * Запрос
 * @param {*} notifySettings Настройка уведомлений
 * @returns {{type: string, notifySettings: *}}
 */
const updateNotifySettingsRequest = (notifySettings) => ({type: UPDATE_NOTIFY_SETTINGS_REQUEST, notifySettings});
/**
 * Запрос завершен
 * @param {*} notifySettings Настройка уведомлений
 * @param {*} payload Ответ сервера
 * @returns {{payload: *, type: string, notifySettings: *}}
 */
const updateNotifySettingsCompleted = (notifySettings, payload) => ({
	type: UPDATE_NOTIFY_SETTINGS_COMPLETED,
	notifySettings,
	payload
});
/**
 * Запрос завершен с ошибкой
 * @param {*} notifySettings Настройка уведомлений
 * @param {*} error Ошибка
 * @returns {{type: string, error: *, notifySettings: *}}
 */
const updateNotifySettingsFailed = (notifySettings, error) => ({
	type: UPDATE_NOTIFY_SETTINGS_FAILED,
	notifySettings,
	error
});

/**
 * Получение полного чата
 * @param {*} chatId Идентифкатор чата
 * @returns {function(*): *}
 */
export const getChatFull = (chatId) => dispatch => {
	dispatch(getChatFullRequest());
	return Api.getChatFull(chatId)
		.then(payload => dispatch(getChatFullCompleted(chatId, payload)))
		.catch(err => dispatch(getChatFullFailed(chatId, err)));
};
/**
 * Запрос
 * @param {*} chatId Идентифкатор чата
 * @returns {{chatId: *, type: string}}
 */
const getChatFullRequest = (chatId) => ({type: GET_CHAT_FULL_REQUEST, chatId});
/**
 * Запрос завершен
 * @param {*} chatId Идентифкатор чата
 * @param {*} payload Ответ сервера
 * @returns {{chatId: *, payload: *, type: string}}
 */
const getChatFullCompleted = (chatId, payload) => ({type: GET_CHAT_FULL_COMPLETED, chatId, payload});
/**
 * Запрос завершен с ошибкой
 * @param {*} chatId Идентифкатор чата
 * @param {*} error Ошибка
 * @returns {{chatId: *, type: string, error: *}}
 */
const getChatFullFailed = (chatId, error) => ({type: GET_CHAT_FULL_FAILED, chatId, error});

/**
 * Получение подтвердивших
 * @param {*} chatId Идентифкатор чата
 * @returns {function(*): *}
 */
export const getConfirmFull = (chatId) => dispatch => {
	dispatch(getConfirmFullRequest());
	return Api.getConfirmFull(chatId)
		.then(payload => dispatch(getConfirmFullCompleted(chatId, payload)))
		.catch(err => dispatch(getConfirmFullFailed(chatId, err)));
};
/**
 * Запрос
 * @param {*} chatId Идентифкатор чата
 * @returns {{chatId: *, type: string}}
 */
const getConfirmFullRequest = (chatId) => ({type: GET_CONFIRM_FULL_REQUEST, chatId});
/**
 * Запрос завершен
 * @param {*} chatId Идентифкатор чата
 * @param {*} payload Ответ сервера
 * @returns {{chatId: *, payload: *, type: string}}
 */
const getConfirmFullCompleted = (chatId, payload) => ({type: GET_CONFIRM_FULL_COMPLETED, chatId, payload});
/**
 * Запрос завершен с ошибкой
 * @param {*} chatId Идентифкатор чата
 * @param {*} error Ошибка
 * @returns {{chatId: *, type: string, error: *}}
 */
const getConfirmFullFailed = (chatId, error) => ({type: GET_CONFIRM_FULL_FAILED, chatId, error});

/**
 * Получения полной информации о пользователе
 * @param {*} userId Идентификатор пльзователя
 * @returns {function(*): *}
 */
export const getUserFull = (userId) => dispatch => {
	dispatch(getUserFullRequest(userId));
	return Api.getUserFull(userId)
		.then(payload => dispatch(getUserFullCompleted(userId, payload)))
		.catch(err => dispatch(getUserFullFailed(userId, err)));
};

/**
 * Запрос
 * @param {*} userId Идентификатор пльзователя
 * @returns {{type: string, userId: *}}
 */
const getUserFullRequest = (userId) => ({type: GET_USER_FULL_REQUEST, userId});
/**
 * Запрос завершен
 * @param {*} userId Идентификатор пльзователя
 * @param {*} payload Ответ сервера
 * @returns {{payload: *, type: string, userId: *}}
 */
const getUserFullCompleted = (userId, payload) => ({type: GET_USER_FULL_COMPLETED, userId, payload});
/**
 * Запрос завершен с ошибкой
 * @param {*} userId Идентификатор пльзователя
 * @param {*} error Ошибка
 * @returns {{type: string, error: *, userId: *}}
 */
const getUserFullFailed = (userId, error) => ({type: GET_USER_FULL_FAILED, userId, error});

/**
 * Получение просмотревших сообщение
 * @param {*} messageId Идентификатор сообщения
 * @returns {function(*): *}
 */
export const getMessageViewers = (messageId) => dispatch => {
	dispatch(getMessageViewersRequest(messageId));
	return Api.getMessageViewers(messageId)
		.then(payload => dispatch(getMessageViewersCompleted(messageId, payload)))
		.catch(err => dispatch(getMessageViewersFailed(messageId, err)));
};
/**
 * Запрос
 * @param {*} messageId Идентификатор сообщения
 * @returns {{messageId: *, type: string}}
 */
const getMessageViewersRequest = (messageId) => ({type: GET_MESSAGE_VIEWERS_REQUEST, messageId});
/**
 * Запрос завершен
 * @param {*} messageId Идентификатор сообщения
 * @param {*} payload Ответ пользователя
 * @returns {{payload: *, messageId: *, type: string}}
 */
const getMessageViewersCompleted = (messageId, payload) => ({type: GET_MESSAGE_VIEWERS_COMPLETED, messageId, payload});
/**
 * Ответ завершен с ошибкой
 * @param {*} messageId Идентификатор сообщения
 * @param {*} error Ошибка
 * @returns {{messageId: *, type: string, error: *}}
 */
const getMessageViewersFailed = (messageId, error) => ({type: GET_MESSAGE_VIEWERS_FAILED, messageId, error});

/**
 * Редактирование заголовка чата
 * @param {*} chatId Идентифкатор чата
 * @param {*} title Заголовок
 * @returns {function(*): *}
 */
export const editChatTitle = ({chatId, title}) => dispatch => {
	dispatch(editChatTitleRequest(chatId, title));
	return Api.editChatTitle({chatId, title})
		.then(payload => dispatch(editChatTitleCompleted(chatId, title, payload)))
		.catch(err => dispatch(editChatTitleFailed(chatId, title, err)));
};
/**
 * Запрос
 * @param {*} chatId Идентифкатор чата
 * @param {*} title Заголовок
 * @returns {{chatId: *, type: string, title: *}}
 */
const editChatTitleRequest = (chatId, title) => ({type: EDIT_CHAT_TITLE_REQUEST, chatId, title});
/**
 * Запрос завершен
 * @param {*} chatId Идентифкатор чата
 * @param {*} title Заголовок
 * @param {*} payload
 * @returns {{chatId: *, payload: *, type: string, title: *}}
 */
const editChatTitleCompleted = (chatId, title, payload) => ({type: EDIT_CHAT_TITLE_COMPLETED, chatId, title, payload});
/**
 * Запрос с ошибкой
 * @param {*} chatId Идентифкатор чата
 * @param {*} title Заголовок
 * @param {*} error Ошибка
 * @returns {{chatId: *, type: string, title: *, error: *}}
 */
const editChatTitleFailed = (chatId, title, error) => ({type: EDIT_CHAT_TITLE_FAILED, chatId, title, error});

/**
 * Редактирование статуса заявления
 * @param {*} params Параметры
 * @returns {function(*): *}
 */
export const editChatStatusApplication = (params) => dispatch => {
	dispatch(editChatStatusRequest(params));
	return Api.editChatStatusApplication(params)
		.then(payload => dispatch(editChatStatusCompleted(params, payload)))
		.catch(err => dispatch(editChatStatusFailed(params, err)));
};

/**
 * Запрос
 * @param {*} params
 * @returns {{type: string, params: *}}
 */
const editChatStatusRequest = (params) => ({type: EDIT_CHAT_STATUS_REQUEST, params});

/**
 * Запрос завершен
 * @param {*} params Параметры
 * @param {*} payload Ответ сервера
 * @returns {{payload: *, type: string, params: *}}
 */
const editChatStatusCompleted = (params, payload) => ({type: EDIT_CHAT_STATUS_COMPLETED, params, payload});

/**
 * Запрос завершен с ошибкой
 * @param {*} params Параметры
 * @param {*} error Ошибка
 * @returns {{type: string, params: *, error: *}}
 */
const editChatStatusFailed = (params, error) => ({type: EDIT_CHAT_STATUS_FAILED, params, error});

/**
 * Удаление объявления
 * @param {*} params Параметры
 * @returns {function(*): *}
 */
export const deleteMyAnnouncement = (params) => dispatch => {
	dispatch(deleteMyAnnouncementRequest(params));
	return Api.editChatStatus(params)
		.then(payload => dispatch(deleteMyAnnouncementCompleted(params, payload)))
		.catch(err => dispatch(deleteMyAnnouncementFailed(params, err)));
};
/**
 * Запрос
 * @param {*} params
 * @returns {{type: string, params: *}}
 */
const deleteMyAnnouncementRequest = (params) => ({type: DELETE_MYANNOUNCEMENT_REQUEST, params});
/**
 * Запрос завершен
 * @param {*} params Параметры
 * @param {*} payload Ответ сервера
 * @returns {{payload: *, type: string, params: *}}
 */
const deleteMyAnnouncementCompleted = (params, payload) => ({type: DELETE_MYANNOUNCEMENT_COMPLETED, params, payload});
/**
 * Запрос завершен с ошибкой
 * @param {*} params Параметры
 * @param {*} error Ошибка
 * @returns {{type: string, params: *, error: *}}
 */
const deleteMyAnnouncementFailed = (params, error) => ({type: DELETE_MYANNOUNCEMENT_FAILED, params, error});

/**
 * Изменение подтверждения
 * @param {*} params Параметры
 * @returns {function(*): *}
 */
export const changeConfirm = (params) => dispatch => {
	dispatch(changeConfirmRequest(params));
	return Api.submitConfirm(params)
		.then(payload => dispatch(changeConfirmCompleted(params, payload)))
		.catch(err => dispatch(changeConfirmFailed(params, err)));
};
/**
 * Запрос
 * @param {*} params Параметры
 * @returns {{type: string, params: *}}
 */
const changeConfirmRequest = (params) => ({type: CHANGE_CONFIRM_REQUEST, params});
/**
 * Запрос сервера завершен
 * @param {*} params Параметры
 * @param {*} payload Ответ сервера
 * @returns {{payload: *, type: string, params: *}}
 */
const changeConfirmCompleted = (params, payload) => ({type: CHANGE_CONFIRM_COMPLETED, params, payload});
/**
 * Запрос завершен с ошибкой
 * @param {*} params Параметры
 * @param {*} error Ошибка
 * @returns {{type: string, params: *, error: *}}
 */
const changeConfirmFailed = (params, error) => ({type: CHANGE_CONFIRM_FAILED, params, error});

/**
 * Редактирование объявления
 * @param {*} param Параметры
 * @param {*} msgId Идентификатор сообщения
 * @returns {function(*): *}
 */
export const editAnnouncement = (param, msgId) => dispatch => {
	dispatch(editAnnouncementRequest(param));
	return Api.editAnnouncement(param)
		.then(payload => dispatch(editAnnouncementCompleted(param, msgId, payload)))
		.catch(err => dispatch(editAnnouncementFailed(param, err)))
};

/**
 * Запрос
 * @param {*} param Параметры
 * @returns {{param: *, type: string}}
 */
const editAnnouncementRequest = (param) => ({type: EDIT_ANNOUNCEMENT_REQUEST, param});
/**
 * Запрос завершен
 * @param {*} param Параметры
 * @param {*} msgId Идентификатор сообщения
 * @param {*} payload Ответ с сервера
 * @returns {{param: *, payload: *, msgId: *, type: string}}
 */
const editAnnouncementCompleted = (param, msgId, payload) => ({
	type: EDIT_ANNOUNCEMENT_COMPLETED,
	param,
	msgId,
	payload
});
/**
 * Запрос завершен с ошибкой
 * @param {*} param Параметры
 * @param {*} error Ошибка
 * @returns {{param: *, type: string, error: *}}
 */
const editAnnouncementFailed = (param, error) => ({type: EDIT_ANNOUNCEMENT_FAILED, param, error});

/**
 * Типы экшенов
 * @type {{SEND_MESSAGE_FAILED: string, UPDATE_MESSAGE_REQUEST: string, GET_CONFIRM_FULL_COMPLETED: string, CLEAR_DIALOGS_STATE: string, GET_NEWER_MESSAGES_REQUEST: string, GET_CHAT_FULL_REQUEST: string, DELETE_HISTORY_FAILED: string, GET_USER_FULL_REQUEST: string, ADD_CHAT_USER_COMPLETED: string, GET_NEWER_MESSAGES_CANCELLED: string, GET_DIALOGS_FAILED: string, ADD_CHAT_USER_REQUEST: string, GET_NEWER_MESSAGES_COMPLETED: string, UPDATE_MESSAGE_FAILED: string, EDIT_CHAT_TITLE_FAILED: string, SEND_MESSAGE_REQUEST: string, GET_MESSAGE_VIEWERS_REQUEST: string, GET_CHAT_FULL_COMPLETED: string, GET_CONFIRM_FULL_REQUEST: string, GET_HISTORY_REQUEST: string, GET_CHAT_UPDATES_FAILED: string, GET_HISTORY_COMPLETED: string, REMOVE_CHAT_USER_FAILED: string, GET_CONFIRM_FULL_FAILED: string, READ_ALL_HISTORY_FAILED: string, EDIT_ANNOUNCEMENT_COMPLETED: string, EDIT_CHAT_TITLE_REQUEST: string, READ_HISTORY_REQUEST: string, EDIT_CHAT_TITLE_COMPLETED: string, GET_MESSAGE_VIEWERS_FAILED: string, UPDATE_NOTIFY_SETTINGS_REQUEST: string, CREATE_CHAT_COMPLETED: string, DELETE_HISTORY_COMPLETED: string, UPDATE_MESSAGE_COMPLETED: string, READ_HISTORY_FAILED: string, GET_USER_FULL_COMPLETED: string, GET_CHAT_UPDATES_REQUEST: string, GET_NEWER_MESSAGES_FAILED: string, READ_ALL_HISTORY_COMPLETED: string, GET_DIALOGS_COMPLETED: string, CREATE_CHAT_FAILED: string, GET_USER_FULL_FAILED: string, EDIT_ANNOUNCEMENT_REQUEST: string, UPDATE_NOTIFY_SETTINGS_FAILED: string, READ_HISTORY_COMPLETED: string, REMOVE_CHAT_USER_REQUEST: string, READ_ALL_HISTORY_REQUEST: string, DELETE_MYANNOUNCEMENT_FAILED: string, CHANGE_CONFIRM_FAILED: string, REPLY_MESSAGE: string, GET_MESSAGE_VIEWERS_COMPLETED: string, REMOVE_CHAT_USER_COMPLETED: string, CHANGE_CONFIRM_COMPLETED: string, SET_SUPPORT_FILTER: string, ADD_CHAT_USER_FAILED: string, UPDATE_NOTIFY_SETTINGS_COMPLETED: string, GET_CHAT_UPDATES_CANCELLED: string, GET_CHAT_UPDATES_COMPLETED: string, DELETE_MYANNOUNCEMENT_REQUEST: string, GET_CHAT_FULL_FAILED: string, DELETE_MYANNOUNCEMENT_COMPLETED: string, GET_HISTORY_FAILED: string, CREATE_CHAT_REQUEST: string, GET_DIALOGS_REQUEST: string, SEND_MESSAGE_COMPLETED: string, EDIT_ANNOUNCEMENT_FAILED: string, CHANGE_CONFIRM_REQUEST: string}}
 */
export const ActionTypes = {
	ADD_CHAT_USER_COMPLETED,
	ADD_CHAT_USER_FAILED,
	ADD_CHAT_USER_REQUEST,
	CREATE_CHAT_COMPLETED,
	CREATE_CHAT_FAILED,
	CREATE_CHAT_REQUEST,
	GET_CHAT_FULL_COMPLETED,
	GET_CHAT_FULL_FAILED,
	GET_CHAT_FULL_REQUEST,
	GET_CHAT_UPDATES_CANCELLED,
	GET_CHAT_UPDATES_COMPLETED,
	GET_CHAT_UPDATES_FAILED,
	DELETE_HISTORY_COMPLETED,
	DELETE_HISTORY_FAILED,
	GET_CHAT_UPDATES_REQUEST,
	GET_DIALOGS_COMPLETED,
	GET_DIALOGS_FAILED,
	GET_DIALOGS_REQUEST,
	CLEAR_DIALOGS_STATE,
	SET_SUPPORT_FILTER,
	GET_HISTORY_COMPLETED,
	GET_HISTORY_FAILED,
	GET_HISTORY_REQUEST,
	GET_MESSAGE_VIEWERS_COMPLETED,
	GET_MESSAGE_VIEWERS_FAILED,
	GET_MESSAGE_VIEWERS_REQUEST,
	GET_NEWER_MESSAGES_COMPLETED,
	GET_NEWER_MESSAGES_FAILED,
	GET_NEWER_MESSAGES_REQUEST,
	GET_NEWER_MESSAGES_CANCELLED,
	GET_CONFIRM_FULL_COMPLETED,
	GET_CONFIRM_FULL_FAILED,
	GET_CONFIRM_FULL_REQUEST,
	GET_USER_FULL_COMPLETED,
	GET_USER_FULL_FAILED,
	GET_USER_FULL_REQUEST,
	READ_HISTORY_COMPLETED,
	READ_HISTORY_FAILED,
	READ_HISTORY_REQUEST,
	READ_ALL_HISTORY_COMPLETED,
	READ_ALL_HISTORY_FAILED,
	READ_ALL_HISTORY_REQUEST,
	REMOVE_CHAT_USER_COMPLETED,
	REMOVE_CHAT_USER_FAILED,
	REMOVE_CHAT_USER_REQUEST,
	REPLY_MESSAGE,
	SEND_MESSAGE_COMPLETED,
	SEND_MESSAGE_FAILED,
	SEND_MESSAGE_REQUEST,
	UPDATE_NOTIFY_SETTINGS_COMPLETED,
	UPDATE_NOTIFY_SETTINGS_FAILED,
	UPDATE_NOTIFY_SETTINGS_REQUEST,
	UPDATE_MESSAGE_REQUEST,
	UPDATE_MESSAGE_COMPLETED,
	UPDATE_MESSAGE_FAILED,
	EDIT_CHAT_TITLE_REQUEST,
	EDIT_CHAT_TITLE_COMPLETED,
	EDIT_CHAT_TITLE_FAILED,
	DELETE_MYANNOUNCEMENT_REQUEST,
	DELETE_MYANNOUNCEMENT_COMPLETED,
	DELETE_MYANNOUNCEMENT_FAILED,
	CHANGE_CONFIRM_REQUEST,
	CHANGE_CONFIRM_COMPLETED,
	CHANGE_CONFIRM_FAILED,
	EDIT_ANNOUNCEMENT_REQUEST,
	EDIT_ANNOUNCEMENT_COMPLETED,
	EDIT_ANNOUNCEMENT_FAILED
};

/**
 * Экшены
 * @type {{createChat: (function(*=): function(*): *), deleteHistory: (function(*=): function(*): *), removeChatUser: (function(*=, {chatId?: *, user?: *}): function(*): *), getDialogs: (function(*=): function(*): *), sendMessage: (function(*=, *=): function(*): *), cancelGetChatUpdates: (function(*): function(*, *): *), getChatUpdates: (function(*=, *=, *=): function(*): *), deleteMyAnnouncement: (function(*=): function(*): *), getMessageViewers: (function(*=): function(*): *), getHistory: (function(*=): function(*): *), readHistory: (function(*=, {peer?: *, maxId?: *}): function(*): *), replyMessage: (function(*): {messageId: *, type: string}), getNewerMessages: (function(*=): function(*): *), cancelGetNewerMessages: (function(): function(*, *): *), updateNotifySettings: (function(*=): function(*): *), editChatTitle: (function({chatId?: *, title?: *}): function(*): *), addChatUser: (function({chatId?: *, user?: *}): function(*): *), readAllHistory: (function(*=, *=): function(*): *)}}
 */
export const ActionCreators = {
	addChatUser,
	deleteHistory,
	createChat,
	getChatUpdates,
	getHistory,
	getNewerMessages,
	readHistory,
	readAllHistory,
	removeChatUser,
	replyMessage,
	sendMessage,
	updateNotifySettings,
	cancelGetChatUpdates,
	getDialogs,
	getMessageViewers,
	editChatTitle,
	cancelGetNewerMessages,
	deleteMyAnnouncement
};

export default {ActionTypes, ActionCreators};