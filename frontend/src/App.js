import React, { useReducer, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import setAuthToken from './utils/setAuthToken';

import PrivateRoute from './components/common/PrivateRoute';
import ReportsContainer from './components/reports/ReportsContainer';
import DevicesContainer from './components/devices/DevicesContainer';
import Login from './components/Auth/Login';
import AuthContext from './contexts/AuthContext';
import AuthStateContext from './contexts/AuthStateContext';
import Navbar from './components/Navbar';
import Landing from './components/Landing';

import { LOGIN_USER, reducer, LOGOUT_USER } from './reducers/authReducer';
import AddDevice from './components/devices/AddDevice';
import { reportsSubscribe } from './utils/reportsSubscribe';
import Alert from './components/common/Alert';
import AlertContext from './contexts/AlertContext';
import ReportContext from './contexts/ReportContext';
import ReportStateContext from './contexts/ReportStateContext';
import {
	reducer as alertReducer,
	addAlert,
	defaultState
} from './reducers/alertReducer';
import { reducer as reportReducer, addReport } from './reducers/reportReducer';

const App = () => {
	const [auth, dispatch] = useReducer(reducer, reducer());
	const [alert, alertDispatch] = useReducer(alertReducer, defaultState);
	const [{ reports }, reportDispatch] = useReducer(
		reportReducer,
		reportReducer()
	);

	useEffect(() => {
		if (auth.isAuthenticated) {
			reportsSubscribe((err, report) => {
				const { _id, name, severity } = report;
				alertDispatch(
					addAlert({
						_id,
						name,
						severity
					})
				);
				reportDispatch(addReport(report));
			});
		}
	}, [auth.isAuthenticated]);

	useEffect(() => {
		// Check for token
		if (localStorage.jwtToken) {
			// Set Auth token header auth
			setAuthToken(localStorage.jwtToken);
			// Decode token and get user info and expiration
			const decoded = jwt_decode(localStorage.jwtToken);
			// Set user and isAuthenticated
			dispatch({
				type: LOGIN_USER,
				payload: decoded
			});

			// Check for expired token
			const currentTime = Date.now() / 1000;
			if (decoded.exp < currentTime) {
				// Logout user
				dispatch({
					type: LOGOUT_USER
				});
			}
		}
	}, []);

	const alerts = alert
		? alert.alerts.map(alert => (
				<Alert key={alert._id} name={alert.name} severity={alert.severity} />
		  ))
		: '';

	return (
		<AuthStateContext.Provider value={auth}>
			<AuthContext.Provider value={dispatch}>
				<AlertContext.Provider value={alertDispatch}>
					<Router>
						<>
							<Navbar alertCount={alert.count} />
							<div className="container mt-3">
								{alerts}
								<Switch>
									<Route exact path="/" component={Landing} />
									{/* <Route exact path="/register" component={Register} /> */}
									<Route exact path="/login" component={Login} />
									<PrivateRoute
										exact
										path="/devices/add"
										component={AddDevice}
									/>
									<PrivateRoute
										exact
										path="/devices"
										component={DevicesContainer}
									/>
									<ReportContext.Provider value={reportDispatch}>
										<ReportStateContext.Provider value={reports}>
											<PrivateRoute
												exact
												path="/reports"
												component={ReportsContainer}
											/>
										</ReportStateContext.Provider>
									</ReportContext.Provider>
								</Switch>
							</div>
						</>
					</Router>
				</AlertContext.Provider>
			</AuthContext.Provider>
		</AuthStateContext.Provider>
	);
};

export default App;
