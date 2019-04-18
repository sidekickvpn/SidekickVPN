import openSocket from 'socket.io-client';

const reportsSubscribe = cb => {
	const socket = openSocket('', {
		query: `auth_token=${localStorage.jwtToken.slice(7)}`
	});
	socket.on('newReport', reports => cb(null, reports));
	socket.emit('subscribeToReports');
};

export { reportsSubscribe };
