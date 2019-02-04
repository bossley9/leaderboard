


'use strict';



let assert = require('chai').assert;
let faker = require('faker');

let SequelizeM = require('sequelize-mock');
let sequelizeM = new SequelizeM();
let httpM = require('node-mocks-http');

let db, router;



// Generates a random boolean value.
function rnBool() {
  return Math.random() > 0.5;
}

// Given an array, returns a random element from that array
function rnIndex(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}



describe("route tests", () => {

  // Pre hook

  before( () => {
    db = {
      game: require('../models/game')(sequelizeM, SequelizeM),
      user: require('../models/user')(sequelizeM, SequelizeM),
      score: require('../models/score')(sequelizeM, SequelizeM),
    };
    for (let m in db) {
      if ("associate" in db[m]) db[m].associate(db);
    }
  });

  // Unit tests

  describe("/leaderboard/entries", () => {

    // Pre hook

    beforeEach( () => {
      router = require('../routes/leaderboards/entries/entries');
    });


    /*
    ** Routine test of route.
    */
    it("handles routine data", (done) => {

      // Setup
      let gameName = faker.name.title();
      let userName = faker.internet.userName();
      let scoreVal = faker.random.number();

      db.game.$queueResult([
        db.game.build({name:gameName})
      ]);
      db.score.$queueResult([ db.score.build({
        score: scoreVal,
        user: db.user.build({ name: userName }).dataValues
      }) ]);

      let req = httpM.createRequest({
        method: 'GET',
        url: '/leaderboards/entries',
        params: { game: "" }
      });
      let res = httpM.createResponse();

      // Call
      router.leaderboardEntries(db)(req, res, function(data) {

        // Evaluation
        assert.equal(data.currGame, gameName, "Instance of game.name is NOT used as the current game");
        assert.equal(data.data[0].user_name, userName, "Instance of score username NOT used in score data");
        assert.equal(data.data[0].score, scoreVal, "Instance of score value NOT used in score data");

        // Restore
        done();

      });

    });


    /*
    ** Boundary test with an arbitrary number of games.
    */
    it("handles an arbitrary amount of games", (done) => {

      // Setup
      let gameName;
      let userName = faker.internet.userName();
      let scoreVal = faker.random.number();

      let gArray = [];
      for (let i = 0; i < Math.random()*100; i++) {
        gameName = faker.name.title();
        gArray.push(db.game.build({ name: gameName }));
      }
      db.game.$queueResult(gArray);

      db.score.$queueResult([ db.score.build({
        score: scoreVal,
        user: db.user.build({ name: userName }).dataValues
      }) ]);

      let req = httpM.createRequest({
        method: 'GET',
        url: '/leaderboards/entries',
        params: { game: "" }
      });
      let res = httpM.createResponse();

      // Call
      router.leaderboardEntries(db)(req, res, function(data) {

        // Evaluation
        assert(data.gameList.includes(data.currGame), "Current game is NOT a valid game within the list of games");
        assert.equal(data.data[0].user_name, userName, "Instance of score username NOT used in score data");
        assert.equal(data.data[0].score, scoreVal, "Instance of score value NOT used in score data");

        // Restore
        done();

      });

    });


    /*
    ** Boundary test when a game parameter is specified and it is a valid
    ** existing game.
    */
    it("handles a game parameter that exists", (done) => {

      // Setup
      let gameName, rnGameName;
      let userName = faker.internet.userName();
      let scoreVal = faker.random.number();

      let gArray = [];
      for (let i = 0; i < Math.random()*100; i++) {
        gameName = faker.name.title();
        gArray.push(db.game.build({ name: gameName }));
      }
      rnGameName = rnIndex(gArray).name;
      db.game.$queueResult(gArray);

      db.score.$queueResult([ db.score.build({
        score: scoreVal,
        user: db.user.build({ name: userName }).dataValues
      }) ]);

      let req = httpM.createRequest({
        method: 'GET',
        url: '/leaderboards/entries',
        params: { game: rnGameName }
      });
      let res = httpM.createResponse();

      // Call
      router.leaderboardEntries(db)(req, res, function(data) {

        // Evaluation
        assert(data.gameList.includes(data.currGame), "Current game is NOT a valid game within the list of games");
        assert.equal(data.currGame, rnGameName, "Current game does NOT exist within the list of games");
        assert.equal(data.data[0].user_name, userName, "Instance of score username NOT used in score data");
        assert.equal(data.data[0].score, scoreVal, "Instance of score value NOT used in score data");

        // Restore
        done();

      });

    });


    /*
    ** Boundary test when a game parameter is specified and it is not a
    ** valid existing game.
    */
    it("handles a game parameter that does not exist", (done) => {

      // Setup
      let gameName;
      let userName = faker.internet.userName();
      let scoreVal = faker.random.number();

      let gArray = [];
      for (let i = 0; i < Math.random()*100; i++) {
        gameName = faker.name.title();
        gArray.push(db.game.build({ name: gameName }));
      }
      db.game.$queueResult(gArray);

      db.score.$queueResult([ db.score.build({
        score: scoreVal,
        user: db.user.build({ name: userName }).dataValues
      }) ]);

      let req = httpM.createRequest({
        method: 'GET',
        url: '/leaderboards/entries',
        params: { game: faker.internet.userName() }
      });
      let res = httpM.createResponse();

      // Call
      router.leaderboardEntries(db)(req, res, function(data) {

        // Evaluation
        assert(data.gameList.includes(data.currGame), "Current game is NOT a valid game within the list of games");
        assert.equal(data.gameList[0], data.currGame, "Current game is NOT the first game in the list");
        assert.equal(data.data[0].user_name, userName, "Instance of score username NOT used in score data");
        assert.equal(data.data[0].score, scoreVal, "Instance of score value NOT used in score data");

        // Restore
        done();

      });

    });


    // Post hook

    afterEach( () => {
      for (let m in db) db[m].$clearQueue();
    });

  });

});
