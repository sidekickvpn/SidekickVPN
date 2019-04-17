import { describe } from 'riteway';
import {
	reducer,
	deleteClick,
	addReports,
	defaultState,
	deleteAllClick
} from '../src/reducers/reportReducer';

describe('Reports Reducer', async assert => {
	assert({
		given: 'no arguments',
		should: 'return the valid initial state',
		actual: reducer(),
		expected: defaultState
	});

	const reports = [
		{
			_id: '1',
			name: 'SSH Login',
			severity: 'high',
			message: 'SSH login detected, password length of 15',
			date: new Date('03-08-2019').toISOString()
		},
		{
			_id: '2',
			name: 'Some low severity event',
			severity: 'low',
			message: 'Something happened',
			date: new Date('03-08-2019').toISOString()
		},
		{
			_id: '3',
			name: 'Hidden keystrokes',
			severity: 'med',
			message: 'Hidden keystrokes detected',
			date: new Date('03-08-2019').toISOString()
		}
	];

	assert({
		given: 'an initial state and a delete click',
		should: 'delete the report from state',
		actual: reducer({ reports }, deleteClick('2')),
		expected: {
			reports: [
				{
					_id: '1',
					name: 'SSH Login',
					severity: 'high',
					message: 'SSH login detected, password length of 15',
					date: new Date('03-08-2019').toISOString()
				},
				{
					_id: '3',
					name: 'Hidden keystrokes',
					severity: 'med',
					message: 'Hidden keystrokes detected',
					date: new Date('03-08-2019').toISOString()
				}
			]
		}
	});

	const report = {
		_id: '4',
		name: 'New Report',
		severity: 'high',
		message: 'New report added',
		date: new Date('03-08-2019').toISOString()
	};

	assert({
		given: 'a new report to add',
		should: 'add the report to state',
		actual: reducer({ reports }, addReports(report)),
		expected: { reports: reports.concat(report) }
	});

	assert({
		given: 'a delete all click',
		should: 'delete all the reports',
		actual: reducer({ reports }, deleteAllClick()),
		expected: { reports: [] }
	});
});
