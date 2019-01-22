

module.exports = function(db) {

  var routes = require('express').Router();

  /**
   * POST request that handles the creation of a new user (if the user does not already exist) and a score.
   */
  routes.post('/createUserScore', urlencodedParser, function(req, res) {
    if (req.body.username.length > 0 && req.body.score >= 0 ) {
      var newGame = req.body.game;
      var newUser = req.body.username;
      var newScore = req.body.score;

      // SELECT id, name FROM users WHERE name=BINARY "newUser";
      db.user.findOne({
        attributes: ['id', 'name'],
        where: { name: newUser },
      }).then(function(user) {

        // INSERT INTO users (name) VALUES ("newUser");
        if (!user) return db.user.create({ name: newUser });
        else return user;

      }).then(function(user) {

        // UPDATE users SET delete_stamp=NULL WHERE name=BINARY "newUser";
        return user.update({ delete_stamp: null });

      }).then(function(user) {

        // SELECT id, name FROM games WHERE name=BINARY "newGame";
        db.game.findOne({
          attributes: ['id', 'name'],
          where: { name: newGame }
        }).then(function(game) {

          // INSERT INTO scores (score, score_user_id, score_game_id) VALUES (newScore, user.id, game.id);
          return db.score.create({
            score: newScore,
            score_user_id: user.id,
            score_game_id: game.id,
          })

        }).then(function(score) {

          //console.log(score.name);

          //res.send(score.name);
          res.send(true);
        });

      })
      .catch(function(e) {throw e});

    }

  });



  /**
   * DELETE request that handles the client-side "deletion" of a score. This will
   * also delete any unused users.
   *
   * The entry(s) will still exist in the database for safety precautions.
   */
  routes.delete('/deleteUserScore', urlencodedParser, function(req, res) {
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


  return routes;

}
