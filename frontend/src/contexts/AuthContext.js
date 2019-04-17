import React from 'react';
import { defaultState } from '../reducers/authReducer';

const AuthContext = React.createContext({
	dispatch: () => defaultState
});

export default AuthContext;
