


var routes = require('express').Router();
var db = require('../../../models/index');



/**
 * POST request that handles the creation of a new game (if it does not already exist).
 */
routes.post('/leaderboards/api/createGame', urlencodedParser, function(req, res) {

  var gameList = [];

  if (req.body.game.length > 0) {

    // SELECT name FROM games WHERE delete_stamp IS NULL;
    db.game.findAll({
      attributes: ['name'],
      where: {delete_stamp: null}
    }).then(function(games) {
      for (var g in games) {
        gameList.push(games[g].dataValues.name);
      }

      // SELECT TOP 1 FROM games WHERE name=BINARY "req.body.game";
      return db.game.findOne({
        attributes: ['name'],
        where: { name: req.body.game }
      });

    })
    .then(function(game) {
      if (!game) {
        // INSERT INTO games (name) VALUES ("req.body.game");
        return db.game.create({ name: req.body.game });
      }
    })
    .then(function(game) {

      // UPDATE games SET delete_stamp=NULL WHERE game_name=BINARY "req.body.game";
      return game.update({ delete_stamp: null });

    })
    .then(function(game) {

      res.send(game.name);

    })
    .catch(function(e) { throw e });

  }

});



// TODO - also make sure that scores and unused users are stamped

/**
 * DELETE request that handles the client-side "deletion" of a game. This will
 * also delete any scores associated with the game, and finally will delete any
 * unused users.
 *
 * The entry(s) will still exist in the database for safety precautions.
 */
routes.delete('/leaderboards/api/deleteGame', urlencodedParser, function(req, res) {
// TODO
  // SELECT * FROM games WHERE name=
  db.game.findAll({
    where: {name: req.body.game},
  })
  .then(function(result) {

  });

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
