


var routes = require('express').Router();



/**
 * POST request that handles the creation of a new user (if the user does not already exist) and a score.
 */
routes.post('/leaderboard/api/createUserScore', urlencodedParser, function(req, res) {

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

});



/**
 * DELETE request that handles the client-side "deletion" of a score. This will
 * also delete any unused users.
 *
 * The entry(s) will still exist in the database for safety precautions.
 */
routes.delete('/leaderboard/api/deleteUserScore', urlencodedParser, function(req, res) {
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
