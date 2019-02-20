import isEmpty from '../validation/is-empty';

import { SET_CURRENT_USER, AuthActions, User } from '../actions/types';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null
};

export default function(state = initialState, action: AuthActions) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: action.payload !== null,
        user: action.payload
      };
    default:
      return state;
  }
}
