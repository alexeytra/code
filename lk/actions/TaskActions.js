import Api from './../utils/api';

/**
 * Константы для редюсеров
 * @type {string}
 */
const LOAD_TASKS_REQUEST = 'LOAD_TASKS_REQUEST';
const LOAD_TASKS_COMPLETED = 'LOAD_TASKS_COMPLETED';
const LOAD_TASKS_FAILED = 'LOAD_TASKS_FAILED';

const SAVE_TASK_REQUEST = 'SAVE_TASK_REQUEST';
const SAVE_TASK_COMPLETED = 'SAVE_TASK_COMPLETED';
const SAVE_TASK_FAILED = 'SAVE_TASK_FAILED';

const UPDATE_TASK_REQUEST = 'UPDATE_TASK_REQUEST';
const UPDATE_TASK_COMPLETED = 'UPDATE_TASK_COMPLETED';
const UPDATE_TASK_FAILED = 'UPDATE_TASK_FAILED';

const DELETE_TASK_REQUEST = 'DELETE_TASK_REQUEST';
const DELETE_TASK_COMPLETED = 'DELETE_TASK_COMPLETED';
const DELETE_TASK_FAILED = 'DELETE_TASK_FAILED';

const CREATE_TASK_CHAT_REQUEST = 'CREATE_TASK_CHAT_REQUEST';
const CREATE_TASK_CHAT_COMPLETED = 'CREATE_TASK_CHAT_COMPLETED';
const CREATE_TASK_CHAT_FAILED = 'CREATE_TASK_CHAT_FAILED';

const CHANGE_TASK_PRIORITY_REQUEST = 'CHANGE_TASK_PRIORITY_REQUEST';
const CHANGE_TASK_PRIORITY_COMPLETED = 'CHANGE_TASK_PRIORITY_COMPLETED';
const CHANGE_TASK_PRIORITY_FAILED = 'CHANGE_TASK_PRIORITY_FAILED';

const CHANGE_TASK_STATUS_REQUEST = 'CHANGE_TASK_STATUS_REQUEST';
const CHANGE_TASK_STATUS_COMPLETED = 'CHANGE_TASK_STATUS_COMPLETED';
const CHANGE_TASK_STATUS_FAILED = 'CHANGE_TASK_STATUS_FAILED';

const CLEAR_TRASH_REQUEST = 'CLEAR_TRASH_REQUEST';
const CLEAR_TRASH_COMPLETED = 'CLEAR_TRASH_COMPLETED';
const CLEAR_TRASH_FAILED = 'CLEAR_TRASH_FAILED';

const CREATE_TASK = 'CREATE_TASK';
const SELECT_TASK = 'SELECT_TASK';
const UPDATE_TASK_UI = 'UPDATE_TASK_UI';
const TOGGLE_TASK = 'TOGGLE_TASK';

const CHANGE_FILTER = 'CHANGE_FILTER';
const TASK_CALENDAR_CHANGE_DATE = 'TASK_CALENDAR_CHANGE_DATE';
const TASK_CALENDAR_CHANGE_TYPE = 'TASK_CALENDAR_CHANGE_TYPE';

/**
 * Загрузка задач
 * @param {*} params Параметры
 * @returns {function(*): *}
 */
export const loadTasks = (params) => dispatch => {
	dispatch(loadTasksRequest());
	return Api.loadTasks(params)
		.then(payload => dispatch(loadTasksCompleted(payload)))
		.catch(error => dispatch(loadTasksFailed(error)));
};

/**
 * Запрос
 * @returns {{type: string}}
 */
const loadTasksRequest = () => ({type: LOAD_TASKS_REQUEST});
/**
 * Запрос завершен
 * @param {*} payload Ответ сервера
 * @returns {{payload: *, type: string, receivedAt: number}}
 */
const loadTasksCompleted = (payload) => ({type: LOAD_TASKS_COMPLETED, payload, receivedAt: Date.now()});
/**
 * Запрос завершен с ошибкой
 * @param {*} error Ошибка
 * @returns {{type: string, error: *}}
 */
const loadTasksFailed = (error) => ({type: LOAD_TASKS_FAILED, error});

/**
 * Сохранение задачи
 * @param {*} task Задача
 * @returns {function(*): *}
 */
export const saveTask = (task) => dispatch => {
	dispatch(saveTaskRequest());
	return Api.createTask(task)
		.then(payload => dispatch(saveTaskCompleted(payload)))
		.catch(error => dispatch(saveTaskFailed(error)));
};

