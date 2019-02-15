import isEmpty from '../validation/is-empty';

import { SET_CURRENT_USER } from '../actions/types';
import { AuthActions, User } from '../actions';

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
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
}
