/* eslint-disable no-undef */
const chai = require('chai');
let expect = chai.expect;

const { restrictTo }  = require('../../../../src/api/middlewares/restricToMiddleware')





describe('restrictTo', () => {
  let req = {},
  res = {};
  

  describe('Function - randomString', () => {
    it('Success', (done) => {
        let array = []
        restrictTo('user', 'admin')

    //   expect(size).to.equal(5);
      done();
    });
  });



  });




