


var assert = require('chai').assert;
var faker = require('faker');

var SequelizeM = require('sequelize-mock');
var sequelizeM = new SequelizeM();
var httpM = require('node-mocks-http');


var db, router;



describe("route tests", () => {

  // pre hook

  before( () => {
    db = {
      game: require('../models/game')(sequelizeM, SequelizeM),
      user: require('../models/user')(sequelizeM, SequelizeM),
      score: require('../models/score')(sequelizeM, SequelizeM),
    };
    for (var m in db) {
      if ("associate" in db[m]) db[m].associate(db);
    }
  });

  // unit tests

  describe("game", () => {

    beforeEach( () => {
      router = require('../routes/leaderboards/entries/entries');

      db.game.$queueResult([
        db.game.build({name:"TestGame123"})
      ]);
      db.user.$queueResult([
        db.user.build({name:"TestUser32139"}),
        db.user.build({name:"user123"})
      ]);
      db.score.$queueResult([
        db.score.build({score:321332,user:db.user.build({name:"userOfScore1"}).dataValues})
      ]);
    });

    // routine test of route
    it("works", (done) => {
      // Setup
      var req = httpM.createRequest({
        method: 'GET',
        url: '/leaderboards/entries',
        params: { game: "" }
      });
      var res = httpM.createResponse();

      // What's with all this monkey business?
      // Let's instead use some express route callback magic.
      // When you get back to work on monday, try calling the next() function and
      // create a callback with your routes instead of being a bonobo and trying
      // to use some funky async await methods.


/*      Promise.all([
        router.leaderboardEntries(db)(req, res)
      ]).then(() => {

        console.log(JSON.parse(res._getData()));

        console.log("--------- POST DATA PUSH ---------");

      }).then(() => {

        done();

      })
*/
      //var data = res._getData();

      //console.log(res._getData());

      //done();
    });

    // post hook

    afterEach( () => {
      for (var m in db) db[m].$clearQueue();
    });


  });

});
