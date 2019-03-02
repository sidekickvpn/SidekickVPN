// Add new report to database
async function addReport(report) {
  try {
    const { name, severity, message, publicKey } = report;
    const device = await Device.findOne({ publicKey }).populate('User');

    if (!device || !device.user) throw err;

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