/**
 * Запрос
 * @returns {{type: string}}
 */
const saveTaskRequest = () => ({type: SAVE_TASK_REQUEST});
/**
 * Запрос завершен
 * @param {*} payload Ответ сервера
 * @returns {{payload: *, type: string}}
 */
const saveTaskCompleted = (payload) => ({type: SAVE_TASK_COMPLETED, payload});
/**
 * Ответ завершен с ошибкой
 * @param {*} error Ошибка
 * @returns {{type: string, error: *}}
 */
const saveTaskFailed = (error) => ({type: SAVE_TASK_FAILED, error});

/**
 * Обновление задачи
 * @param {*} task Задача
 * @returns {function(*): *}
 */
export const updateTask = (task) => dispatch => {
	dispatch(updateTaskRequest(task.taskId, task));
	return Api.updateTask(task)
		.then(payload => dispatch(updateTaskCompleted(task.taskId, payload)))
		.catch(error => dispatch(updateTaskFailed(task.taskId, error)));
};

/**
 * Запрос
 * @param {*} id Идентификатор
 * @param {*} task Задача
 * @returns {{task: *, id: *, type: string}}
 */
const updateTaskRequest = (id, task) => ({type: UPDATE_TASK_REQUEST, id, task});
/**
 * Запрос завершен
 * @param {*} id Идентификатор
 * @param {*} payload Ответ сервера
 * @returns {{payload: *, id: *, type: string}}
 */
const updateTaskCompleted = (id, payload) => ({type: UPDATE_TASK_COMPLETED, id, payload});
/**
 * Запрос завершен с ошибкой
 * @param {*} id Идентификатор
 * @param {*} error Ответ сервера
 * @returns {{id: *, type: string, error: *}}
 */
const updateTaskFailed = (id, error) => ({type: UPDATE_TASK_FAILED, id, error});

/**
 * Удаление задачи
 * @param {*} id Идентификатор
 * @returns {function(*): *}
 */
export const deleteTask = (id) => dispatch => {
	dispatch(deleteTaskRequest(id));
	return Api.deleteTask(id)
		.then(() => dispatch(deleteTaskCompleted(id)))
		.catch(error => dispatch(deleteTaskFailed(id, error)));
};

/**
 * Запрос
 * @param {*} id Идентфикатор
 * @returns {{id: *, type: string}}
 */
const deleteTaskRequest = (id) => ({type: DELETE_TASK_REQUEST, id});
/**
 * Запрос завершен
 * @param {*} id Идентификатор
 * @returns {{id: *, type: string}}
 */
const deleteTaskCompleted = (id) => ({type: DELETE_TASK_COMPLETED, id});
/**
 * Запрос завершен с ошибкой
 * @param {*} id Идентфикатор
 * @param {*} error Ошибка
 * @returns {{id: *, type: string, error: *}}
 */
const deleteTaskFailed = (id, error) => ({type: DELETE_TASK_FAILED, id, error});
/**
 * Выбрать задачу
 * @param {*} id Идентификатор
 * @returns {{id: *, type: string}}
 */
export const selectTask = (id) => ({type: SELECT_TASK, id});
/**
 * Обновление UI
 * @param {*} task Задача
 * @returns {{task: *, type: string}}
 */
export const updateTaskUI = (task) => ({type: UPDATE_TASK_UI, task});
/**
 * Переключить задачу
 * @param {*} ids Идентификаторы
 * @returns {{ids: *, type: string}}
 */
export const toggleTask = (ids) => ({type: TOGGLE_TASK, ids});
/**
 * Изменение фильтра
 * @param {*} filter Фильтр
 * @returns {{filter: *, type: string}}
 */
export const changeFilter = (filter) => ({type: CHANGE_FILTER, filter});
/**
 * Создание задачи
 * @param {*} params Параметры
 * @returns {{type: string, params: *}}
 */
export const createTask = (params) => ({type: CREATE_TASK, params});

/**
 * Создание задачи
 * @param {*} taskId Идентификатор задачи
 * @returns {function(*): *}
 */
export const createTaskChat = (taskId) => dispatch => {
	dispatch(createTaskChatRequest(taskId));
	return Api.createTaskChat(taskId)
		.then(payload => dispatch(createTaskChatCompleted(taskId, payload)))
		.catch(err => dispatch(createTaskChatFailed(taskId, err)));
};
/**
 * Запрос
 * @param {*} id Идентификатор
 * @returns {{id: *, type: string}}
 */
