


module.exports.init = function(db) {

  var entries = require('express').Router();

  /**
   * GET request involving the game as the parameter.
   */
  entries.get('/:game?', this.leaderboardEntries(db));

  return entries;

}



module.exports.leaderboardEntries = function(db) {

  return function(req, res) {

    var currGame = req.params.game;
    var gameList = [];

    // SELECT name FROM games WHERE delete_stamp IS NULL;
    db.game.findAll({
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

      // SELECT * FROM games WHERE delete_stamp IS NULL AND name="currGame";
      return db.game.findOne({
        where: ({ delete_stamp: null, name: currGame })
      });

    }).then(function(game) {

      if (game) {
        // SELECT score, user.name FROM scores LEFT OUTER JOIN users AS "user" ON score.userId = user.id WHERE gameId = game.id AND delete_stamp = NULL;
        return game.getScores({
          attributes: ['score'],
          where: { delete_stamp: null },
          include: [
            { model: db.user, attributes: ['name'] }
          ],
          order: [ ['score', 'DESC'], [{ model: db.user }, 'name', 'ASC'] ],
        }).then(function(scores) {

          var scoreData = [];

          console.log("DATA PUSH");

          for (var s in scores) {
            scoreData.push({
              user_name: scores[s].dataValues.user.name,
              score: scores[s].dataValues.score,
            });
          }

          return scoreData;

        });
      }
      else return [];

    }).then(function(scoreData) {

      // render
      res.render('index', {
        data: scoreData,
        gameList: gameList,
        currGame: currGame,
      });

    }).catch(function(e) { throw e });

  };

}
