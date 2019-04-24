import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Filter = props => {
	const [recordingPos, setRecordingPos] = useState(false);
	const [recordingNeg, setRecordingNeg] = useState(false);

	return (
		<div className="card">
			<div className="card-body">
				<h3 className="card-title">Filter Training</h3>
				<div className="btn-group">
					<button
						className={classnames('btn', {
							'btn-warning': recordingPos,
							'btn-success': !recordingPos
						})}
					>
						{recordingPos
							? 'Stop Recording Positive Traffic'
							: 'Record Positive Traffic'}
					</button>

					<button
						className={classnames('btn', {
							'btn-warning': recordingNeg,
							'btn-success': !recordingNeg
						})}
					>
						{recordingNeg
							? 'Stop Recording Negative Traffic'
							: 'Record Negative Traffic'}
					</button>
				</div>
			</div>
		</div>
	);
};

Filter.propTypes = {};

export default Filter;