const createTaskChatRequest = (id) => ({type: CREATE_TASK_CHAT_REQUEST, id});
/**
 * Запрос завершен
 * @param {*} id Идентификатор
 * @param {*} payload Ответ сервера
 * @returns {{payload: *, id: *, type: string}}
 */
const createTaskChatCompleted = (id, payload) => ({type: CREATE_TASK_CHAT_COMPLETED, id, payload});
/**
 * Запрос завершен с ошибкой
 * @param {*} id Идентификатор
 * @param {*} error Ошибка
 * @returns {{id: *, type: string, error: *}}
 */
const createTaskChatFailed = (id, error) => ({type: CREATE_TASK_CHAT_FAILED, id, error});

/**
 * Изменение приоритета задачи
 * @param {*} taskId Идентификатор задачи
 * @param {*} priority Приоритет
 * @returns {function(*): *}
 */
export const changeTaskPriority = ({taskId, priority}) => dispatch => {
	dispatch(changeTaskPriorityRequest({taskId, priority}));
	return Api.changeTaskPriority({taskId, priority})
		.then(payload => dispatch(changeTaskPriorityCompleted(payload)))
		.catch(err => dispatch(changeTaskPriorityFailed(err)));
};
/**
 * Запрос
 * @param {*} taskPriority Приоритет
 * @returns {{taskPriority: *, type: string}}
 */
const changeTaskPriorityRequest = (taskPriority) => ({type: CHANGE_TASK_PRIORITY_REQUEST, taskPriority});
/**
 * Запрос завершен
 * @param {*} payload Ответ сервера
 * @returns {{payload: *, type: string}}
 */
const changeTaskPriorityCompleted = (payload) => ({type: CHANGE_TASK_PRIORITY_COMPLETED, payload});
/**
 * Запрос завершен с ошибкой
 * @param {*} taskPriority Приоритет
 * @param {*} error Ошибка
 * @returns {{taskPriority: *, type: string, error: *}}
 */
const changeTaskPriorityFailed = (taskPriority, error) => ({type: CHANGE_TASK_PRIORITY_FAILED, taskPriority, error});

/**
 * Изменение статуса задачи
 * @param {*} taskId Идентфикатор задачи
 * @param {*} status Статус
 * @returns {function(*): *}
 */
export const changeTaskStatus = ({taskId, status}) => dispatch => {
	dispatch(changeTaskStatusRequest({taskId, status}));
	return Api.changeTaskStatus({taskId, status})
		.then(payload => dispatch(changeTaskStatusCompleted(payload)))
		.catch(err => dispatch(changeTaskStatusFailed({taskId, status}, err)));
};
/**
 * Запрос
 * @param {*} taskStatus Идентфикатор задачи
 * @returns {{type: string, taskStatus: *}}
 */
const changeTaskStatusRequest = (taskStatus) => ({type: CHANGE_TASK_STATUS_REQUEST, taskStatus});
/**
 * Запрос завершен
 * @param {*} payload Ответ сервера
 * @returns {{payload: *, type: string}}
 */
const changeTaskStatusCompleted = (payload) => ({type: CHANGE_TASK_STATUS_COMPLETED, payload});
/**
 * Запрос завершен с ошибкой
 * @param {*} taskStatus Статус задачи
 * @param {*} error Ошибка
 * @returns {{type: string, error: *, taskStatus: *}}
 */
const changeTaskStatusFailed = (taskStatus, error) => ({type: CHANGE_TASK_STATUS_FAILED, taskStatus, error});

/**
 * Очиска корзины
 * @returns {function(*): *}
 */
export const clearTrash = () => dispatch => {
	dispatch(clearTrashRequest());
	return Api.clearTrash()
		.then(payload => dispatch(clearTrashCompleted(payload)))
		.catch(err => dispatch(clearTrashFailed(err)));
};
/**
 * Запрос
 * @returns {{type: string}}
 */
const clearTrashRequest = () => ({type: CLEAR_TRASH_REQUEST});
/**
 * Запрос завершен
 * @returns {{type: string}}
 */
const clearTrashCompleted = () => ({type: CLEAR_TRASH_COMPLETED});
/**
 *
 * @returns {{type: string}}
 */
const clearTrashFailed = () => ({type: CLEAR_TRASH_FAILED});

/**
 * Запрос завершен с ошибкой
 * @param {*} date Дата
 * @returns {{date: *, type: string}}
 */
