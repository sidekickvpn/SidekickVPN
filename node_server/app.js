const express = require('express');
const exec = require('child_process').exec;
const mongoose = require('mongoose');
const passport = require('passport');
const amqp = require('amqplib/callback_api');
const addReport = require('./utils/addReport');
const path = require('path');

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MONGO_URI;

// Connect to DB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('Connected to DB'))
  .catch(err => console.log(err));

// Connect to RabbitMQ
amqp.connect(
  process.env.RABBITMQ_HOST || 'amqp://localhost',
  (err, connection) => {
    if (err) {
      console.log(err);
    }
    console.log('Connected to RabbitMQ channel');
    connection.createChannel((err, channel) => {
      const queue = process.env.QUEUE_NAME || 'reports';

      channel.assertQueue(queue, { durable: false, autoDelete: true });
      channel.consume(
        queue,
        async msg => {
          // TODO: Validation
          await addReport(JSON.parse(msg.content.toString()));
        },
        { noAck: true }
      );
    });
  }
);

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
    const VPN_PORT = process.env.VPN_PORT || '51820';

    //ip addr | awk '/inet/ { print $2 }'
    exec('hostname -I', (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        res.status(500).json({ Error: 'Could not get server ip' });
        return;
      }
      const ips = stdout.split('\n');

      const publicIp =
        `${process.env.PUBLIC_IP}:${VPN_PORT}` || `${ips[0]}:${VPN_PORT}`;
      const vpnIp = process.env.VPN_IP || ips[ips.length - 2];
      // const publicIp = `${ips[2].slice(0, ips[2].length - 3)}:${VPN_PORT}`;
      // const vpnIp = ips[1].slice(0, ips[1].length - 3);

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
app.use('/api/reports', require('./routes/reports'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('./public'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
