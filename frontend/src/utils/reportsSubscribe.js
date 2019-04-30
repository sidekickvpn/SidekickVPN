const reportsSubscribe = (socket, cb) => {
	socket.on('newReport', reports => cb(null, reports));
	socket.emit('subscribeToReports');
};

export { reportsSubscribe };
