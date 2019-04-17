import React from 'react';
import { defaultState } from '../reducers/reportReducer';

const ReportContext = React.createContext(() => defaultState);

export default ReportContext;
