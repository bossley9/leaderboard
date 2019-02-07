


'use strict';



let assert = require('chai').assert;
let faker = require('faker');

let SequelizeM = require('sequelize-mock');
let sequelizeM = new SequelizeM();
let httpM = require('node-mocks-http');

let db, router;



describe("/leaderboards/api/createUserScore", () => {

  // Pre hooks

  beforeEach( () => {
    router = require('../routes/leaderboards/api/scores');
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

  /*
  ** Routine test when a score is added to an existing user
  */
  it("creates only a score if the user exists", (done) => {

    // Setup
    let scoreVal = faker.random.number();
    let userVal = faker.internet.userName();

    db.user.$queueResult = ([
      db.user.build({ name: userVal })
    ]);

    let req = httpM.createRequest({
      method: 'POST',
      url: '/leaderboards/api/createUserScore',
      body: { score: scoreVal, username: userVal }
    });
    let res = httpM.createResponse();

    // Call
    router.createUserScore(db)(req, res, (data) => {

      // Evaluation
      assert.equal(data.score, scoreVal, "Score is NOT equal to parameter score");
      assert.equal(data.user, userVal, "Score user is NOT equal to parameter user");

      // Restore
      done();

    });

  });

  /*
  ** Routine test when a score and user pair is created
  */
  it("creates a user if the user does not exist", (done) => {

    // Setup
    let scoreVal = faker.random.number();
    let userVal = faker.internet.userName();

    db.score.$queueResult([
      db.score.build({ score: scoreVal })
    ]);

    let req = httpM.createRequest({
      method: 'POST',
      url: '/leaderboards/api/createUserScore',
      body: { score: scoreVal, username: userVal }
    });
    let res = httpM.createResponse();

    // Call
    router.createUserScore(db)(req, res, (data) => {

      // Evaluation
      assert.equal(data.score, scoreVal, "Score is NOT equal to parameter score");
      assert.equal(data.user, userVal, "Score user is NOT equal to parameter user");

      // Restore
      done();

    });

  });

  /*
  ** Boundary test when user exists but delete_stamp is not null
  */
  it("undeletes a user when a deleted user exists in the user list", (done) => {

    // Setup
    let scoreVal = faker.random.number();
    let userVal = faker.internet.userName();

    db.score.$queueResult([
      db.score.build({ score: scoreVal })
    ]);

    db.user.$queueResult([
      db.user.build({ name: userVal, delete_stamp: Date.now() })
    ]);


    let req = httpM.createRequest({
      method: 'POST',
      url: '/leaderboards/api/createUserScore',
      body: { score: scoreVal, username: userVal }
    });
    let res = httpM.createResponse();

    // Call
    router.createUserScore(db)(req, res, (data) => {

      // Evaluation
      assert.equal(data.score, scoreVal, "Score is NOT equal to parameter score");
      assert.equal(data.user, userVal, "Score user is NOT equal to parameter user");

      // Restore
      done();

    });

  });

  // Post hook

  afterEach( () => {
    for (let m in db) db[m].$clearQueue();
  });

});
