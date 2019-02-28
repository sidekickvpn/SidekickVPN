const express = require('express');
const router = express.Router();
const passport = require('passport');
const Report = require('../models/Report');

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
      const reports = await Report.find({}).populate({
        path: 'User',
        match: { _id: { $eq: req.user.id } }
      });
      res.status(200).json({ reports });
    } catch (e) {
      console.log(e);
      res.status(500).json({ Error: 'Error getting reports' });
    }
  }
);

// // Add new report to database
// async function addReport(report) {
//   const newReport = new Report(report);

//   try {
//     const report = await newReport.save();

//     res.status(201).json(report);
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ Error: 'Error when trying to add report' });
//   }
// }

// // @route POST /reports
// // @desc Add a report to the database
// // @access Private
// router.post(
//   '/',
//   passport.authenticate('jwt', {
//     session: false
//   }),
//   async (req, res) => {
//     const { name, severity, message, public_key } = req.body;
//     const newReport = {
//       name,
//       severity,
//       message
//     }
//   }
// );

module.exports = router;
