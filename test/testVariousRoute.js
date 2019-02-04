


'use strict';



let assert = require('chai').assert;
let faker = require('faker');

let SequelizeM = require('sequelize-mock');
let sequelizeM = new SequelizeM();
let httpM = require('node-mocks-http');

let db, router;

// separate unit tests into multiple various files
// https://medium.com/spatialdev/mocha-unit-testing-pattern-test-suite-setup-code-for-file-separated-test-e339a550dbf6


module.exports = function(a) {

  describe("testroute", function() {
    it("testsVariousRoute", function(done) {
      assert.equal(a, 7, "not equal");
      done();
    })
  })

}
