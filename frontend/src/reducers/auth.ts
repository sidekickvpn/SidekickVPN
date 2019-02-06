import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_USER,
  GET_USER,
  USER_LOADING
} from '../actions/types';

import { AuthActions } from '../actions/';
import { User } from 'firebase';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false
};

export default function(
  state: AuthState = initialState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case LOGIN_SUCCESS:
    case GET_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.user,
        isLoading: false
      };
    case LOGIN_FAIL:
    case LOGOUT_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    default:
      return state;
  }
}
