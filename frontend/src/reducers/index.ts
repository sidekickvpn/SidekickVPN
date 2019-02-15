import { combineReducers } from 'redux';
import auth, { AuthState } from './auth';
import error from './error';

export interface AppState {
  auth: AuthState;
  error: any;
}

export default combineReducers({
  auth,
  error
});
