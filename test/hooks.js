const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies)
module.exports = () => {

  before(async () => {
    console.log('before');
  });

  // beforeEach(async () => {});

  // afterEach(async () => {
  //   console.log('afterEach');
  // });

  // after(done => {
  //   return done();
  // });
};
