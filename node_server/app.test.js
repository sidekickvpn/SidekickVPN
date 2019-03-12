import { describe } from 'riteway';
import mongoose from 'mongoose';

process.env.VPN_NAME = 'test';

// DB Config
const db = require('../config/test-keys').MONGO_URI;

// Connect to DB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('Connected to DB'))
  .catch(err => console.log(err));

describe('Main App Routes', async assert => {
  assert({
    given: 'home route'
  });
});
