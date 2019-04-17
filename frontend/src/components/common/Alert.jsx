import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import getBadgeType from '../../utils/getBadgeType';
import { dismissAlert } from '../../reducers/alertReducer';
import AlertContext from '../../contexts/AlertContext';

const Alert = ({ name, severity }) => {
	const dispatch = useContext(AlertContext);

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
				className="close"
				data-dismiss="alert"
				aria-label="Close"
				onClick={() => dispatch(dismissAlert({ name, severity }))}
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
