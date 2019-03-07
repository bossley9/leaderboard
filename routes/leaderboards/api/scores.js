


module.exports.init = function(db) {

  var scores = require('express').Router();

  /**
   * POST request that handles the creation of a new user (if the user does not already exist) and a score.
   */
  scores.post('/createUserScore', urlencodedParser, this.createUserScore(db));

  /**
   * DELETE request that handles the client-side "deletion" of a score. This will
   * also delete any unused users.
   *
   * The entry(s) will still exist in the database for safety precautions.
   */
  scores.delete('/deleteUserScore', urlencodedParser, this.deleteUserScore(db));

  return scores;

}



module.exports.createUserScore = function(db) {

  return function(req, res, next) {

    if (req.body.username.length > 0 && req.body.score >= 0 ) {
      var newGame = req.body.game;
      var newUser = req.body.username;
      var newScore = req.body.score;

      // SELECT id, name FROM users WHERE name = "newUser";
      db.user.findAll({
        attributes: ['id', 'name'],
        where: { name: newUser }
      }).then(function(users) {

        var user;
        if (Array.isArray(users)) user = users[0];

        // INSERT IGNORE INTO users (name) VALUES ("newUser");
        if (!user) return db.user.create({ name: newUser });
        else return user;

      }).then(function(user) {

        // UPDATE users WHERE name = "newUser" SET delete_stamp = NULL;
        return user.update({ delete_stamp: null });

      }).then(function(user) {

        // SELECT id, name FROM games WHERE name = "newGame";
        db.game.findOne({
          attributes: ['id', 'name'],
          where: { name: newGame },
        }).then(function(game) {

          // sanity check -
          // if this route is being called,
          // there must be a valid existing game
          if (game) return game;

        }).then(function(game) {

          // INSERT IGNORE INTO scores (score) VALUES ("newScore");
          db.score.create({ score: newScore })
          .then(function(score) {

            // UPDATE scores WHERE score = "newScore" SET gameId = game.id;
            game.addScore(score)
            .then(function() {

              // UPDATE scores WHERE score = "newScore" SET userId = user.id;
              return user.addScore(score);

            }).then(function() {

              var data = {
                valid: true,
                user: newUser,
                score: newScore
              };

              res.send(data);

              return data;

            }).then(function(data) {

              // callback
              next(data);

            });

          });

        });

      })

      .catch(function(e) { throw e });

    }

  };

}



module.exports.deleteUserScore = function(db) {

  return function(req, res, next) {

    var scoreVal = -1;
    var usersVal = [];

    // SELECT * FROM scores AS score INNER JOIN users AS user AND
    // user.delete_stamp IS NULL AND user.name="req.body.username" WHERE
    // score.delete_stamp IS NULL AND score.score="req.body.score";
    db.score.findAll({
      where: {
        delete_stamp: null,
        score: req.body.score,
      },
      include: [{ model: db.user, where: {
        delete_stamp: null,
        name: req.body.username
      } }]
    }).then(function(scores) {

      // sanity check -
      // this score should exist because the user
      // clicked on it.
      if (scores[0]) return scores[0];

    }).then(function(score) {

      scoreVal = score.dataValues.score;

      // UPDATE scores WHERE score = "req.body.score" SET delete_stamp = NOW();
      return score.update({ delete_stamp: Date.now() });

    }).then(function(score) {

      // SELECT * FROM users WHERE id = score.userId;
      return score.getUser();

    }).then(function(user) {

      if (Array.isArray(user)) user = user[0];

      // SELECT * FROM scores WHERE userId = user.id AND delete_stamp = NULL;
      user.getScores({
        where: { delete_stamp: null }
      }).then(function(scores) {

        if (scores.length == 0) {

          usersVal.push(user);

          // UPDATE users WHERE id = user.id SET delete_stamp = NOW();
          return user.update({ delete_stamp: Date.now() });

        }
        else return user;

      }).then(function(user) {

        var data = {
          valid: true,
          score: scoreVal,
          users: usersVal,
        };

        // callback is only used to verify that the user
        // has been deleted if needed.
        res.json(data);

        return data;

      }).then(function(data) {

        // callback
        next(data);

      });

    }).catch(function(e) { throw e });

  };

}
