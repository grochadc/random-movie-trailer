process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../src/app');
const should = chai.should();

chai.use(chaiHTTP);
describe('##App', () => {
  describe('No args:', () => {
    it('should send a 200 response', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
