import React from 'react';
import { defaultState } from '../reducers/alertReducer';

const AlertContext = React.createContext({
	dispatch: () => defaultState
});

export default AlertContext;
