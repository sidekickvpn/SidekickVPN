const exec = require('child_process').exec;
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const { Device } = require('../models/Device');

// @route GET /client/
// @desc Get peer info for peer with public_key passed in req.body
router.get(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    const VPN_NAME = process.env.VPN_NAME || 'wgnet0';
    const { publicKey } = req.body;
    exec(`wg show ${VPN_NAME} dump`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        res.status(500).json({ Error: err });
        return;
      }
      const peers = stdout.split('\n').map(peer => peer.split('\t'));

      const peer = peers.find(peer => peer[0] === publicKey);
      if (peer) {
        res.status(200).json({
          publicKey: peer[0],
          endpoints: peer[2] === '(none)' ? null : peer[2],
          allowedIps: peer[3],
          latestHandshake: peer[4] === '0' ? null : peer[4],
          received: parseInt(peer[5]),
          sent: parseInt(peer[6]),
          persistentKeepalive: peer[7]
        });
      } else {
        res.status(404).json({ Error: 'Invalid Public Key' });
      }
    });
  }
);

// @route GET /client/devices
// @desc Get all devices for current client
// @access Private
router.get(
  '/all',
  passport.authenticate('jwt', {
    session: false
  }),
  async (req, res) => {
    const { _id } = req.user;
    try {
      const user = await User.findOne({ _id });
      res.status(200).json({ devices: user.devices });
    } catch (e) {
      console.log(e);
      res.status(500).json({ Error: 'Could not get devices' });
    }
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
    const { name, publicKey, vpnIp } = req.body;
    const VPN_NAME = process.env.VPN_NAME || 'wgnet0';

    const newDevice = new Device({
      name,
      publicKey,
      vpnIp
    });

    try {
      const { _id } = req.user;

      // Push new device to array of devices for current user
      await User.findOneAndUpdate(
        { _id },
        {
          $push: { devices: newDevice }
        }
      );

      // Add device to VPN server as a new peer
      console.log(`VPNIP ${vpnIp.slice(0, vpnIp.length - 3)}/32`);
      await exec(
        `wg set ${VPN_NAME} peer ${publicKey} allowed-ips ${vpnIp.slice(
          0,
          vpnIp.length - 3
        )}/32`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            res.status(500).json({ Error: err });
            return;
          }
          console.log(`Peer ${publicKey} added`);
          res.status(200).json({ Success: 'Device added', publicKey });
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
  '/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  async (req, res) => {
    const { id } = req.params;
    const VPN_NAME = process.env.VPN_NAME || 'wgnet0';

    const { _id } = req.user;
    console.log(id);
    try {
      // Ensure device belonds to user (ie. only delete if user owns the device)
      const user = await User.findOne({
        _id,
        'devices._id': id
      });

      if (user) {
        const device = user.devices.id(id);
        const { publicKey } = device;

        // Delete device
        device.remove();
        await user.save();
        exec(
          `wg set ${VPN_NAME} peer ${publicKey} remove`,
          (err, stdout, stderr) => {
            if (err) {
              console.error(err);
              res.status(500).json({ Error: err });
              return;
            }
            console.log(`Peer ${publicKey} removed`);
            res.status(200).json({ 'Device removed': publicKey });
          }
        );
      } else {
        res.status(404).json({
          NotFound: 'No such device for given user'
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
);

module.exports = router;
