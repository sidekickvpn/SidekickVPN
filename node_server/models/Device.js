const mongoose = require('mongoose');
const Report = require('./Report');

const DeviceSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	publicKey: {
		type: String,
		required: true
	},
	vpnIp: {
		type: String,
		required: true
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}
});

// On Device deletion, delete all reports associated with the device
DeviceSchema.pre('remove', function(next) {
	Report.remove({ device: this._id }).exec();
	next();
});

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device;
