


'use strict';



let assert = require('chai').assert;
let faker = require('faker');

let SequelizeM = require('sequelize-mock');
let sequelizeM = new SequelizeM();
let httpM = require('node-mocks-http');

let db, router;



describe("/leaderboards/api/deleteGame", () => {

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
  ** Routine test when deleting a game from the game list
  */
  it("soft deletes a game that exists in the game list", (done) => {

    // Setup
    let gameName = faker.internet.userName();

    db.game.$queueResult([
      db.game.build({ name: faker.internet.userName() }),
      db.game.build({ name: faker.internet.userName() }),
      db.game.build({ name: gameName }),
    ]);

    let req = httpM.createRequest({
      method: 'DELETE',
      url: '/leaderboards/api/deleteGame',
      body: { game: gameName },
    });
    let res = httpM.createResponse();

    // Call
    router.deleteGame(db)(req, res, (data) => {

      // Evaluation
      assert(data, "Does NOT return a true value");

      // Restore
      done();

    });

  });

  // Post hook

  afterEach( () => {
    for (let m in db) db[m].$clearQueue();
  });

});
