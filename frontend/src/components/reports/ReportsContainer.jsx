import React, { useContext, useEffect } from 'react';
import {
	deleteClick,
	deleteAllClick,
	addReport
} from '../../reducers/reportReducer';
import Report from './Report';
import axios from 'axios';
import ReportContext from '../../contexts/ReportContext';
import ReportStateContext from '../../contexts/ReportStateContext';
import {
	REPORT_DELETE_ALL_ROUTE,
	REPORT_DELETE_BASEROUTE,
	REPORT_GET_ALL_ROUTE
} from '../../utils/routes';

const ReportsContainer = () => {
	const reports = useContext(ReportStateContext);
	const dispatch = useContext(ReportContext);

	useEffect(() => {
		axios
			.get(REPORT_GET_ALL_ROUTE)
			.then(res => {
				const ids = reports.map(report => report._id);
				res.data.reports.forEach(report => {
					if (!ids.includes(report._id)) {
						dispatch(addReport(report));
					}
				});
			})
			.catch(err => console.log(err));
	}, []);

	const onDeleteAllClick = async () => {
		try {
			await axios.delete(REPORT_DELETE_ALL_ROUTE);

			dispatch(deleteAllClick());
		} catch (err) {
			console.log(err);
		}
	};

	const onDeleteClick = async id => {
		try {
			await axios.delete(`${REPORT_DELETE_BASEROUTE}${id}`);

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
