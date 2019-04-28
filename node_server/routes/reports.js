const express = require('express');
const router = express.Router();
const passport = require('passport');
const Report = require('../models/Report');
const Device = require('../models/Device');

// @route GET /api/reports
// @desc Get all reports for current user
// @access Private
router.get(
	'/',
	passport.authenticate('jwt', {
		session: false
	}),
	(req, res) => {
		Report.find({ user: req.user._id }, null, {
			sort: {
				date: -1
			}
		})
			.populate('device')
			.exec((err, reports) => {
				if (err) {
					console.log(err);
					res.status(500).json({ Error: 'Error getting reports' });
				} else {
					res.status(200).json({ reports });
				}
			});
	}
);

// @route DELETE /api/reports/all
// @desc Delete all reports for current user
// @access Private
router.delete(
	'/all',
	passport.authenticate('jwt', {
		session: false
	}),
	async (req, res) => {
		try {
			await Report.deleteMany({ user: req.user._id });
			res.status(200).json({ success: 'Successfully deleted all reports' });
		} catch (e) {
			console.log(e);
			res.status(500).json({ Error: 'Error deleting all reports' });
		}
	}
);

// @route DELETE /api/reports/:id
// @desc Delete given report of current user
// @access Private
router.delete(
	'/:id',
	passport.authenticate('jwt', {
		session: false
	}),
	async (req, res) => {
		try {
			await Report.deleteOne({ _id: req.params.id, user: req.user._id });
			res.status(200).json({ success: 'Successfully deleted report' });
		} catch (e) {
			console.log(e);
			res.status(500).json({ Error: `Error deleting report ${req.params.id}` });
		}
	}
);

// @route POST /reports
// @desc Add a report to the database
// @access Private
// router.post(
// 	'/',
// 	passport.authenticate('jwt', {
// 		session: false
// 	}),
// 	async (req, res) => {
// 		const { name, severity, message, publicKey } = req.body;
// 		try {
// 			const device = await Device.findOne({ publicKey });
// 			if (!device || !device.user) {
// 				res.status(404).json({
// 					'Not Found': `No device with public key ${publicKey} found for current user`
// 				});
// 				return;
// 			}
// 			const newReport = new Report({
// 				name,
// 				severity,
// 				message,
// 				device: device._id,
// 				user: device.user._id
// 			});

// 			const report = await Report.create(newReport);
// 			req.io.emit('reports', report);
// 			res.status(201).json({ report });
// 		} catch (err) {
// 			console.log(err);
// 			res.status(500).json({ Error: 'Error adding report' });
// 		}
// 	}
// );

module.exports = router;
