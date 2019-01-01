const express = require('express');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;

const app = express();

// Home Route
app.get('/', (req, res) => res.send('Welcome'));

// Add peer to server
app.get('/config/:conf_file/peer/add/:public_key/:vpn_ip', (req, res) => {
  const { conf_file, public_key, vpn_ip } = req.params;

  const peer = `\n[Peer]\nPublicKey = ${public_key}\nAllowedIPs = ${vpn_ip}`;

  exec(`grep ${public_key} ${conf_file}.conf`, (err, stdout, stderr) => {
    if (err && err.code !== 1) {
      console.error(err);
      res.status(500).json({ Error: err });
      return;
    }
    if (stdout === '') {
      exec(`echo "${peer}" >> ${conf_file}.conf`, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          res.status(500).json({ Error: err });
          return;
        }
      });
      res.status(200).json({ 'Peer added': { public_key, vpn_ip } });
    } else {
      res.status(400).json({
        'Peer exists': `A peer with the public key ${public_key} already exists`
      });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
