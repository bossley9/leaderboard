


var routes = require('express').Router();
var models = require('../../models/models');



/**
 * GET request involving the game as the parameter.
 */
routes.get('/leaderboards/entries/:game?', function(req, res) {
  var currGame = req.params.game;
  var gameList = [];
  var scoreData = [];

  // SELECT name FROM games WHERE delete_stamp IS NULL;
  models.Game.findAll({
    attributes: ['name'],
    where: { delete_stamp: null },
  }).then(function(games) {

    var hasGame = false;

    for (var g in games) {
        if (games[g].dataValues.name == currGame) hasGame = true;
        gameList.push(games[g].dataValues.name);
    }

    if (!hasGame) currGame = "";
    if (!hasGame && games.length > 0) currGame = games[0].dataValues.name;


    // SELECT score_id, game_name, user_name, score, scores.delete_stamp FROM scores
    // LEFT JOIN games ON scores.game_id=games.game_id
    // LEFT JOIN users ON scores.user_id=users.user_id
    // WHERE game_name=BINARY " currGame " AND scores.delete_stamp IS NULL AND games.delete_stamp IS NULL AND users.delete_stamp IS NULL
    // ORDER BY score DESC;
    return models.Score.findAll({
      attributes: ['id', 'score'],
      where: { delete_stamp: null },
      order: [
        ['score', 'DESC'],
      ],
      include: [
        {
          model: models.Game,
          attributes: ['name'],
          where: { name: currGame, delete_stamp: null }
        },
        {
          model: models.User,
          attributes: ['name'],
          where: { delete_stamp: null },
        }
      ],
    });

  })
  .then(function(scores) {
    for (var s in scores) {

      scoreData.push({
        user_name: scores[s].dataValues.user.name,
        score: scores[s].dataValues.score
      });
    }
      res.render('index', {
        data: scoreData,
        gameList: gameList,
        currGame: currGame,
      });


  })
  .catch(function(e) { throw e });

});



module.exports = routes;
