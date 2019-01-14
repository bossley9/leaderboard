


var routes = require('express').Router();



/**
 * POST request that handles the creation of a new game (if it does not already exist).
 */
routes.post('/leaderboards/api/createGame', urlencodedParser, function(req, res) {

  if (req.body.game.length > 0) {

    connection.query('SELECT * FROM games WHERE delete_stamp IS NULL', function(err, result) {
      if (err) throw err;
      var gameList = [];

      for (var i = 0; i < result.length; i++) {
        gameList.push(result[i].game_name);
      }

      // create game if not exists
      connection.execute('INSERT IGNORE INTO games (game_name) VALUES (?)', [req.body.game], function(err, result) {
        if (err) throw err;
        // set game delete_stamp to null
        connection.execute('UPDATE games SET delete_stamp=NULL WHERE game_name=BINARY ?', [req.body.game], function(err, result) {
          if (err) throw err;
          // get scores
          connection.execute('SELECT * FROM scores JOIN games JOIN users WHERE games.game_name=BINARY ?', [req.body.game], function(err, result) {
            if (err) throw err;
            var data = [];
            var currGame = req.body.game;

            for (var i = 0; i < result.length; i++) {
              data.push(result[i]);
            }

            res.send(currGame);

          });

        });

      });

    });

  }

});



/**
 * DELETE request that handles the client-side "deletion" of a game. This will
 * also delete any scores associated with the game, and finally will delete any
 * unused users.
 *
 * The entry(s) will still exist in the database for safety precautions.
 */
routes.delete('/leaderboards/api/deleteGame', urlencodedParser, function(req, res) {
  // update game delete_stamp
  connection.query('UPDATE games SET delete_stamp=NOW() WHERE game_name=BINARY "' + req.body.game + '"', function(err, result) {
    // delete all associated scores
    connection.query('UPDATE scores LEFT JOIN games ON scores.game_id=games.game_id SET scores.delete_stamp=NOW() WHERE game_name=BINARY "' + req.body.game + '" AND scores.delete_stamp IS NULL', function(err, result) {
      // TODO delete any unused users

      res.send("success");

    });

  });

});



module.exports = routes;
