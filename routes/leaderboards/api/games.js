


module.exports.init = function(db) {

  var games = require('express').Router();

  /**
   * POST request that handles the creation of a new game (if it does not already exist).
   */
  games.post('/createGame', urlencodedParser, this.createGame(db));

  /**
   * DELETE request that handles the client-side "deletion" of a game. This will
   * also delete any scores associated with the game, and finally will delete any
   * unused users.
   *
   * The entry(s) will still exist in the database for safety precautions.
   */
  games.delete('/deleteGame', urlencodedParser, this.deleteGame(db));

  return games;

}



// regarding js promises without Sequelize
Promise.each = function(arr, fn) {
  if(!Array.isArray(arr)) return Promise.reject(new Error("array undefined"));
  if(arr.length === 0) return Promise.resolve();
  return arr.reduce(function(prev, cur) {
    return prev.then(() => fn(cur))
  }, Promise.resolve());
}



module.exports.createGame = function(db) {

  return function(req, res, next) {

    if (req.body.game.length > 0) {

      // SELECT id, name FROM games WHERE name = "req.body.game";
      db.game.findAll({
        attributes: ['id', 'name'],
        where: { name: req.body.game },
      }).then(function(games) {

        var game;

        // retrieve the first (and only) value
        if (Array.isArray(games)) game = games[0];

        // INSERT IGNORE INTO games (name) VALUES ("req.body.game");
        if (!game) return db.game.create({ name: req.body.game });
        else return game;

      }).then(function(game) {

        // UPDATE games WHERE name = "req.body.game" SET delete_stamp=NULL;
        return game.update({ delete_stamp: null });

      }).then(function(game) {

        var data = {
          valid: true,
          game: req.body.game,
        };

        // we don't do anything with the callback here,
        // this is only to verify that the game has been
        // created if it didn't exist. Then the view will
        // render the page with the game as the relative url.
        res.send(data);

        return data;

      }).then(function(data) {

        // callback
        next(data);

      }).catch(function(e) { throw e });

    }

  };

}



module.exports.deleteGame = function(db) {

  return function(req, res, next) {

    var gameVal = "";

    // SELECT id, name FROM games WHERE name = "req.body.game";
    db.game.findAll({
      attributes: ['id', 'name'],
      where: { name: req.body.game }
    }).then(function(games) {

      // sanity check -
      // game must exist in order for
      // the user to be able to delete it
      if (Array.isArray(games)) return games[0];

    }).then(function(game) {

      gameVal = game.dataValues.name;

      // UPDATE games WHERE name = "req.body.game" SET delete_stamp = NOW();
      return game.update({ delete_stamp: Date.now() });

    }).then(function(game) {

      return game.getScores();

    }).then(function(scores) {

      // not using the built-in db.sequelize.Promise.each()
      // function so Sequelize-Mock is able to function here.
      return Promise.each(scores, function(score) {

        // UPDATE scores WHERE gameId = game.id SET delete_stamp = NOW();
        return score.update({ delete_stamp: Date.now() })
        .then(function(score) {

          // SELECT * FROM users WHERE id = score.userId;
          return score.getUser();

        }).then(function(user) {

          // SELECT * FROM scores WHERE userId = user.id AND delete_stamp = NULL;
          return user.getScores({
            where: { delete_stamp: null }
          }).then(function(scores) {

            if (scores.length == 0) {

              // UPDATE users WHERE id = user.id SET delete_stamp = NOW();
              return user.update({ delete_stamp: Date.now() });

            }
            else return user;

          });

        });

      });

    }).then(function(promise) {

      var data = {
        valid: true,
        game: gameVal,
      };

      // callback is only used to verify that
      // scores and users have been deleted if
      // needed.
      res.send(data);

      return data;

    }).then(function(data) {

      // callback
      next(data);

    }).catch(function(e) { throw e });

  };

}
