const exec = require('child_process').exec;
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const Device = require('../models/Device');

// @route GET /api/devices
// @desc Get all devices for current client
// @access Private
router.get(
	'/',
	passport.authenticate('jwt', {
		session: false
	}),
	async (req, res) => {
		const { _id } = req.user;
		try {
			// const user = await User.findOne({ _id });
			await User.findOne({ _id })
				.populate('devices')
				.exec((err, user) => {
					if (err) throw err;
					res.status(200).json({ devices: user.devices });
				});
		} catch (e) {
			console.log(e);
			res.status(500).json({ Error: 'Could not get devices' });
		}
	}
);

// @route POST /api/devices
// @desc Add device entry to DB and add peer to server
// @access Private
router.post(
	'/',
	passport.authenticate('jwt', {
		session: false
	}),
	async (req, res) => {
		const { name, publicKey, vpnIp } = req.body;
		const VPN_NAME = process.env.VPN_NAME || 'wgnet0';

		try {
			const { _id } = req.user;

			// Ensure vpnIP is not being used already
			const device = await Device.findOne({ vpnIp });

			if (!device) {
				const newDevice = new Device({
					name,
					publicKey,
					vpnIp,
					user: _id
				});

				const device = await newDevice.save();

				// Update user with device reference
				await User.findOne({ _id })
					.populate('devices')
					.exec((err, user) => {
						user.devices.push(device);
						user.save();
					});

				// Add device to VPN server as a new peer
				await exec(
					`wg set ${VPN_NAME} peer ${publicKey} allowed-ips ${vpnIp}/32`,
					(err, stdout, stderr) => {
						if (err) {
							console.error(err);
							res.status(500).json({ Error: err });
							return;
						}
						console.log(`Peer ${publicKey} added`);
						res.status(200).json({ Success: 'Device added', publicKey });
					}
				);
			}
		} catch (e) {
			console.log(e);
		}
	}
);

// @route DELETE /api/devices
// @desc Remove peer from server
// @access Private
router.delete(
	'/:id',
	passport.authenticate('jwt', {
		session: false
	}),
	async (req, res) => {
		try {
			const device = await Device.findOneAndRemove({
				_id: req.params.id,
				user: req.user._id
			});

			User.update(
				{ _id: req.user._id },
				{ $pull: { devices: [req.params.id] } }
			);

			const { publicKey } = device;

			// Add device to VPN server as a new peer
			await exec(
				`wg set ${process.env.VPN_NAME} peer ${publicKey} remove`,
				(err, stdout, stderr) => {
					if (err) {
						console.error(err);
						res.status(500).json({ Error: err });
						return;
					}
					console.log(`Peer ${publicKey} removed`);
					res.status(200).json({ Success: 'Device removed', publicKey });
				}
			);
		} catch (e) {
			console.log(e);
			res.status(500).json({ Error: 'Error deleting device' });
		}
	}
);

module.exports = router;
