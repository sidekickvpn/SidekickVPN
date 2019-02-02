import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_USER,
  GET_USER
} from '../actions/types';

import { AuthActions } from '../actions/';
import { User } from 'firebase';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false
};

export default function(
  state: AuthState = initialState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case GET_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.user
      };
    case LOGIN_FAIL:
    case LOGOUT_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
}
