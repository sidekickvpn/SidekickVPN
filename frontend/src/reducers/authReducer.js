import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import { USER_LOGIN_ROUTE } from '../utils/routes';

const LOGIN_USER = 'auth/loginUser';
const LOGOUT_USER = 'auth/logoutUser';
const GET_USER = 'auth/getUser';

const loginUser = async (dispatch, userData) => {
	try {
		const res = await axios.post(USER_LOGIN_ROUTE, userData);
		// Save token to local storage
		const { token } = res.data;
		localStorage.setItem('jwtToken', token);

		// Set token to Auth header
		setAuthToken(token);
		// Decode token to get user data
		const decoded = jwt_decode(token);
		dispatch({
			type: LOGIN_USER,
			payload: decoded
		});
	} catch (err) {
		return err.response.data;
	}
};

const logoutUser = dispatch => {
	// Log user out
	localStorage.removeItem('jwtToken');
	setAuthToken('');
	dispatch({ type: LOGOUT_USER });
};

const defaultState = {
	isAuthenticated: false,
	user: null
};

const reducer = (state = defaultState, action = {}) => {
	const { type, payload } = action;
	switch (type) {
		case LOGIN_USER:
			return {
				isAuthenticated: true,
				user: payload
			};
		case LOGOUT_USER:
			return {
				isAuthenticated: false,
				user: null
			};
		case GET_USER:
		default:
			return state;
	}
};

export {
	LOGIN_USER,
	LOGOUT_USER,
	GET_USER,
	loginUser,
	logoutUser,
	defaultState,
	reducer
};
