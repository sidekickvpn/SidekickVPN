const ADD_ALERT = 'alert/add';
const DISMISS_ALERT = 'alert/dismiss';
const GET_COUNT = 'alert/getCount';

const addAlert = alert => ({
	type: ADD_ALERT,
	payload: alert
});

const dismissAlert = alert => ({
	type: DISMISS_ALERT,
	payload: alert
});

const getCount = () => ({
	type: GET_COUNT
});

const defaultState = {
	alerts: [],
	count: 0
};

const reducer = (state = defaultState, action = {}) => {
	const { type, payload } = action;
	switch (type) {
		case ADD_ALERT:
			return Object.assign({}, state, {
				alerts: state.alerts.concat(payload),
				count: state.count + 1
			});
		case DISMISS_ALERT:
			return Object.assign({}, state, {
				alerts: state.alerts.filter(alert => alert !== payload),
				count: state.count - 1
			});
		case GET_COUNT:
		default:
			return state;
	}
};

export {
	ADD_ALERT,
	DISMISS_ALERT,
	GET_COUNT,
	addAlert,
	dismissAlert,
	getCount,
	defaultState,
	reducer
};
