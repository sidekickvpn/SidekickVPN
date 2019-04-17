import React from 'react';
import PropTypes from 'prop-types';
import getBadgeType from '../../utils/getBadgeType';

const Report = ({ report, onDeleteClick }) => {
	return (
		<li className="list-group-item">
			<div className="d-flex justify-content-between">
				<div className="d-flex">
					<h5 className="headline">{report.name}</h5>
					<h5 className="text-muted ml-2">
						{new Date(report.date).toLocaleString()}
					</h5>
				</div>

				<button
					type="button"
					className="btn btn-danger"
					onClick={() => onDeleteClick(report._id)}
				>
					<i className="fas fa-times" />
				</button>
			</div>
			<span className={`badge badge-${getBadgeType(report.severity)}`}>
				{report.severity}
			</span>
			<p>{report.message}</p>
		</li>
	);
};

Report.propTypes = {
	report: PropTypes.object.isRequired,
	onDeleteClick: PropTypes.func.isRequired
};

export default Report;
