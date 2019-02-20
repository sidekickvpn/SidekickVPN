import { Action } from 'redux';

export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export const GET_ERRORS = 'GET_ERRORS';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export interface User {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface SetCurrentUserAction extends Action {
  type: 'SET_CURRENT_USER';
  payload: User | null;
}

export interface LogoutUserAction extends Action {
  type: 'LOGOUT_USER';
}

export type AuthActions = SetCurrentUserAction;
