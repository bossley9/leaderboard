


var assert = require('chai').assert;
var faker = require('faker');

var SequelizeM = require('sequelize-mock');
var sequelizeM = new SequelizeM();


describe("model tests", () => {

  before(() => {

    const db = {
      game: require('../models/game')(sequelizeM, SequelizeM),
      user: require('../models/user')(sequelizeM, SequelizeM),
      score: require('../models/score')(sequelizeM, SequelizeM),
    };

    // look more deeply into node-mocks-http for route tests
    router = require('../routes/leaderboards/entries/entries')(db);
  });

  describe("game", () => {

    it("works", (done) => {
      /*
      game.create({name: faker.internet.userName()})
      .then((game) => {

      });
      */

      //console.log(router.stack);

      done();
    });


  });

});