export const tcChangeDate = (date) => ({type: TASK_CALENDAR_CHANGE_DATE, date});
/**
 * Изменение типа
 * @param {*} displayType Отображаемый тип
 * @returns {{displayType: *, type: string}}
 */
export const tcChangeType = (displayType) => ({type: TASK_CALENDAR_CHANGE_TYPE, displayType});

/**
 * Типы экшенов
 * @type {{SAVE_TASK_COMPLETED: string, CREATE_TASK_CHAT_COMPLETED: string, CREATE_TASK: string, CHANGE_TASK_STATUS_REQUEST: string, TASK_CALENDAR_CHANGE_TYPE: string, SAVE_TASK_FAILED: string, SELECT_TASK: string, UPDATE_TASK_UI: string, CLEAR_TRASH_REQUEST: string, CLEAR_TRASH_FAILED: string, CHANGE_TASK_STATUS_FAILED: string, DELETE_TASK_FAILED: string, TOGGLE_TASK: string, TASK_CALENDAR_CHANGE_DATE: string, CHANGE_FILTER: string, CREATE_TASK_CHAT_REQUEST: string, DELETE_TASK_REQUEST: string, CHANGE_TASK_STATUS_COMPLETED: string, LOAD_TASKS_COMPLETED: string, CREATE_TASK_CHAT_FAILED: string, LOAD_TASKS_FAILED: string, UPDATE_TASK_COMPLETED: string, CHANGE_TASK_PRIORITY_REQUEST: string, CHANGE_TASK_PRIORITY_FAILED: string, SAVE_TASK_REQUEST: string, UPDATE_TASK_FAILED: string, LOAD_TASKS_REQUEST: string, UPDATE_TASK_REQUEST: string, CLEAR_TRASH_COMPLETED: string, DELETE_TASK_COMPLETED: string, CHANGE_TASK_PRIORITY_COMPLETED: string}}
 */
export const ActionTypes = {
	LOAD_TASKS_REQUEST,
	LOAD_TASKS_COMPLETED,
	LOAD_TASKS_FAILED,
	SAVE_TASK_REQUEST,
	SAVE_TASK_COMPLETED,
	SAVE_TASK_FAILED,
	UPDATE_TASK_REQUEST,
	UPDATE_TASK_COMPLETED,
	UPDATE_TASK_FAILED,
	SELECT_TASK,
	UPDATE_TASK_UI,
	DELETE_TASK_REQUEST,
	DELETE_TASK_COMPLETED,
	DELETE_TASK_FAILED,
	TOGGLE_TASK,
	CHANGE_FILTER,
	CREATE_TASK,
	CREATE_TASK_CHAT_REQUEST,
	CREATE_TASK_CHAT_COMPLETED,
	CREATE_TASK_CHAT_FAILED,
	CHANGE_TASK_PRIORITY_REQUEST,
	CHANGE_TASK_PRIORITY_COMPLETED,
	CHANGE_TASK_PRIORITY_FAILED,
	CHANGE_TASK_STATUS_REQUEST,
	CHANGE_TASK_STATUS_COMPLETED,
	CHANGE_TASK_STATUS_FAILED,
	CLEAR_TRASH_REQUEST,
	CLEAR_TRASH_COMPLETED,
	CLEAR_TRASH_FAILED,
	TASK_CALENDAR_CHANGE_DATE,
	TASK_CALENDAR_CHANGE_TYPE,
};

/**
 * Экшены
 * @type {{tcChangeDate: (function(*): {date: *, type: string}), loadTasks: (function(*=): function(*): *), toggleTask: (function(*): {ids: *, type: string}), selectTask: (function(*): {id: *, type: string}), changeTaskPriority: (function({taskId: *, priority: *}): function(*): *), updateTask: (function(*=): function(*): *), saveTask: (function(*=): function(*): *), changeTaskStatus: (function({taskId?: *, status?: *}): function(*): *), tcChangeType: (function(*): {displayType: *, type: string}), createTaskChat: (function(*=): function(*): *), updateTaskUI: (function(*): {task: *, type: string}), clearTrash: (function(): function(*): *), deleteTask: (function(*=): function(*): *), createTask: (function(*): {type: string, params: *})}}
 */
export const ActionCreators = {
	clearTrash,
	loadTasks,
	saveTask,
	selectTask,
	updateTask,
	updateTaskUI,
	deleteTask,
	toggleTask,
	createTask,
	createTaskChat,
	changeTaskPriority,
	changeTaskStatus,
	tcChangeDate,
	tcChangeType,
};