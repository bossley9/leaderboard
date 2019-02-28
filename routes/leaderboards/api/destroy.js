


module.exports.init = function(db) {

  var destroy = require('express').Router();

  /**
  * DELETE request that handles the hard deletion of all scores, games, and users.
  * This is a PERMANENT action and should not be taken under any realistic
  * circumstances.
  */
  destroy.delete('/destroy', urlencodedParser, this.destroy(db));

  return destroy;

}



module.exports.destroy = function(db) {

  return function(req, res, next) {

    db.sequelize.transaction({autocommit: false}).then(function (t) {
      var options = { raw: true, transaction: t }

      // manually query to truncate tables because of foreign key constraints

      return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, options)
      .then(function() {


        return db.sequelize.query('TRUNCATE TABLE scores', null, options)
      }).then(function() {
        return db.sequelize.query('TRUNCATE TABLE users', null, options)
      }).then(function() {
        return db.sequelize.query('TRUNCATE TABLE games', null, options)


      }).then(function() {
        return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, options)
      }).then(function() {
        return t.commit()
      })
    }).then(function() {

      res.send({ valid: true });

    }).catch(function(e) { throw e });

  };

}
