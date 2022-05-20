import {ActionTypes} from './../actions/TaskActions';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';

/**
 * Начальное состояние
 * @type {{filter: {}, entities: {}, lastUpdate: number, error: {}, selected: null, status: string}}
 */
const initialState = {
	entities: {},
	lastUpdate: 0,
	status: 'NOT_LOADED',
	error: {},
	selected: null,
	filter: {},
};

/**
 * Переключить задачу
 * @param {*} task Задача
 * @returns {{status: string}}
 */
function toggleTask(task) {
	return {...task, status: task.status === 'UNCOMPLETED' ? 'COMPLETED' : 'UNCOMPLETED'};
}

/**
 * Редюсер
 * @param state Состояние
 * @param action Экшен
 * @returns {({filter: {}, entities: {}, lastUpdate: number, error: {}, selected: null, status: string}&{entities, error: {}, status: string})|({filter: {}, entities: {}, lastUpdate: number, error: {}, selected: null, status: string}&{error: *, status: string})|({filter: {}, entities: {}, lastUpdate: number, error: {}, selected: null, status: string}&{filter: {}})|({filter: {}, entities: {}, lastUpdate: number, error: {}, selected: null, status: string}&{selected: null})|({filter: {}, entities: {}, lastUpdate: number, error: {}, selected: null, status: string}&{selected: *})|({filter: {}, entities: {}, lastUpdate: number, error: {}, selected: null, status: string}&{entities})|({filter: {}, entities: {}, lastUpdate: number, error: {}, selected: null, status: string}&{newTask: {priority: number, status: string}})|({filter: {}, entities: {}, lastUpdate: number, error: {}, selected: null, status: string}&{entities: {}, lastUpdate: *, error: {}, status: string})|({filter: {}, entities: {}, lastUpdate: number, error: {}, selected: null, status: string}&{error: {}, status: string})|({filter: {}, entities: {}, lastUpdate: number, error: {}, selected: null, status: string}&{entities: {}})|({filter: {}, entities: {}, lastUpdate: number, error: {}, selected: null, status: string}&{entities: {}, error: {}})|({filter: {}, entities: {}, lastUpdate: number, error: {}, selected: null, status: string}&{entities: {}, error: {}, status: string})|{filter: {}, entities: {}, lastUpdate: number, error: {}, selected: null, status: string}}
 */
export default function reducer(state = initialState, action) {
	switch (action.type) {

		case ActionTypes.LOAD_TASKS_REQUEST:
			return {...state, status: 'LOADING', error: {}};

		case ActionTypes.LOAD_TASKS_COMPLETED:
			return {
				...state,
				status: 'LOADED',
				entities: {...state.entities, ...keyBy(action.payload, 'taskId')},
				lastUpdate: action.receivedAt,
				error: {}
			};

		case ActionTypes.LOAD_TASKS_FAILED:
			return {...state, status: 'ERROR', error: action.error};

		case ActionTypes.SAVE_TASK_REQUEST:
			return state;

		case ActionTypes.SAVE_TASK_COMPLETED:
			return {
				...state,
				//entities: {...state.entities, ...keyBy([action.payload], 'taskId')},
				selected: action.payload
			};

		case ActionTypes.SAVE_TASK_FAILED:
			return {...state, status: 'ERROR', error: action.error};

		case ActionTypes.UPDATE_TASK_REQUEST:
			return state;

		case ActionTypes.UPDATE_TASK_COMPLETED:
			return {
				...state,
				status: 'LOADED',
				entities: {...state.entities, ...keyBy([action.payload], 'taskId')},
				error: {}
			};

		case ActionTypes.UPDATE_TASK_FAILED:
			return {...state, status: 'ERROR', error: action.error};

		case ActionTypes.SELECT_TASK:
			if (action.id) {
				return {...state, selected: action.id};
			} else {
				return {...state, selected: null};
			}

		case ActionTypes.UPDATE_TASK_UI:
			return {...state, entities: {...state.entities, [action.task.taskId]: action.task}, error: {}};

		case ActionTypes.DELETE_TASK_REQUEST:
			return {...state};

		case ActionTypes.DELETE_TASK_COMPLETED:
			return {...state, status: 'LOADED', entities: omit(state.entities, action.id), error: {}};

		case ActionTypes.DELETE_TASK_FAILED:
			return {...state};

		case ActionTypes.TOGGLE_TASK:
			return {...state, entities: {...state.entities, [action.id]: toggleTask(state.entities[action.id])}};

		case ActionTypes.CHANGE_FILTER: {
			return {...state, filter: {...state.filter, ...action.filter}};
		}

		case ActionTypes.CREATE_TASK:
			return {...state, newTask: {priority: 0, status: 'UNCOMPLETED', ...action.params}};

		case ActionTypes.CREATE_TASK_CHAT_REQUEST:
			return {...state};

		case ActionTypes.CREATE_TASK_CHAT_COMPLETED:
			return {
				...state,
				entities: {...state.entities, [action.id]: {...state.entities[action.id], linkedChatId: action.payload}}
			};

		case ActionTypes.CREATE_TASK_CHAT_FAILED:
			return {...state};

		case ActionTypes.CHANGE_TASK_PRIORITY_REQUEST:
			return state;

		case ActionTypes.CHANGE_TASK_PRIORITY_COMPLETED:
			return {...state, entities: {...state.entities, [action.payload.taskId]: action.payload}};

		case ActionTypes.CHANGE_TASK_PRIORITY_FAILED:
			return state;

		case ActionTypes.CHANGE_TASK_STATUS_REQUEST:
			return state;

		case ActionTypes.CHANGE_TASK_STATUS_COMPLETED:
			return {...state, entities: {...state.entities, [action.payload.taskId]: action.payload}};

		case ActionTypes.CHANGE_TASK_STATUS_FAILED:
			return state;

		case ActionTypes.CLEAR_TRASH_COMPLETED:
			return {
				...state,
				entities: omit(state.entities, Object.keys(state.entities)
					.filter(taskId => state.entities[taskId].status === 'DELETED'))
			};

		default:
			return state;
	}
}