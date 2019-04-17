import React, { useReducer, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import setAuthToken from './utils/setAuthToken';

import PrivateRoute from './components/common/PrivateRoute';
import ReportsContainer from './components/reports/ReportsContainer';
import DevicesContainer from './components/devices/DevicesContainer';
import Login from './components/Auth/Login';
import AuthContext from './contexts/AuthContext';
import AuthStateContext from './contexts/AuthStateContext';
import Register from './components/Auth/Register';
import Navbar from './components/Navbar';
import Landing from './components/Landing';

import { LOGIN_USER, reducer, LOGOUT_USER } from './reducers/authReducer';
import AddDevice from './components/devices/AddDevice';
import { reportsSubscribe } from './utils/reportsSubscribe';
import Alert from './components/common/Alert';
import AlertContext from './contexts/AlertContext';

const App = () => {
	const [auth, dispatch] = useReducer(reducer, reducer());
	const [alert, setAlert] = useState({
		name: '',
		severity: '',
		count: 0
	});

	useEffect(() => {
		reportsSubscribe((err, report) => {
			setAlert({
				name: report.name,
				severity: report.severity,
				count: alert.count + 1
			});
		});
	}, []);

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

	return (
		<AuthStateContext.Provider value={auth}>
			<AuthContext.Provider value={dispatch}>
				<AlertContext.Provider value={alert}>
					<Router>
						<>
							<Navbar />
							<div className="container mt-3">
								<Alert name="Report One" severity="HIGH" />
								<Switch>
									<Route exact path="/" component={Landing} />
									<Route exact path="/register" component={Register} />
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
									<PrivateRoute
										exact
										path="/reports"
										component={ReportsContainer}
									/>
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
