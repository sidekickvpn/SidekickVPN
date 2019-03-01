process.env.VPN_NAME = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../app');

describe('GET /client/add', () => {
  it('should get the add client form', done => {
    chai
      .request(server)
      .get('/client/add')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('text/html');
        res.text.should.contain('Add Client');
        done();
      });
  });
});
