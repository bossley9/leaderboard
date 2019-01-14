


var routes = require('express').Router();



/**
 * GET request involving the game as the parameter.
 */
routes.get('/leaderboards/entries/:game?', function(req, res) {

/*
  var currGame = req.params.game;

  connection.query('SELECT * FROM games WHERE delete_stamp IS NULL', function(err, result) {
    if (err) throw err;
    var gameList = [];
    var hasGame = false;
    for (var i = 0; i < result.length; i++) {
      if (result[i].game_name == currGame) hasGame = true;
      gameList.push(result[i].game_name);
    }

    if (!hasGame) currGame = "";
    if (!hasGame && result.length > 0) currGame = result[0].game_name;

    connection.query(
    'SELECT score_id, game_name, user_name, score, scores.delete_stamp FROM scores ' +
    'LEFT JOIN games ON scores.game_id=games.game_id ' +
    'LEFT JOIN users ON scores.user_id=users.user_id ' +
    'WHERE game_name=BINARY "' + currGame + '" AND scores.delete_stamp IS NULL AND games.delete_stamp IS NULL AND users.delete_stamp IS NULL ' +
    'ORDER BY score DESC',
    function(err, result) {
      if (err) throw err;

      var data = [];

      for (var i = 0; i < result.length; i++) {
        data.push(result[i]);
      }

      res.render('index', {
        data: data,
        gameList: gameList,
        currGame: currGame,
      });

    });

  });

*/
});



module.exports = routes;
