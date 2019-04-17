import React from 'react';
import PropTypes from 'prop-types';
import getBadgeType from '../../utils/getBadgeType';

const Alert = ({ name, severity }) => {
	return (
		<div
			className="alert alert-secondary alert-dismissible fade show mx-auto"
			role="alert"
		>
			<h5 className="headline">New Report: {name}</h5>
			Severity:{' '}
			<span className={`badge badge-${getBadgeType(severity)}`}>
				{severity}
			</span>
			<button
				type="button"
				class="close"
				data-dismiss="alert"
				aria-label="Close"
			>
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
	);
};

Alert.propTypes = {
	name: PropTypes.string.isRequired,
	severity: PropTypes.string.isRequired
};

export default Alert;
