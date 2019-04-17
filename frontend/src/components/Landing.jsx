import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import AuthStateContext from '../contexts/AuthStateContext';

const Landing = () => {
	const auth = useContext(AuthStateContext);

	if (auth.isAuthenticated) {
		return <Redirect to="/devices" />;
	} else {
		return <Redirect to="/login" />;
	}
};

export default Landing;
