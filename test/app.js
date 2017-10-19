const chai = require('chai');
const chaiHTTP = require('chai-http');
const should = chai.should();

const env = process.env.NODE_ENV;
const path = require('path');
const folder = (env == 'dev' ? '../dist/' : '../src/');

process.env.NODE_ENV = 'test';
const app = require(path.join(__dirname,folder,'app'));



chai.use(chaiHTTP);
describe('##App ' + (env=='dev' ? '(development)' : '(production)'), () => {
  describe('No args:', () => {
    it('should send a 200 response', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          if(err) throw err;
          res.should.have.status(200);
          done();
        });

    });

  });

  describe('Index:', () =>{
     it('index=16 should send a 200 response', (done) => {
       chai.request(app)
         .get('/')
         .query({index: 16})
         .end((err, res) => {
           should.exist(res);
           res.should.have.status(200);
           done();
         });
     });
   });

});
