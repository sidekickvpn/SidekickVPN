const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  public_key: {
    type: String,
    required: true
  },
  vpn_ip: {
    type: String,
    required: true
  }
});

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device;
