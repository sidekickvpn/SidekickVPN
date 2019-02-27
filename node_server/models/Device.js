const mongoose = require('mongoose');

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

const Device = mongoose.model('Device', DeviceSchema);

module.exports = { Device, DeviceSchema };
