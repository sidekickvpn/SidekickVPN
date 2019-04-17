import { describe } from 'riteway';
import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import render from 'riteway/render-component';
import AddDevice from '../src/components/devices/AddDevice';

describe('Add Device Component', async assert => {
	const createAddDeviceComponent = () =>
		render(
			<Router>
				<AddDevice />
			</Router>
		);

	{
		const AddDeviceComponent = createAddDeviceComponent();

		assert({
			given: 'the component',
			should: 'render the component',
			actual: AddDeviceComponent('label')
				.map((i, ele) =>
					AddDeviceComponent(ele)
						.html()
						.trim()
						.toLowerCase()
				)
				.get(),
			expected: ['device name', 'private key', 'public key', 'vpn ip']
		});
	}

	{
		const AddDeviceComponent = createAddDeviceComponent();

		const device = {
			device: 'Some Device',
			privateKey: 'Some privatekey',
			publicKey: 'Some publickey',
			vpnIp: 'Some vpn ip'
		};
		AddDeviceComponent('input#device').val(device.device);
		AddDeviceComponent('input#privateKey').val(device.privateKey);
		AddDeviceComponent('input#publicKey').val(device.publicKey);
		AddDeviceComponent('input#vpnIp').val(device.vpnIp);

		assert({
			given: 'a device',
			should: 'have device name in field',
			actual: AddDeviceComponent('input#device').val(),
			expected: device.device
		});

		assert({
			given: 'a device',
			should: 'have private key in field',
			actual: AddDeviceComponent('input#privateKey').val(),
			expected: device.privateKey
		});

		assert({
			given: 'a device',
			should: 'have public key in field',
			actual: AddDeviceComponent('input#publicKey').val(),
			expected: device.publicKey
		});

		assert({
			given: 'a device',
			should: 'have vpn ip in field',
			actual: AddDeviceComponent('input#vpnIp').val(),
			expected: device.vpnIp
		});
	}
});
