import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { QRCode } from 'react-qr-svg';
import { Link } from 'react-router-dom';
import FormInputGroup from '../common/FormInputGroup';
import useFormInput from '../../effects/useFormInput';

const AddDevice = () => {
	const device = useFormInput('');
	const privateKey = useFormInput('');
	const publicKey = useFormInput('');
	const vpnIp = useFormInput('');
	const [errors, setErrors] = useState({});
	const [serverInfo, setServerInfo] = useState({
		vpnName: '',
		vpnIp: '',
		publicIp: '',
		publicKey: ''
	});
	const [config, setConfig] = useState('');
	const [copySuccess, setCopySuccess] = useState(false);
	const refConfig = useRef(null);

	useEffect(() => {
		axios
			.get('/api/config')
			.then(res => setServerInfo(res.data))
			.catch(err =>
				setErrors({ ...errors, serverInfo: 'Error getting server info' })
			);
	}, []);

	const onSubmit = async e => {
		e.preventDefault();

		const errors = {};
		if (device.value === '') {
			errors.devices = 'Device name is required';
		}
		if (privateKey.value === '') {
			errors.privateKey = 'Private key is required';
		}
		if (publicKey.value === '') {
			errors.publicKey = 'Public key is required';
		}
		if (vpnIp.value === '') {
			errors.vpnIp = 'VPN IP is required';
		}
		setErrors(errors);

		if (Object.entries(errors).length === 0 && errors.constructor === Object) {
			await genConfig();
			await axios.post('/api/clients', {
				name: device.value,
				publicKey: publicKey.value,
				vpnIp: vpnIp.value
			});
		}
	};

	// const downloadFile = () => {
	// 	const element = document.createElement('a');

	// 	element.setAttribute(
	// 		'href',
	// 		'data:text/plain;charset=utf-8,' + encodeURIComponent(config)
	// 	);
	// 	element.setAttribute('download', `${serverInfo.vpnName}.conf`);
	// 	element.style.display = 'none';
	// 	document.body.appendChild(element);
	// 	element.click();
	// 	document.body.removeChild(element);
	// };

	const copyToClipboard = e => {
		const node = config.current;

		if (node) {
			node.select();
			document.execCommand('copy');
			// this.setState({ copySuccess: 'Copied to Clipboard' });
			setCopySuccess('Copied to Clipboard');

			setTimeout(() => {
				setCopySuccess('');
			}, 2000);
		}
	};

	const genConfig = async () => {
		const config = `[Interface]
Address = ${vpnIp.value}
PrivateKey = ${privateKey.value}
DNS = ${serverInfo.vpnIp}

[Peer]
PublicKey = ${serverInfo.publicKey}
AllowedIPs = 0.0.0.0/0
Endpoint = ${serverInfo.publicIp}
PersistentKeepalive = 25
`;
		setConfig(config);
	};

	const configPreview =
		config.length > 0 ? (
			<div className="card">
				<div className="card-body">
					<h5 className="card-title">Preview</h5>

					<div className="d-flex mb-2">
						<QRCode
							bgColor="#FFFFFF"
							fgColor="#000000"
							level="Q"
							style={{ width: 256 }}
							value={config}
						/>
						<div>
							{document.queryCommandSupported('copy') && (
								<div>
									<button
										type="button"
										className="btn btn-light mb-1"
										onClick={copyToClipboard}
									>
										<i className="fas fa-clipboard inline-icon" />
										Copy
									</button>
									<span className="ml-1">{copySuccess}</span>
								</div>
							)}
							<textarea
								className="form-control"
								ref={refConfig}
								value={config}
								rows={5}
								cols={60}
								contentEditable={false}
								readOnly
							/>
							<a
								href={`data:text/plain;charset=utf-8,${encodeURIComponent(
									config
								)}`}
								download={`${serverInfo.vpnName}.conf`}
								className="btn btn-info mt-1"
							>
								<i className="fas fa-download inline-icon" />
								Download
							</a>
						</div>
					</div>
				</div>
			</div>
		) : (
			''
		);

	return (
		<>
			<Link to="/devices" className="btn btn-primary mb-2">
				Go Back
			</Link>
			<div className="card">
				<div className="card-body">
					<h3 className="card-title">Add Device</h3>
					{errors.serverInfo ? (
						<div className="alert alert-danger">{errors.serverInfo}</div>
					) : (
						''
					)}
					<form onSubmit={onSubmit}>
						<FormInputGroup
							name="device"
							label="Device Name"
							value={device.value}
							onChange={device.onChange}
							error={errors.devices}
						/>
						<FormInputGroup
							name="privateKey"
							label="Private Key"
							value={privateKey.value}
							onChange={privateKey.onChange}
							error={errors.privateKey}
							info={
								<span>
									<i className="fas fa-info mr-2" />
									Don't worry, this will never leave this page. It is only used
									to make the config file.
								</span>
							}
						/>
						<FormInputGroup
							name="publicKey"
							label="Public Key"
							value={publicKey.value}
							onChange={publicKey.onChange}
							error={errors.publicKey}
						/>
						<FormInputGroup
							name="vpnIp"
							label="VPN IP"
							value={vpnIp.value}
							onChange={vpnIp.onChange}
							error={errors.vpnIp}
						/>

						<button type="submit" className="btn btn-block btn-primary">
							Submit
						</button>
						{configPreview}
						<Link to="/devices" className="btn btn-success btn-block mt-2">
							Done
						</Link>
					</form>
				</div>
			</div>
		</>
	);
};

export default AddDevice;
