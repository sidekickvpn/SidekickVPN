import { Action } from 'redux';
import { User } from 'firebase';

export interface UserLoadingAction extends Action {
  type: 'USER_LOADING';
}

export interface LoginSuccessAction extends Action {
  type: 'LOGIN_SUCCESS';
  user: User;
}

export interface LoginFailureAction extends Action {
  type: 'LOGIN_FAIL';
}

export interface LogoutAction extends Action {
  type: 'LOGOUT_USER';
}

export interface GetUserAction extends Action {
  type: 'GET_USER';
  user: User;
}

export type AuthActions =
  | UserLoadingAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction
  | GetUserAction;
