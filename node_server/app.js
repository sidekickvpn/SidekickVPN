const express = require('express');
const exec = require('child_process').exec;
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to DB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('Connected to DB'))
  .catch(err => console.log(err));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Passport middleware
app.use(passport.initialize());

// EJS View Engine (Will be removed once frontend implemented)
// app.set('view engine', 'ejs');
// app.use(expressLayouts);

// @route GET /
// @desc Home Route
// app.get('/', (req, res) => res.render('welcome'));

// @route GET /config
// @desc Get public key
// @access Private
app.get(
  '/api/config',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    const VPN_NAME = process.env.VPN_NAME || 'wgnet0';

    exec(`wg show ${VPN_NAME} public-key`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        res.status(500).json({ Error: err });
        return;
      }
      const public_key = stdout.slice(0, stdout.length - 1);
      res.status(200).json({
        public_key
      });
    });
  }
);

app.use('/api/clients', require('./routes/clients.js'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
