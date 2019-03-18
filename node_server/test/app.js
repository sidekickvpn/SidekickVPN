process.env.VPN_NAME = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../app');

// describe('GET /', () => {
//   it('should get home test route', done => {
//     chai
//       .request(server)
//       .get('/')
//       .end((err, res) => {
//         should.not.exist(err);
//         res.status.should.equal(200);
//         res.body.should.equal(
//           JSON.stringify({ welcome: 'welcome to the api' })
//         );
//         done();
//       });
//   });
// });
