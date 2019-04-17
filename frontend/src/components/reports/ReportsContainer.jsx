import React, { useReducer, useEffect } from 'react';
import {
	reducer,
	deleteClick,
	deleteAllClick,
	addReports
} from '../../reducers/reportReducer';
import Report from './Report';
import axios from 'axios';

const ReportsContainer = () => {
	const [{ reports }, dispatch] = useReducer(reducer, reducer());

	useEffect(() => {
		axios
			.get('/api/reports')
			.then(res => dispatch(addReports(res.data.reports)))
			.catch(err => console.log(err));
	}, []);

	const onDeleteAllClick = async () => {
		try {
			await axios.delete('/api/reports/all');

			dispatch(deleteAllClick());
		} catch (err) {
			console.log(err);
		}
	};

	const onDeleteClick = async id => {
		try {
			await axios.delete(`/api/reports/${id}`);

			dispatch(deleteClick(id));
		} catch (err) {
			console.log(err);
		}
	};

	const reportItems =
		reports.length > 0 ? (
			<ul className="list-group">
				{reports.map(report => (
					<Report
						key={report._id}
						report={report}
						onDeleteClick={_id => onDeleteClick(_id)}
					/>
				))}
			</ul>
		) : (
			<h3>No Reports</h3>
		);

	return (
		<div className="card">
			<div className="card-body">
				<div className="d-flex justify-content-between mb-2">
					<h3 className="card-title">
						<i className="fas fa-flag inline-icon" />
						Reports
					</h3>
					<button className="btn btn-outline-danger" onClick={onDeleteAllClick}>
						Clear All
					</button>
				</div>

				{reportItems}
			</div>
		</div>
	);
};

export default ReportsContainer;
