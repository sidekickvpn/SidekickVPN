const deleteClick = id => ({
	type: 'devices/deleteClick',
	payload: id
});

const addDevice = device => ({
	type: 'devices/addDevice',
	payload: device
});

const defaultState = {
	devices: []
};

const reducer = (state = defaultState, action = {}) => {
	const { type, payload } = action;
	switch (type) {
		case deleteClick().type:
			return Object.assign({}, state, {
				devices: state.devices.filter(device => device._id !== payload)
			});
		case addDevice().type:
			return Object.assign({}, state, {
				devices: state.devices.concat(payload)
			});
		default:
			return state;
	}
};

export { deleteClick, addDevice, defaultState, reducer };
