const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(
	process.env.MONGO_URI || 'mongodb://localhost:27017/sidekickvpn',
	{
		useNewUrlParser: true
	}
);

const User = require('./models/User');

const addUser = userData => {
	const { firstname, lastname, email, password } = userData;
	User.findOne({ email }).then(user => {
		if (user) {
			console.info('User already exists!');
			mongoose.connection.close();
		} else {
			const newUser = new User({
				firstname,
				lastname,
				email,
				password
			});

			// Hash Password
			bcrypt.genSalt(10, (err, salt) =>
				bcrypt.hash(password, salt, (err, hash) => {
					if (err) throw err;

					// Set password to hashed
					newUser.password = hash;

					// Save user
					newUser
						.save()
						.then(user => {
							console.info(user);
							mongoose.connection.close();
						})
						.catch(err => console.log(err));
				})
			);
		}
	});
};

const deleteUser = email => {
	User.findOneAndRemove({ email }).then(user => {
		console.info(`User ${user} deleted`);
	});
};

module.exports = { addUser, deleteUser };
