const ADD_REPORT = 'reports/add';
const DELETE_REPORT = 'reports/deleteClick';
const DELETE_ALL_REPORTS = 'reports/deleteAllClick';

const deleteClick = id => ({
	type: DELETE_REPORT,
	payload: id
});

const deleteAllClick = () => ({
	type: DELETE_ALL_REPORTS
});

const addReport = reports => ({
	type: ADD_REPORT,
	payload: reports
});

export const defaultState = {
	reports: []
};

const reducer = (state = defaultState, action = {}) => {
	switch (action.type) {
		case DELETE_REPORT:
			return Object.assign({}, state, {
				reports: state.reports.filter(report => report._id !== action.payload)
			});
		case DELETE_ALL_REPORTS:
			return {
				reports: []
			};
		case ADD_REPORT:
			return Object.assign({}, state, {
				reports: state.reports.concat(action.payload)
			});
		default:
			return state;
	}
};

export { reducer, deleteClick, deleteAllClick, addReport };
