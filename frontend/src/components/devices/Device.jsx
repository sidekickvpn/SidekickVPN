import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const Device = ({ device, onDeleteClick }) => {
	const { _id, name, vpnIp, publicKey } = device;

	const handleDelete = async () => {
		try {
			await axios.delete(`/api/clients/${_id}`);

			onDeleteClick(_id);
		} catch (err) {
			console.log('Error deleting device');
		}
	};

	return (
		<tr>
			<td>
				<span className="headline">{name}</span>
			</td>
			<td>{vpnIp}</td>
			<td>{publicKey}</td>
			<td>
				<button className="btn btn-danger" onClick={handleDelete}>
					<i className="fas fa-times" />
				</button>
			</td>
		</tr>
	);
};

Device.propTypes = {
	device: PropTypes.object.isRequired,
	onDeleteClick: PropTypes.func.isRequired
};

export default Device;
