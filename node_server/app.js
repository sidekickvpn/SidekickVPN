const express = require('express');
const exec = require('child_process').exec;
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
    exec(`hostname -I`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        res.status(500).json({ Error: 'Could not get server ip' });
        return;
      }
      const ips = stdout.split(' ');

      const publicIp = ips[0];
      const vpnIp = ips[ips.length - 2];

      exec(`wg show ${VPN_NAME} public-key`, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          res.status(500).json({ Error: 'Could not get server public key' });
          return;
        }
        const publicKey = stdout.slice(0, stdout.length - 1);
        res.status(200).json({
          publicIp,
          vpnIp,
          vpnName: VPN_NAME,
          publicKey
        });
      });
    });
  }
);

app.use('/api/clients', require('./routes/clients.js'));
app.use('/api/users', require('./routes/users'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('../frontend/build'));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '..', 'frontend', 'build', 'index.html')
    );
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
