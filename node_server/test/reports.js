process.env.VPN_NAME = 'test';

const chai = require('chai');
const mongoose = require('mongoose');
const expect = chai.expect();

const Report = require('../models/Report');
const addReport = require('../utils/addReport');

// DB Config
const db = require('../config/keys').MONGO_URI;

// Connect to DB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('Connected to DB'))
  .catch(err => console.log(err));

describe('Reports', () => {
  it('should add report to database', async done => {
    const newReport = {
      name: 'test-device',
      severity: 'high',
      message: 'test report message',
      publicKey: 'some-public-key'
    };
    const report = await addReport(newReport);

    expect(report).to.not.equal(null);
    done();
  });
});
