import { Action } from 'redux';
import { SetStateAction } from 'react';

export interface User {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface SetCurrentUserAction {
  type: 'SET_CURRENT_USER';
  payload: User | null;
}

export type AuthActions = SetCurrentUserAction;
