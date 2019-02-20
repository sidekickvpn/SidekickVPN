import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  User,
  SetCurrentUserAction
} from './types';
import { Dispatch, Action } from 'redux';

export interface UserRegister {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

// Register User
export const registerUser = (userData: UserRegister, history: any) => (
  dispatch: Dispatch
) => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = (userData: UserLogin) => (dispatch: Dispatch) => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      // Save token to local storage
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);

      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded: User = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = (decoded: User | null): SetCurrentUserAction => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = (): any => (
  dispatch: Dispatch<SetCurrentUserAction>
): void => {
  localStorage.removeItem('jwtToken');
  setAuthToken('');
  dispatch(setCurrentUser(null));
};
