const DELETE_REPORT = 'reports/deleteClick';
const DELETE_ALL_REPORTS = 'reports/deleteAllClick';

const deleteClick = id => ({
	type: DELETE_REPORT,
	payload: id
});

const deleteAllClick = () => ({
	type: DELETE_ALL_REPORTS
});

const addReports = reports => ({
	type: 'reports/addReport',
	payload: reports
});

export const defaultState = {
	reports: []
};

const reducer = (state = defaultState, action = {}) => {
	switch (action.type) {
		case deleteClick().type:
			return Object.assign({}, state, {
				reports: state.reports.filter(report => report._id !== action.payload)
			});
		case deleteAllClick().type:
			state.reports = {};
			return state;
		case addReports().type:
			return Object.assign({}, state, {
				reports: state.reports.concat(action.payload)
			});
		default:
			return state;
	}
};

export { reducer, deleteClick, deleteAllClick, addReports };
