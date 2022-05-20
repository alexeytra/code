import {ActionTypes} from './../actions/MessengerActions';
import keyBy from 'lodash/keyBy';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import omitBy from 'lodash/omitBy';
import {getMessages} from '../utils/messageUtils';

const DEFAULT_LIMIT_SIZE = 50;

/**
 * Начальное состояние
 * @type {{hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}}
 */
const initialState = {
	dialogs: {},
	chats: {},
	messages: {},
	users: {},
	status: 'NOT_LOADED',
	messageStatus: 'LOADING',
	filterSupport: '',
	error: {},
	fetchingUpdate: false,
	fetchingChatUpdate: false,
	replyMessage: null,
	isReadingAllHistory: false,
	hasMoreDialogs: {
		ANNOUNCEMENT: true,
		CHAT: true,
		DIALOGUE: true,
		MYANNOUNCEMENT: true,
		SUPPORT: true,
		APPEAL: true,
		APPLICATION: true,
		QUIZ: true
	},
	axios: {}
};

/**
 * Редюсер
 * @param state Состояние
 * @param action Экшен
 * @returns {({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{users: {}, status: string})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{replyMessage: *})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{chats: {}, messages: {}})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{status: string})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{fetchingChatUpdate: boolean})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{error: *, status: string})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{chats: {}, dialogs: {}})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{axios: ({}&{[p: string]: null, GET_NEWER_MESSAGES: null}), fetchingUpdate: boolean})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{chats: {}, users: {}})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{replyMessage: null})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{axios: ({}&{[p: string]: *, GET_NEWER_MESSAGES: *}), fetchingUpdate: boolean})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{changeReason: string, messages: {}, dialogs: {}})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{changeReason: string, chats, messages: {}, dialogs: {}, users, fetchingChatUpdate: boolean})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{chats: {}, users: {}, status: string})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{axiosSource: *, fetchingChatUpdate: boolean})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{chats: {}})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{messageStatus: string, changeReason: string, chats, messages: {}, users})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{chats: {}, messages: {}, dialogs: {}, users: {}})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{changeReason: string, lastUpdate: *, chats, axios: ({}&{[p: string]: null, GET_NEWER_MESSAGES: null}), messages: {}, dialogs, users, fetchingUpdate: boolean})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{chats, messages, dialogs})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{messages})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{filterSupport: (string|*)})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{dialogs: {}, users: {}})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{messageStatus: string})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{messages: {}, isReadingAllHistory: boolean, dialogs: *})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{axiosSource: null, fetchingChatUpdate: boolean})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{isReadingAllHistory: boolean})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{chats, messages: {}, dialogs, users})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{messages, dialogs: {}})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, chats, messages: {}, dialogs, users, status: string})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{messages: {}, users: {}})|({hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}&{messages: {}})|{hasMoreDialogs: {ANNOUNCEMENT: boolean, SUPPORT: boolean, QUIZ: boolean, CHAT: boolean, APPEAL: boolean, MYANNOUNCEMENT: boolean, DIALOGUE: boolean}, error: {}, isReadingAllHistory: boolean, dialogs: {}, users: {}, messageStatus: string, filterSupport: string, replyMessage: null, chats: {}, messages: {}, axios: {}, fetchingUpdate: boolean, fetchingChatUpdate: boolean, status: string}}
 */
