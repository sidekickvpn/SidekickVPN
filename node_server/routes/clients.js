const express = require('express');
const router = express.Router();
const passport = require('passport');
const Device = require('../models/Device');

// @route GET /client/:public_key
// @param public_key - public key for the client
// @desc Get peer info
router.get(
  '/:public_key',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    const VPN_NAME = process.env.VPN_NAME || 'wgnet0';
    const { public_key } = req.params;
    exec(`wg show ${VPN_NAME} dump`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        res.status(500).json({ Error: err });
        return;
      }
      const peers = stdout.split('\n').map(peer => peer.split('\t'));

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
  }
);

// @route POST /client
// @desc Add device entry to DB and add peer to server
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  async (req, res) => {
    const { name, public_key, vpn_ip } = req.body;
    const VPN_NAME = process.env.VPN_NAME || 'wgnet0';

    const newDevice = new Device({
      name,
      public_key,
      vpn_ip
    });

    const { id } = req.user;
    const user = await User.findById(id);

    try {
      const device = await newDevice.save();
      exec(
        `wg set ${VPN_NAME} peer ${public_key} allowed-ips ${vpn_ip}`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            res.status(500).json({ Error: err });
            return;
          }
          console.log(`Peer ${public_key} added`);
          res.status(200).json(device);
        }
      );
    } catch (e) {
      console.log(e);
    }
  }
);

// @route DELETE /client
// @desc Remove peer from server
// @access Private
router.delete(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    // TODO: Ensure req.user owns this peer
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
  }
);

module.exports = router;
