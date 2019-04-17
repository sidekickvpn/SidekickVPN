process.env.VPN_NAME = 'test';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const authenticateUser = require('./testUtils');
const User = require('../models/User');

const server = require('../app');

const authUser = {
	firstname: 'John',
	lastname: 'Doe',
	email: 'john@gmail.com',
	password: '123456',
	password2: '123456'
};

describe('GET /api/clients/all', () => {
	let testUser;

	beforeEach(done => {
		User.findOne({ email: authUser.email }).then(user => {
			testUser = user;
			authenticateUser(authUser, server).then(token => {
				testUser.token = token;
				done();
			});
		});
	});

	it('should get all devices for John user', done => {
		chai
			.request(server)
			.get('/api/clients/all')
			.set('Authorization', testUser.token)
			.end((err, res) => {
				should.not.exist(err);
				res.status.should.equal(200);
				res.body.should.not.be.null;
				done();
			});
	});
});
