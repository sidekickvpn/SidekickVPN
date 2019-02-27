const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Report } = require('../models/Report');

// @route GET /reports
// @desc Get all reports for current user
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  async (req, res) => {
    try {
      const reports = await Report.find({ user: req.user._id });
      if (reports.length > 0) {
        res.status(200).json({ reports });
      } else {
        res.status(404).json({ NotFound: 'No reports found' });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ Error: 'Error getting reports' });
    }
  }
);

// @route POST /reports
// @desc Add a report to the database
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  async (req, res) => {
    const { name, severity, message } = req.body;

    const newReport = new Report({
      name,
      severity,
      message,
      user: req.user._id
    });

    try {
      const report = await newReport.save();

      res.status(201).json(report);
    } catch (e) {
      console.log(e);
      res.status(500).json({ Error: 'Error when trying to add report' });
    }
  }
);

module.exports = router;
