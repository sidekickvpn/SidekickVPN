process.env.VPN_NAME = 'test';

const chai = require('chai');
const mongoose = require('mongoose');
const expect = chai.expect;

const Report = require('../models/Report');
const addReport = require('../utils/addReport');

// DB Config
const db = require('../config/test-keys').MONGO_URI;

// Connect to DB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('Connected to DB'))
  .catch(err => console.log(err));

// describe('Reports', () => {
//   it('should add report to database', done => {
//     const newReport = {
//       name: 'test-device',
//       severity: 'high',
//       message: 'test report message',
//       publicKey: 'some-public-key'
//     };
//     addReport(newReport).then(report => {
//       expect(report).to.be.not.undefined;
//       done();
//     });
//   });
// });
