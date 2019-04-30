import React, { useEffect, useState, useContext, useRef } from 'react';
import classnames from 'classnames';
import SocketContext from '../../contexts/SocketContext';

const Filter = () => {
	const [results, setResults] = useState('');
	const [recordingPos, setRecordingPos] = useState(false);
	const [recordingNeg, setRecordingNeg] = useState(false);
	const socket = useContext(SocketContext);

	useEffect(() => {
		socket.on('training_results', data => {
			setResults(data);
		});
	}, []);

	const handleRecordPos = () => {
		if (recordingNeg) return;
		if (!recordingPos) {
			// Emit record start
			socket.emit('client_record_pos', 'start');
		} else {
			// Emit record stop
			socket.emit('client_record_pos', 'stop');
		}
		setRecordingPos(!recordingPos);
	};

	const handleRecordNeg = () => {
		if (recordingPos) return;
		if (!recordingNeg) {
			// Emit record start
			socket.emit('client_record_neg', 'start');
		} else {
			// Emit record stop
			socket.emit('client_record_neg', 'stop');
		}
		setRecordingNeg(!recordingNeg);
	};

	return (
		<div className="card">
			<div className="card-body">
				<h3 className="card-title">Filter Training</h3>
				<div className="btn-group">
					<button
						className={classnames('btn', {
							'btn-danger': recordingPos,
							'btn-success': !recordingPos
						})}
						onClick={handleRecordPos}
						disabled={recordingNeg}
					>
						{recordingPos ? (
							<>
								<span>Stop Recording Positive Traffic</span>
								<i className="fas fa-stop ml-1" />
							</>
						) : (
							<>
								<span>Record Positive Traffic</span>
								<i className="fas fa-circle ml-1" />
							</>
						)}
					</button>

					<button
						className={classnames('btn', {
							'btn-danger': recordingNeg,
							'btn-success': !recordingNeg
						})}
						onClick={handleRecordNeg}
						disabled={recordingPos}
					>
						{recordingNeg ? (
							<>
								<span>Stop Recording Negative Traffic</span>
								<i className="fas fa-stop ml-1" />
							</>
						) : (
							<>
								<span>Record Negative Traffic</span>
								<i className="fas fa-circle ml-1" />
							</>
						)}
					</button>
				</div>
				<div className="row">
					<textarea
						className="col-12 mt-2"
						rows={10}
						value={results}
						readOnly
					/>
				</div>
			</div>
		</div>
	);
};

export default Filter;
