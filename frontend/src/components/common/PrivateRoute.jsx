import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthStateContext from '../../contexts/AuthStateContext';

const PrivateRoute = ({ component: RouteComponent, render, ...rest }) => {
	const auth = useContext(AuthStateContext);

	if (auth.isAuthenticated) {
		return <Route {...rest} component={RouteComponent} />;
	} else {
		return <Redirect to="/login" />;
	}
};

export default PrivateRoute;
