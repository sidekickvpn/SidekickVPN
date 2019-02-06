import { AuthActions, GetUserAction, LogoutAction } from './index';

import { auth } from '../firebase';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { User } from 'firebase';
import { Dispatch } from 'react';
import { AuthState } from '../reducers/auth';

// LOGIN
export const login = (
  email: string,
  password: string
): ThunkAction<Promise<void>, AuthState, {}, AuthActions> => async (
  dispatch: ThunkDispatch<AuthState, {}, AuthActions>
): Promise<void> => {
  try {
    dispatch({ type: 'USER_LOADING' });
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );

    if (userCredential.user) {
      await dispatch({
        type: 'LOGIN_SUCCESS',
        user: userCredential.user
      });
    } else {
      dispatch({
        type: 'LOGIN_FAIL'
      });
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: 'LOGIN_FAIL'
    });
  }
};

// LOGOUT
export const logout = (): ThunkAction<
  Promise<void>,
  AuthState,
  {},
  LogoutAction
> => async (
  dispatch: ThunkDispatch<AuthState, {}, LogoutAction>
): Promise<void> => {
  await auth.signOut();
  dispatch({
    type: 'LOGOUT_USER'
  });
};

// GET USER
export const getUser = (user: User | null): any => (
  dispatch: Dispatch<GetUserAction>
): void => {
  if (user) {
    dispatch({
      type: 'GET_USER',
      user
    });
  }
};
