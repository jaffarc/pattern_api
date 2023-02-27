/* eslint-disable no-undef */
// const { expect } = require('chai');
// const i18n = require("i18n");
const chai = require("chai");
const spies = require("chai-spies");
const expect = chai.expect;
chai.use(spies);
// const {expect, spy} = require('chai');

const {
  restrictTo,
} = require("../../../../src/api/middlewares/restricToMiddleware");

// describe('restrictTo', () => {
//   before(function(){
//     req = {},
//     res = { send: chai.spy()},
//     next = chai.spy();
// });

describe("Function - randomString", () => {
  let req = {},
    res = { send: chai.spy() },
    next = chai.spy();
  resJsonP = chai.spy();
  // (resJsonP = chai.spy()),

  // i18n.init(req, res);
  // beforeEach(()=>{
    req.__ = chai.spy()
  // })

  it("Success", (done) => {
    req["user"] = { role: "user" };
    // let array = []
    restrictTo(["user"])(req, res, next)
    // expect().to.called();
    //   expect(size).to.equal(5);
    expect(resJsonP).to.have.been.called(1);
    // expect(next).to.have.been.called(0);
    done();
  });

  // it("Eroor", (done) => {
  //   req["user"] = { errors: true };
  //   // let array = []
  //   restrictTo(["user"])(req, res, next);
  //   //  console.log('AAA', a)
  //   //expect()// .to.called.once();
  //   //   expect(size).to.equal(5);
  //   expect(resJsonP).to.has.called();
  //   // expect(next()).to.has.called();
  //   done();
  // });

  // it('Success body', (done) => {
  //   // let req = {};
  //   // delete req.user
  //   req['body'] = {role: 'user'};
  //   // let array = []
  // //  restrictTo("user")(req, res, next)
  //   //  console.log()
  //   // expect( restrictTo(['user'])(req, res, next)).to.called.once();
  //   //   expect(size).to.equal(5);
  //   // expect(next).to.has.called();
  //   done();
  // });

  //   it('error', (done) => {
  //     req['user'] ={errors:true}
  //     // let array = []ß
  //   ;
  //   //  console.log()
  //     expect( restrictTo(['user'])(req, res, next)).to.called.once();
  //   // expect(req.__).to.called.once();
  //   expect(next).toHaveBeenCalled();
  //   done();
  // });
});

// });
