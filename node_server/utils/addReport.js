const Device = require('../models/Device');
const Report = require('../models/Report');

// Add new report to database
async function addReport(report) {
  const { name, severity, message, publicKey } = report;
  try {
    const device = await Device.findOne({ publicKey }).populate('User');

    if (!device || !device.user) throw new Error('No such device');

    const newReport = new Report({
      name,
      severity,
      message,
      device: device._id,
      user: device.user._id
    });

    const report = await newReport.save();

    console.log(`Report Added: ${report}`);
    return report;
  } catch (e) {
    console.log(e);
  }
}

module.exports = addReport;
