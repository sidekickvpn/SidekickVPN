import React from 'react';
import { defaultState } from '../reducers/authReducer';

const AuthStateContext = React.createContext(defaultState);

export default AuthStateContext;
