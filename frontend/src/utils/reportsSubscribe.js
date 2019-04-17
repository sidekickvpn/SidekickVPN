import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000', {
	query: `auth_token=${localStorage.jwtToken.slice(7)}`
});

// {
// 	extraHeaders: {
// 		'x-auth-token': localStorage.jwtToken ? localStorage.jwtToken.slice(7) : ''
// 	},
// 	transportOptions: {
// 		polling: {
// 			extraHeaders: {
// 				'x-auth-token': localStorage.jwtToken
// 					? localStorage.jwtToken.slice(7)
// 					: ''
// 			}
// 		}
// 	}
// }

const reportsSubscribe = cb => {
	socket.on('reports', reports => cb(null, reports));
	socket.emit('subscribeToReports');
};

export { reportsSubscribe };