export default function reducer(state = initialState, action) {

	switch (action.type) {
		case ActionTypes.GET_DIALOGS_REQUEST:
			return {...state, status: 'LOADING'};

		case ActionTypes.GET_DIALOGS_COMPLETED:
			return {
				...state,
				dialogs: merge({}, {...state.dialogs}, {...keyBy(action.payload.dialogs, 'peerId')}),
				chats: merge({}, {...state.chats}, {...keyBy(action.payload.chats, 'id')}),
				users: merge({}, {...state.users}, {...keyBy(action.payload.users, 'id')}),
				messages: {...state.messages, ...keyBy(action.payload.messages, 'id')},
				status: 'LOADED',
				hasMoreDialogs: {
					...state.hasMoreDialogs,
					[action.params.type]: action.payload.dialogs.length === (action.params.limit || DEFAULT_LIMIT_SIZE)
				}
			};

		case ActionTypes.GET_DIALOGS_FAILED:
			return {...state, status: 'LOADED'};

		case ActionTypes.GET_HISTORY_REQUEST:
			return {...state, messageStatus: 'LOADING'};

		case ActionTypes.CLEAR_DIALOGS_STATE:
			return {
				...state,
				dialogs: {},
				chats: {},
				users: {},
				messages: {},
			};

		case ActionTypes.SET_SUPPORT_FILTER:
			return {
				...state,
				filterSupport: action.filterBy
			};

		case ActionTypes.DELETE_HISTORY_COMPLETED:
			return {
				...state,
				messages: {...getMessages(state, action.payload)}
			};

		case ActionTypes.UPDATE_MESSAGE_REQUEST:
			return state;

		case ActionTypes.UPDATE_MESSAGE_COMPLETED:
			return {
				...state,
				messages: {
					...state.messages,
					[action.payload]: {
						...state.messages[action.payload],
						message: action.params.messageContent,
					}
				}
			};

		case ActionTypes.UPDATE_MESSAGE_FAILED:
			return state;

		case ActionTypes.GET_HISTORY_COMPLETED:
			return {
				...state,
				chats: merge({}, {...state.chats}, {...keyBy(action.payload.chats, 'id')}),
				users: merge({}, {...state.users}, {...keyBy(action.payload.users, 'id')}),
				messages: {...state.messages, ...keyBy(action.payload.messages, 'id')},
				changeReason: action.params.offset > 0 ? 'UNSHIFT' : 'PUSH',
				messageStatus: (action.params.limit && action.params.limit > action.payload.messages.length) || action.payload.messages.length < 25 ? 'FULLY_LOADED' : 'LOADED'
			};

		case ActionTypes.GET_HISTORY_FAILED:
			return {...state, messageStatus: 'LOADED'};

		case ActionTypes.READ_HISTORY_REQUEST:
			return state;

		case ActionTypes.READ_HISTORY_COMPLETED: {
			const peerId = action.peer.chatId || action.peer.userId;
			let messages;
			let lastMessageId;
			if (action.peer.chatId) {
				messages = Object.keys(state.messages)
					.map(key => state.messages[key])
					.map(message => (message.peerId === peerId && message.id <= action.messageId && !(message.flags & 0x2) ? {
						...message,
						views: message.views + 1,
						flags: message.flags | 0x2
					} : message));
				lastMessageId = Math.max(...messages.filter(message => message.peerId === peerId)
					.map(message => message.id));
			} else {
				messages = Object.keys(state.messages)
					.map(key => state.messages[key])
					.map(message => ((message.from === action.uid && message.peerId === peerId || message.from === peerId && message.peerId === action.uid) && message.id <= action.messageId && !(message.flags & 0x2) ? {
						...message,
						views: message.views + 1,
						flags: !(message.flags & 0x1) ? message.flags | 0x2 : message.flags
					} : message));
				lastMessageId = Math.max(...messages.filter(message => (message.from === action.uid && message.peerId === peerId || message.from === peerId && message.peerId === action.uid))
					.map(message => message.id));
			}
			const unreadCount = messages.filter(message => message.peerId === peerId && !(message.flags & 0x1) && !(message.flags & 0x2)).length;
			return {
				...state,
				dialogs: {...state.dialogs, [peerId]: {...state.dialogs[peerId], unreadCount, lastMessageId}},
				messages: keyBy(messages, 'id')
			};
		}

		case ActionTypes.READ_HISTORY_FAILED:
			return state;

		case ActionTypes.READ_ALL_HISTORY_REQUEST:
			return {
				...state,
				isReadingAllHistory: true,
			};

		case ActionTypes.READ_ALL_HISTORY_COMPLETED: {
			let messages = [];
			const readDialogs = action.messages.map(m => {
				const peerId = m.peer.chatId || m.peer.userId;
				if (m.peer.chatId) {
					messages.push(...Object.keys(state.messages)
						.map(key => state.messages[key])
						.filter(message => (message.peerId === peerId && message.id <= m.maxId && !(message.flags & 0x2)))
						.map(message => ({...message, views: message.views + 1, flags: message.flags | 0x2}))
					)
				} else {
					messages.push(...Object.keys(state.messages)
						.map(key => state.messages[key])
						.filter(message => ((message.from === action.uid && message.peerId === peerId || message.from === peerId && message.peerId === action.uid) && message.id <= m.maxId && !(message.flags & 0x2)))
						.map(message => ({
							...message,
							views: message.views + 1,
							flags: !(message.flags & 0x1) ? message.flags | 0x2 : message.flags
						}))
					)
				}
				return {id: [peerId], info: {...state.dialogs[peerId], unreadCount: 0, lastMessageId: m.maxId}}
			})
				.reduce((obj, item) => Object.assign(obj, {[item.id]: item.info}), {});

			return {
				...state,
				isReadingAllHistory: false,
				dialogs: {...state.dialogs, ...readDialogs},
				messages: {...state.messages, ...keyBy(messages, 'id')},
			};
		}


		case ActionTypes.READ_ALL_HISTORY_FAILED:
			return state;

		case ActionTypes.SEND_MESSAGE_REQUEST:
			return {...state, replyMessage: null};

		case ActionTypes.SEND_MESSAGE_COMPLETED: {
			const peerId = action.message.peer.chatId || action.message.peer.userId;
			return {
				...state,
				dialogs: {
					...state.dialogs,
					[peerId]: {...state.dialogs[peerId], unreadCount: 0, lastMessageId: action.payload.id}
				},
				messages: {
					...state.messages,
					[action.payload.id]: {
						id: action.payload.id,
						from: action.uid,
						message: action.message.message,
						peerId: action.message.peer.chatId || action.message.peer.userId,
						flags: 0x1 | 0x2,
						date: action.payload.date,
						views: 1,
						replyToMsgId: action.message.replyToId,
						attachments: action.payload.attachments
					}
				},
				changeReason: 'PUSH'
			};
		}

		case ActionTypes.SEND_MESSAGE_FAILED:
			return state;

		case ActionTypes.CREATE_CHAT_REQUEST:
			return state;

		case ActionTypes.CREATE_CHAT_COMPLETED: {
			return {
				...state,
				dialogs: merge({}, {...state.dialogs}, {...keyBy(action.payload.dialogs, 'peerId')}),
				chats: merge({}, {...state.chats}, {...keyBy(action.payload.chats, 'id')}),
				users: merge({}, {...state.users}, {...keyBy(action.payload.users, 'id')}),
				messages: {...state.messages, ...keyBy(action.payload.messages, 'id')},
			};
			// const chatId = action.payload.chat.id;
			// return {
			//	...state,
			//	dialogs: {
			//		...state.dialogs,
			//		[chatId]: {
			//			peerId: chatId,
			//			lastMessageId: null,
			//			unreadCount: 0,
			//			notifySettings: true
			//		}
			//	},
			//	chats: {
			//		...state.chats,
			//		[chatId]: {
			//			...action.payload.chat,
			//			participants: action.payload.participants,
			//			notifySettings: action.payload.notifySettings,
			//		}
			//	},
			//	users: {
			//		...state.users,
			//		...keyBy(action.payload.users, 'id')
			//	},
			//	status: 'LOADED'
			// };
		}

		case ActionTypes.CREATE_CHAT_FAILED:
			return state;

		case ActionTypes.GET_CHAT_UPDATES_REQUEST:
			return {...state, fetchingChatUpdate: true, axiosSource: action.source};

		case ActionTypes.GET_CHAT_UPDATES_COMPLETED: {
			const peerId = action.peer.chatId || action.peer.userId;
			const messages = {...state.messages, ...keyBy(action.payload.messages, 'id')};
			const messagesList = Object.keys(messages)
				.map(key => messages[key]);
			let lastMessageId;
			let unreadCount;
			if (action.peer.chatId) {
				lastMessageId = Math.max(...messagesList.filter(message => message.peerId === peerId)
					.map(message => message.id));
				unreadCount = messagesList.filter(message => message.peerId === peerId && !(message.flags & 0x1) && !(message.flags & 0x2)).length;
			} else {
				lastMessageId = Math.max(...messagesList.filter(message => (message.from === action.uid && message.peerId === peerId || message.from === peerId && message.peerId === action.uid))
					.map(message => message.id));
				unreadCount = messagesList.filter(message => (message.from === action.uid && message.peerId === peerId || message.from === peerId && message.peerId === action.uid) && !(message.flags & 0x1) && !(message.flags & 0x2)).length;
			}
			return {
				...state,
				dialogs: {...state.dialogs, [peerId]: {...state.dialogs[peerId], unreadCount, lastMessageId}},
				chats: merge({}, {...state.chats}, {...keyBy(action.payload.chats, 'id')}),
				users: merge({}, {...state.users}, {...keyBy(action.payload.users, 'id')}),
				messages,
				changeReason: 'PUSH',
				fetchingChatUpdate: false
			};
		}

		case ActionTypes.GET_CHAT_UPDATES_FAILED:
			return {...state, fetchingChatUpdate: false};

		case ActionTypes.GET_CHAT_UPDATES_CANCELLED:
			return {...state, fetchingChatUpdate: false, axiosSource: null};

		case ActionTypes.GET_NEWER_MESSAGES_REQUEST:
			return {...state, axios: {...state.axios, ['GET_NEWER_MESSAGES']: action.axios}, fetchingUpdate: true};

		case ActionTypes.GET_NEWER_MESSAGES_COMPLETED:
			return {
				...state,
				axios: {...state.axios, ['GET_NEWER_MESSAGES']: null},
				dialogs: merge({}, {...state.dialogs}, {...keyBy(action.payload.dialogs, 'peerId')}),
				chats: merge({}, {...state.chats}, {...keyBy(action.payload.chats, 'id')}),
				users: merge({}, {...state.users}, {...keyBy(action.payload.users, 'id')}),
				messages: {...state.messages, ...keyBy(action.payload.messages, 'id')},
				fetchingUpdate: false,
				changeReason: 'PUSH',
				lastUpdate: action.receivedAt
			};

		case ActionTypes.GET_NEWER_MESSAGES_FAILED:
			return {...state, axios: {...state.axios, ['GET_NEWER_MESSAGES']: null}, fetchingUpdate: false};

		case ActionTypes.GET_NEWER_MESSAGES_CANCELLED:
			return {...state, axios: {...state.axios, ['GET_NEWER_MESSAGES']: null}, fetchingUpdate: false};

		case ActionTypes.REPLY_MESSAGE:
			return {...state, replyMessage: action.messageId};

		case ActionTypes.UPDATE_NOTIFY_SETTINGS_REQUEST: {
			const {peer, notify} = action.notifySettings;
			if (peer.chatId) {
				return {
					...state,
					dialogs: {...state.dialogs, [peer.chatId]: {...state.dialogs[peer.chatId], notifySettings: notify}},
					chats: {...state.chats, [peer.chatId]: {...state.chats[peer.chatId], notifySettings: notify}}
				};
			} else {
				return {
					...state,
					dialogs: {...state.dialogs, [peer.userId]: {...state.dialogs[peer.userId], notifySettings: notify}},
					users: {...state.users, [peer.userId]: {...state.users[peer.userId], notifySettings: notify}}
				};
			}
		}

		case ActionTypes.UPDATE_NOTIFY_SETTINGS_COMPLETED: {
			const {peer, notify} = action.notifySettings;
			if (peer.chatId) {
				return {
					...state,
					dialogs: {...state.dialogs, [peer.chatId]: {...state.dialogs[peer.chatId], notifySettings: notify}},
					chats: {...state.chats, [peer.chatId]: {...state.chats[peer.chatId], notifySettings: notify}}
				};
			} else {
				return {
					...state,
					dialogs: {...state.dialogs, [peer.userId]: {...state.dialogs[peer.userId], notifySettings: notify}},
					users: {...state.users, [peer.userId]: {...state.users[peer.userId], notifySettings: notify}}
				};
			}
		}

		case ActionTypes.UPDATE_NOTIFY_SETTINGS_FAILED: {
			const {peer, notify} = action.notifySettings;
			if (peer.chatId) {
				return {
					...state,
					dialogs: {
						...state.dialogs,
						[peer.chatId]: {...state.dialogs[peer.chatId], notifySettings: !notify}
					},
					chats: {...state.chats, [peer.chatId]: {...state.chats[peer.chatId], notifySettings: !notify}}
				};
			} else {
				return {
					...state,
					dialogs: {
						...state.dialogs,
						[peer.userId]: {...state.dialogs[peer.userId], notifySettings: !notify}
					},
					users: {...state.users, [peer.userId]: {...state.users[peer.userId], notifySettings: !notify}}
				};
			}
		}

		case ActionTypes.GET_CHAT_FULL_REQUEST:
			return state;

		case ActionTypes.GET_CHAT_FULL_COMPLETED:
			return {
				...state,
				chats: {
					...state.chats,
					[action.chatId]: {
						...state.chats[action.chatId],
						...action.payload.chat,
						participants: action.payload.participants,
						notifySettings: action.payload.notifySettings,
					}
				},
				users: {
					...state.users,
					...keyBy(action.payload.users, 'id')
				},
				status: 'LOADED'
			};

		case ActionTypes.GET_CHAT_FULL_FAILED:
			return {...state, status: 'ERROR', error: action.error};

		case ActionTypes.GET_USER_FULL_REQUEST:
			return state;

		case ActionTypes.GET_USER_FULL_COMPLETED:
			return {
				...state,
				users: {
					...state.users,
					[action.userId]: {
						...state.users[action.userId],
						...action.payload.user,
						notifySettings: action.payload.notifySettings
					}
				},
				status: 'LOADED'
			};

		case ActionTypes.GET_USER_FULL_FAILED:
			return {...state, status: 'ERROR', error: action.error};

		case ActionTypes.GET_MESSAGE_VIEWERS_REQUEST:
			return state;

		case ActionTypes.GET_MESSAGE_VIEWERS_COMPLETED:
			return {
				...state,
				messages: {
					...state.messages,
					[action.messageId]: {
						...state.messages[action.messageId],
						views: action.payload.length,
						viewedBy: action.payload.map(user => user.id)
					}
				},
				users: {
					...state.users,
					...keyBy(action.payload, 'id')
				}
			};

		case ActionTypes.GET_MESSAGE_VIEWERS_FAILED:
			return state;

		case ActionTypes.ADD_CHAT_USER_COMPLETED: {
			const {participant, user} = action.payload;
			return {
				...state,
				chats: {
					...state.chats,
					[action.chatId]: {
						...state.chats[action.chatId],
						participants: [
							...state.chats[action.chatId].participants,
							participant
						],
						participantsCount: state.chats[action.chatId].participantsCount + 1
					}
				},
				users: {
					...state.users,
					[user.id]: {
						...user
					}
				}
			};
		}

		case ActionTypes.REMOVE_CHAT_USER_COMPLETED: {
			const userId = typeof action.user === 'string' ? action.user : (action.userId || action.userGroupId);
			if (action.uid === userId) {
				return {
					...state,
					dialogs: omit(state.dialogs, action.chatId),
					chats: omit(state.chats, action.chatId),
					messages: omitBy(state.messages, (message) => message.peerId === `${action.chatId}`),
				};
			}
			const participants = state.chats[action.chatId].participants.filter(participant => participant.id !== userId);
			return {
				...state,
				chats: {
					...state.chats,
					[action.chatId]: {
						...state.chats[action.chatId],
						participants,
						participantsCount: participants.length
					}
				}
			};
		}
		case ActionTypes.EDIT_CHAT_TITLE_REQUEST:
			return {
				...state,
				chats: {
					...state.chats,
					[action.chatId]: {
						...state.chats[action.chatId],
						name: action.title
					}
				}
			};

		case ActionTypes.EDIT_CHAT_TITLE_COMPLETED:
			return {
				...state,
				chats: {
					...state.chats,
					[action.chatId]: {
						...state.chats[action.chatId],
						name: action.title
					}
				}
			};

		case ActionTypes.EDIT_CHAT_TITLE_FAILED:
			return state;

		case ActionTypes.DELETE_MYANNOUNCEMENT_REQUEST:
			return state;

		case ActionTypes.DELETE_MYANNOUNCEMENT_COMPLETED:
			const {chatId, status} = action.params;
			return {
				...state,
				chats: {
					...state.chats,
					[chatId]: {
						...state.chats[chatId],
						type: status
					}
				}
			};

		case ActionTypes.DELETE_MYANNOUNCEMENT_FAILED:
			return state;

		case ActionTypes.CHANGE_CONFIRM_REQUEST:
			return state;

		case ActionTypes.CHANGE_CONFIRM_COMPLETED:
			return {
				...state,
				chats: {
					...state.chats,
					[action.params.chatId]: {
						...state.chats[action.params.chatId],
						confirm: state.chats[action.params.chatId].confirm === 'YES' ? 'NO' : 'YES'
					}
				}

			};

		case ActionTypes.CHANGE_CONFIRM_FAILED:
			return {...state, status: 'ERROR', error: action.error};

		case ActionTypes.GET_CONFIRM_FULL_REQUEST:
			return state;

		case ActionTypes.GET_CONFIRM_FULL_COMPLETED:
			return {
				...state,
				chats: {
					...state.chats,
					[action.chatId]: {
						...state.chats[action.chatId],
						confirmBy: action.payload.map(user => user.id)
					}
				},
				users: {
					...state.users,
					...keyBy(action.payload, 'id')
				},
				status: 'LOADED'
			};

		case ActionTypes.GET_CONFIRM_FULL_FAILED:
			return {...state, status: 'ERROR', error: action.error};

		case ActionTypes.EDIT_ANNOUNCEMENT_REQUEST:
			return state;

		case ActionTypes.EDIT_ANNOUNCEMENT_COMPLETED:
			return {
				...state,
				chats: {
					...state.chats,
					[action.param.id]: {
						...state.chats[action.param.id],
						name: action.param.name
					}
				},
				messages: {
					...state.messages,
					[action.msgId]: {
						...state.messages[action.msgId],
						message: action.param.message
					}
				}
			};

		case ActionTypes.EDIT_ANNOUNCEMENT_FAILED:
			return {...state, status: 'ERROR', error: action.error};


		default:
			return state;
	}
}