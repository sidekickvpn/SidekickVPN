process.env.VPN_NAME = 'test';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const mongoose = require('mongoose');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../app');

// DB Config
const db = require('../config/test-keys').MONGO_URI;

// Connect to DB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('Connected to DB'))
  .catch(err => console.log(err));

const user = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'john@gmail.com',
  password: '123456',
  password2: '123456'
};

describe('POST /api/users/register', () => {
  it('should register new user', done => {
    chai
      .request(server)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(201);
        console.log(res.body);
        res.body.should.have.property('firstname').equal(user.firstname);
        res.body.should.have.property('__v').equal(0);
        done();
      });
  });
});
