process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../app');
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

    describe('Index:', () =>{
      it('index=0 should send a 200 response', (done) => {
        chai.request('app')
          .get('/')
          .query({index: 0})
          .end((err, res) => {
            should.exist(res);
            res.should.have.status(200);
            done();
          });
      });
    });

  });
});
