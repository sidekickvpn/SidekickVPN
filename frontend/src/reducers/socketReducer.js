const SET_SOCKET = 'socket/add';

const defaultState = {
	socker: null
};

const reducer = (state = defaultState, action = {}) => {
	const { type, payload } = action;
	switch (type) {
		case SET_SOCKET:
			return {
				socket: payload
			};
		default:
			return state;
	}
};

export { SET_SOCKET, reducer };
