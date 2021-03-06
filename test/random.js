const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

const path = require('path');
const folder = (process.env.NODE_ENV == 'prod' ? '../dist/' : '../src/') ;
const random = require(path.join(__dirname, folder ,'lib/random'));

describe('Random lib: ', ()=>{

  var arr = [0,1,2,3,4,6,7,8,9,10];

  describe('min = 0, max = 10, arr = ['+arr.toString()+']', () => {
    it('should return 5', ()=> {
      random.exclude(0,10,arr,false).should.equal(5);
    });
    it('should be a number', () => {
      random.exclude(0,10).should.be.a('number');
    });
  });

  describe('min = 0, max = 10, arr = []', ()=>{
    it('should return a number', () => {
      random.exclude(0,10,[]).should.be.a('number');
    });
  });

  describe('min = 0, max = 10, logging = true', ()=> {
    it('should return a number and logs', () => {
      random.exclude(1,10,true).should.be.a('number');
    });
  });

  describe('min = 0, max = 10, arr = \'abc\')', () => {
    it('should throw and error', ()=> {
      expect(random.exclude.bind(random,0,10,'abc')).to.throw();
    });
  });

  describe('min = 0, max = 10, arr = [-1]', () =>{
    it('should throw a positive number', ()=>{
      assert.isAtLeast(random.exclude(0,10,[-1]),0);
    });
  });

  describe('min = 0, max = 10, arr = undefined', () =>{
    it('should throw any number', ()=>{
      random.exclude(0,10,[undefined]).should.be.a('number');
    });
  });

  describe('min = 0, max = 10, arr = null', () =>{
    it('should throw any number', ()=>{
      random.exclude(0,10,[null]).should.be.a('number');
    });
  });

  describe('min = 0, max = null, arr = '+arr, () =>{
    it('should throw any number', ()=>{
      random.exclude(0,null,[arr]).should.be.a('number');
    });
  });
  describe('min = 0, max = undefined, arr = '+arr, () =>{
    it('should throw any number', ()=>{
      random.exclude(0,undefined,[arr]).should.be.a('number');
    });
  });
});
