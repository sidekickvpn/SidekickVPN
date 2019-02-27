const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = { Report, ReportSchema };
