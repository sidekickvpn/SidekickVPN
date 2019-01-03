const express = require('express');
const exec = require('child_process').exec;
const bodyParser = require('body-parser');

const app = express();

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// EJS View Engine (Will be removed once frontend implemented)
app.set('view engine', 'ejs');

// Home Route
app.get('/', (req, res) => res.send('Welcome'));

// Add client form
app.get('/client/add', (req, res) => res.render('add'));

// Get public key
app.get('/config', (req, res) => {
  const VPN_NAME = process.env.VPN_NAME || 'wgnet0';
  exec(`wg show ${VPN_NAME} public-key`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      res.status(500).json({ Error: err });
      return;
    }
    const public_key = stdout.slice(0, stdout.length - 1);
    res.status(200).json({ public_key });
  });
});

// Get peer info
app.get('/client/:public_key', (req, res) => {
  const VPN_NAME = process.env.VPN_NAME || 'wgnet0';
  const { public_key } = req.params;
  exec(`wg show ${VPN_NAME} dump`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      res.status(500).json({ Error: err });
      return;
    }
    const peers = stdout.split('\n').map(peer => peer.split('\t'));
    peers.pop();

    const peer = peers.find(peer => peer[0] === public_key);
    if (peer) {
      // res.status(200).json({ 'public_key': peer[0], 'vpn_ip': peer[1]});
      res.status(200).json({
        public_key: peer[0],
        endpoints: peer[2] === '(none)' ? null : peer[2],
        allowed_ips: peer[3],
        latest_handshake: peer[4] === '0' ? null : peer[4],
        received: parseInt(peer[5]),
        sent: parseInt(peer[6]),
        persistent_keepalive: peer[7]
      });
    } else {
      res.status(404).json({ Error: 'Invalid Public Key' });
    }
  });
});

// Add peer to server
app.post('/client', (req, res) => {
  const { public_key, vpn_ip } = req.body;
  const VPN_NAME = process.env.VPN_NAME || 'wgnet0';
  exec(
    `wg set ${VPN_NAME} peer ${public_key} allowed-ips ${vpn_ip}`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        res.status(500).json({ Error: err });
        return;
      }
      console.log(`Peer ${public_key} added`);
      res.status(200).json({ 'Peer added': { public_key, vpn_ip } });
    }
  );
});

// Remove peer from server
app.delete('/client', (req, res) => {
  const { public_key } = req.body;
  const VPN_NAME = process.env.VPN_NAME || 'wgnet0';
  exec(
    `wg set ${VPN_NAME} peer ${public_key} remove`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        res.status(500).json({ Error: err });
        return;
      }
      console.log(`Peer ${public_key} removed`);
      res.status(200).json({ 'Peer removed': public_key });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
