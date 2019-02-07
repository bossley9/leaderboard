


'use strict';



let assert = require('chai').assert;
let faker = require('faker');

let SequelizeM = require('sequelize-mock');
let sequelizeM = new SequelizeM();
let httpM = require('node-mocks-http');

let db, router;



describe("/leaderboards/api/deleteUserScore", () => {

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
  });

  beforeEach( () => {
    router = require('../routes/leaderboards/api/scores');
  });

  // Unit tests

  /*
  ** Routine test for setting the delete_stamp of a score
  */
  it("soft deletes scores properly", (done) => {

    // Setup
    let scoreVal = faker.random.number();

    db.score.$queueResult([ db.score.build({
      score: scoreVal,
      user: db.user.build({ name: faker.internet.userName() }).dataValues,
      game: db.game.build({name: faker.name.title() }).dataValues,
    }) ]);

    let req = httpM.createRequest({
      method: 'DELETE',
      url: '/leaderboards/api/deleteUserScore',
      body: { score: scoreVal }
    });
    let res = httpM.createResponse();

    // Call
    router.deleteUserScore(db)(req, res, (data) => {

      // Evaluation
      assert.equal(data.score, scoreVal, "Inserted score is NOT equal to parameter score");

      // Restore
      done();
      
    });

  });

  /*
  ** Routine test when user has no active scores and needs to be deleted
  */
  it("soft deletes users if needed", (done) => {

    // Setup
    db.score.options.autoQueryFallback = false;

    let scoreVal = faker.random.number();
    let users = [ faker.internet.userName() ];

    db.user.$queueResult([
      db.user.build({ name: users[0] })
    ]);

    db.user.getScores = () => { return [] };

    db.score.$queueResult([ db.score.build({
      score: scoreVal,
      game: db.game.build({name: faker.name.title() }).dataValues,
    }) ]);
    db.score.$queueResult([]);

    let req = httpM.createRequest({
      method: 'DELETE',
      url: '/leaderboards/api/deleteUserScore',
      body: { score: scoreVal }
    });
    let res = httpM.createResponse();

    // Call
    router.deleteUserScore(db)(req, res, (data) => {

      // Evaluation
      assert.equal(data.score, scoreVal, "Inserted score is NOT equal to parameter score");
      assert.equal(data.users[0].name, users[0], "Deleted user(s) NOT equal to expected deleted users");

      // Restore
      done();
      db.score.options.autoQueryFallback = true;

    });

  });

  // Post hook

  afterEach( () => {
    for (let m in db) db[m].$clearQueue();
  });

});
