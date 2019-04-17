import openSocket from 'socket.io-client';
const socket = openSocket('', {
	query: `auth_token=${localStorage.jwtToken.slice(7)}`
});

const reportsSubscribe = cb => {
	socket.on('newReport', reports => cb(null, reports));
	socket.emit('subscribeToReports');
};

export { reportsSubscribe };
