import React, { useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reducer, deleteClick, addDevice } from '../../reducers/deviceReducer';
import Device from './Device';
import axios from 'axios';

const DevicesContainer = () => {
	const [{ devices }, dispatch] = useReducer(reducer, reducer());

	useEffect(() => {
		axios
			.get('/api/clients/all')
			.then(res => dispatch(addDevice(res.data.devices)))
			.catch(err => console.log(err));
	}, []);

	const deviceEntries =
		devices.length > 0 ? (
			<table className="table table-striped table-responsive-md mt-3">
				<thead>
					<tr>
						<th>Name</th>
						<th>VPN IP</th>
						<th>Public Key</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{devices.map(device => (
						<Device
							key={device._id}
							device={device}
							onDeleteClick={_id => dispatch(deleteClick(_id))}
						/>
					))}
				</tbody>
			</table>
		) : (
			<h3>No Devices</h3>
		);

	return (
		<div className="card">
			<div className="card-body">
				<div className="d-flex justify-content-between">
					<h3 className="card-title">
						<i className="fas fa-desktop inline-icon" />
						Devices
					</h3>
					<Link className="btn btn-success" to="/devices/add">
						<i className="fas fa-plus inline-icon" />
						Add Device
					</Link>
				</div>

				{deviceEntries}
			</div>
		</div>
	);
};

export default DevicesContainer;
