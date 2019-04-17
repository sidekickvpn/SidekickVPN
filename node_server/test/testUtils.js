const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

module.exports = authenticateUser = (user, app) =>
	new Promise((resolve, reject) => {
		chai
			.request(app)
			.post('/api/users/login')
			.send({
				email: user.email,
				password: user.password
			})
			.end((err, res) => {
				if (err) {
					return reject(err);
				}
				return resolve(res.body.token);
			});
	});
