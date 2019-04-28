const express = require('express');
const exec = require('child_process').exec;
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const mung = require('express-mung');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Passport Config
require('./config/passport')(passport);

// SocketIO Config
require('./config/socketJwt')(io);

// DB Config
const db = require('./config/keys').MONGO_URI;

// Connect to DB
if (process.env.NODE_ENV !== 'test') {
	mongoose
		.connect(db, { useNewUrlParser: true })
		.then(() => console.log('Connected to DB'))
		.catch(err => console.log(err));

	// Setup SocketIO
	io.of('sidekick').on('connection', client => {
		client.on('subscribeToReports', () => {
			console.log('client is subscribing to reports');
		});

		client.on('client_record_pos', mode => {
			console.log('record pos from client, sending to python');
			io.of('sidekick').emit('record_pos', mode);
		});

		client.on('client_record_neg', mode => {
			console.log('record neg from client, sending to python');
			io.of('sidekick').emit('record_neg', mode);
		});

		client.on('newPythonReport', report => {
			io.of('sidekick').emit('newReport', report);
		});
	});
}

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Passport middleware
app.use(passport.initialize());

// Anti-sidechannel middleware
// Adds random data to all responses
function pad_response(json, req, res) {
	const min = 16;
	const max = 32;
	const size = Math.round(Math.random() * (max - min) + min);
	let padding = '';
	for (let i = 0; i < size; i++) {
		padding += Math.round(Math.random() * 16).toString(16);
	}
	json.padding = padding;
}
app.use(mung.json(pad_response));

// Socket IO middleware
app.use((req, res, next) => {
	req.io = io;
	next();
});

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

		const publicIp = `${process.env.PUBLIC_IP}:${VPN_PORT}`;
		const vpnIp = process.env.VPN_IP;

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
	}
	//   );
	// }
);

app.use('/api/devices', require('./routes/devices.js'));
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
http.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = { io };
