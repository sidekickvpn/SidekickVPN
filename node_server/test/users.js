process.env.VPN_NAME = 'test';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const User = require('../models/User');
const authenticateUser = require('./testUtils');

const server = require('../app');

const authUser = {
	firstname: 'John',
	lastname: 'Doe',
	email: 'john@gmail.com',
	password: '123456',
	password2: '123456'
};

const tempUser = {
	firstname: 'Bob',
	lastname: 'Tester',
	email: 'bob@gmail.com',
	password: '654321',
	password2: '654321'
};

describe('POST /api/users/register', () => {
	it('should register Bob user', done => {
		chai
			.request(server)
			.post('/api/users/register')
			.send(tempUser)
			.end((err, res) => {
				should.not.exist(err);
				res.status.should.equal(201);
				res.body.should.have.property('firstname').equal(tempUser.firstname);
				res.body.should.have.property('__v').equal(0);

				done();
			});
	});
});

describe('POST /api/users/login', () => {
	it('should login with John user', done => {
		chai
			.request(server)
			.post('/api/users/login')
			.send({ email: authUser.email, password: authUser.password })
			.end((err, res) => {
				should.not.exist(err);
				res.status.should.equal(200);
				res.body.should.have.property('success').equal(true);
				res.body.should.have.property('token').not.null;

				done();
			});
	});
});

describe('DELETE /api/users', () => {
	let testUser;

	beforeEach(done => {
		User.findOne({ email: tempUser.email }).then(user => {
			testUser = user;
			authenticateUser(tempUser, server).then(token => {
				testUser.token = token;
				done();
			});
		});
	});

	it('should delete Bob user', done => {
		chai
			.request(server)
			.delete('/api/users')
			.set('Authorization', testUser.token)
			.end((err, res) => {
				should.not.exist(err);
				res.status.should.equal(200);
				res.body.should.have.property('removed');
				done();
			});
	});
});
