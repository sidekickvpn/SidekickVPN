const defaultState = {
	name: '',
	severity: '',
	count: 0
};

const reducer = (state = defaultState, action = {}) => {
	const { type, payload } = action;
	switch (type) {
		default:
			return state;
	}
};

export { defaultState, reducer };
