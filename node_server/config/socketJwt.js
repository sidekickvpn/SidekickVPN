const jwtAuth = require('socketio-jwt-auth');
const keys = require('./keys');
const User = require('../models/User');

module.exports = socket => {
	socket.use(
		jwtAuth.authenticate(
			{
				secret: keys.MONGO_SECRET,
				algorithm: 'HS256'
			},
			(payload, done) => {
				User.findOne({ _id: payload.id })
					.then(user => {
						if (!user) {
							// return fail with an error message
							return done(null, false, 'user does not exist');
						}
						// return success with a user info
						return done(null, user);
					})
					.catch(err => {
						console.log(err);
						return done(err);
					});
			}
		)
	);
};
