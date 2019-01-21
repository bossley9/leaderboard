


var routes = require('express').Router();
//var models = require('../../../models/models');



/**
 * POST request that handles the creation of a new user (if the user does not already exist) and a score.
 */
routes.post('/leaderboards/api/createUserScore', urlencodedParser, function(req, res) {
  if (req.body.username.length > 0 && req.body.score >= 0 ) {
    var newGame = req.body.game;
    var newUser = req.body.username;
    var newScore = req.body.score;

    // SELECT TOP 1 FROM users WHERE name=BINARY "newUser";
    models.User.findOne({
      attributes: ['name'],
      where: { name: newUser },
    }).then(function(user) {
      if (!user) {
        // INSERT INTO users (name) VALUES ("newUser");
        return models.User.create({ name: newUser })
      } else return user;
    }).then(function(user) {

      // UPDATE users SET delete_stamp=NULL WHERE name=BINARY "newUser";
      return user.update({ delete_stamp: null });

      // TODO - Unhandled rejection Error: You attempted to save an instance with no primary key, this is not allowed since it would result in a global update

    }).then(function(user) {

      // SELECT TOP 1 FROM games WHERE name=BINARY "newGame";
      models.Game.findOne({
        attributes: ['name'],
        where: { name: newGame }
      }).then(function(game) {
        //console.log(game);
        // INSERT INTO scores (score, score_user_id, score_game_id) VALUES (newScore, user.id, game.id);
        return models.Score.create({
          score: newScore,
          score_user_id: user.id,
          score_game_id: game.id,
        })

      }).then(function(game) {
        res.send(game.name);
      });

    })
    .catch(function(e) { throw e });

  }
  /*
  // verify the username is not empty and the score is non-negative
  if (req.body.username.length > 0 && req.body.score >= 0 ) {
    var game = req.body.game;
    var user = req.body.username;
    var score = req.body.score;
    var userID = 0;
    var gameID = 0;

    // add user if not exists
    connection.execute('INSERT IGNORE INTO users (user_name) VALUES (BINARY ? )', [user], function(err, result) {
      if (err) throw err;
      // get user id
      connection.execute('SELECT * FROM users WHERE user_name= ? ', [user], function(err, result) {
        if (err) throw err;
        userID = result[0].user_id;
        // get game id
        connection.execute('SELECT * FROM games WHERE game_name=BINARY ? ', [game], function(err, result) {
          if (err) throw err;
          gameID = result[0].game_id;
          // add score
          connection.execute('INSERT INTO scores (user_id, game_id, score) VALUES (?, ?, ?)', [userID, gameID, score], function(err, result) {
            if (err) throw err;
            res.send(game);
          });
        });
      });
    });

  }
  */
});



/**
 * DELETE request that handles the client-side "deletion" of a score. This will
 * also delete any unused users.
 *
 * The entry(s) will still exist in the database for safety precautions.
 */
routes.delete('/leaderboards/api/deleteUserScore', urlencodedParser, function(req, res) {
  // find all matching entries
  connection.query(
  'SELECT * FROM scores ' +
  'LEFT JOIN games ON scores.game_id=games.game_id ' +
  'LEFT JOIN users ON scores.user_id=users.user_id ' +
  'WHERE game_name=BINARY "' + req.body.game + '" AND user_name=BINARY "' + req.body.username + '" AND score=BINARY "' + req.body.score + '" AND scores.delete_stamp IS NULL',
  function(err, result) {
    // set the first score's delete_stamp field to the current time
    connection.query('UPDATE scores SET delete_stamp=NOW() WHERE score_id=' + result[0].score_id, function(err, result) {
      // TODO delete any unused users

      res.send("success");
    });

  });

});



module.exports = routes;
