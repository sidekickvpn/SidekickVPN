import { describe } from 'riteway';
import {
	defaultState,
	reducer,
	ADD_ALERT,
	DISMISS_ALERT,
	GET_COUNT
} from '../src/reducers/alertReducer';

describe('Alert Reducer', async assert => {
	assert({
		given: 'no arguments',
		should: 'return the initial state',
		actual: reducer(),
		expected: defaultState
	});

	{
		const alert = {
			name: 'Alert One',
			severity: 'HIGH'
		};

		assert({
			given: 'an alert',
			should: 'return alert added',
			actual: reducer(defaultState, {
				type: ADD_ALERT,
				payload: alert
			}),
			expected: {
				alerts: [alert],
				count: 1
			}
		});
	}

	{
		const alerts = [
			{
				name: 'Alert One',
				severity: 'HIGH'
			},
			{
				name: 'Alert Two',
				severity: 'LOW'
			}
		];

		const alert = {
			name: 'Alert Three',
			severity: 'MED'
		};

		assert({
			given: 'inital alerts and a getCount action',
			should: 'return the number of alerts',
			actual: reducer(
				{
					alerts,
					count: 2
				},
				{
					type: GET_COUNT
				}
			).count,
			expected: 2
		});

		assert({
			given: 'an alert',
			should: 'return alert added to existing alerts',
			actual: reducer(
				{
					alerts,
					count: 2
				},
				{
					type: ADD_ALERT,
					payload: alert
				}
			),
			expected: {
				alerts: [...alerts, alert],
				count: 3
			}
		});
	}

	{
		const alerts = [
			{
				name: 'Alert One',
				severity: 'HIGH'
			},
			{
				name: 'Alert Two',
				severity: 'LOW'
			}
		];

		assert({
			given: 'a dismiss click on alert[0]',
			should: 'return with alert[0] removed and updated count',
			actual: reducer(
				{
					alerts,
					count: 2
				},
				{
					type: DISMISS_ALERT,
					payload: alerts[0]
				}
			),
			expected: {
				alerts: [alerts[1]],
				count: 1
			}
		});
	}
});
