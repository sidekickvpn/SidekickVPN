import { describe } from 'riteway';
import {
	defaultState,
	reducer,
	LOGIN_USER,
	LOGOUT_USER
} from '../src/reducers/authReducer';

describe('Auth Reducer', async assert => {
	assert({
		given: 'no arguments',
		should: 'return the initial state',
		actual: reducer(),
		expected: defaultState
	});

	{
		const user = {
			id: 'some-id',
			email: 'john@gmail.com',
			firstname: 'john',
			lastname: 'doe'
		};

		assert({
			given: 'a login with user',
			should: 'return with user authenticated',
			actual: reducer(
				{},
				{
					type: LOGIN_USER,
					payload: user
				}
			),
			expected: {
				isAuthenticated: true,
				user
			}
		});
	}

	{
		const user = {
			id: 'some-id',
			email: 'bob@gmail.com',
			firstname: 'bob'
		};

		assert({
			given: 'a login with a different user',
			should: 'return with user authenticated',
			actual: reducer(
				{},
				{
					type: LOGIN_USER,
					payload: user
				}
			),
			expected: {
				isAuthenticated: true,
				user
			}
		});
	}

	{
		const user = {
			id: 'some-id',
			email: 'john@gmail.com',
			firstname: 'john',
			lastname: 'doe'
		};

		assert({
			given: 'an authenticated user and a logout action',
			should: 'return with user logged out',
			actual: reducer(
				{ user },
				{
					type: LOGOUT_USER
				}
			),
			expected: {
				isAuthenticated: false,
				user: null
			}
		});
	}
});
