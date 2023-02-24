/* eslint-disable no-undef */
// const { expect } = require('chai');
const chai = require('chai');
const spies = require('chai-spies');
const expect = chai.expect; 
chai.use(spies)
// const {expect, spy} = require('chai');


const { restrictTo }  = require('../../../../src/api/middlewares/restricToMiddleware')





describe('restrictTo', () => {
  before(function(){
    req = {}, 
    res = { send: chai.spy()}, 
    next = chai.spy();
});
  

  describe('Function - randomString', () => {
    req = {user :{role: 'user'}};
    it('Success', (done) => {
        let array = []
      ;
      //  console.log()
        expect( restrictTo(['user'])(req, res, next)).to.called.once(); 
    //   expect(size).to.equal(5);
      done();
    });
  });



  });




