


'use strict';



let assert = require('chai').assert;
let faker = require('faker');

let SequelizeM = require('sequelize-mock');
let sequelizeM = new SequelizeM();
let httpM = require('node-mocks-http');

let db, router;



describe("/leaderboards/api/createGame", () => {

  // Pre hooks

  before( () => {
    db = {
      game: require('../models/game')(sequelizeM, SequelizeM),
      user: require('../models/user')(sequelizeM, SequelizeM),
      score: require('../models/score')(sequelizeM, SequelizeM),
    };
    for (let m in db) {
      if ("associate" in db[m]) db[m].associate(db);
    }
    db.game.options.autoQueryFallback = false;
  });

  beforeEach( () => {
    router = require('../routes/leaderboards/api/games');
  });

  // Unit tests

  /*
  ** Routine test when game parameter does not exist in game list
  */
  it("creates a game when game parameter does not exist in game list", (done) => {

    // Setup
    let gameName = faker.internet.userName();

    db.game.$queueResult([
      db.game.build({ name: faker.internet.userName() })
    ]);

    let req = httpM.createRequest({
      method: 'POST',
      url: '/leaderboards/api/createGame',
      body: { game: gameName },
    });
    let res = httpM.createResponse();

    // Call
    router.createGame(db)(req, res, (data) => {

      // Evaluation
      assert.equal(data.game, gameName, "Instance of game parameter is NOT used as the current game");

      // Restore
      done();

    });

  });

  /*
  ** Boundary test when game parameter exists in game list
  */
  it("returns a game when game parameter exists in game list", (done) => {

    // Setup
    let gameName = faker.internet.userName();
    let userName = faker.internet.userName();
    let scoreVal = faker.random.number();

    db.game.$queueResult([
      db.game.build({ name: gameName })
    ]);

    let req = httpM.createRequest({
      method: 'POST',
      url: '/leaderboards/api/createGame',
      body: { game: gameName },
    });
    let res = httpM.createResponse();

    // Call
    router.createGame(db)(req, res, (data) => {

      // Evaluation
      assert.equal(data.game, gameName, "Instance of game parameter is NOT used as the current game");

      // Restore
      done();

    });

  });

  /*
  ** Boundary test when game parameter exists in game list and delete_stamp is non-null
  */
  it("undeletes a game when deleted game exists in game list", (done) => {

    // Setup
    let gameName = faker.internet.userName();
    let userName = faker.internet.userName();
    let scoreVal = faker.random.number();

    db.game.$queueResult([
      db.game.build({ name: gameName, delete_stamp: Date.now() })
    ]);

    let req = httpM.createRequest({
      method: 'POST',
      url: '/leaderboards/api/createGame',
      body: { game: gameName },
    });
    let res = httpM.createResponse();

    // Call
    router.createGame(db)(req, res, (data) => {

      // Evaluation
      assert.equal(data.game, gameName, "Instance of game parameter is NOT used as the current game");

      // Restore
      done();

    });

  });

  // Post hook

  afterEach( () => {
    for (let m in db) db[m].$clearQueue();
  });

});
