


var Sequelize = require('sequelize');
var KEYS = require('../KEYS')



// create sequelize connection
var sequelize = new Sequelize('leaderboards', KEYS.username, KEYS.password, {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // TEMP - suppresses String-based operator warning
  operatorsAliases: false
});

// Game ------------------------------------------------------------------------

// CREATE TABLE IF NOT EXISTS games (
//  game_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
//  game_name VARCHAR(40) NOT NULL UNIQUE,
//  delete_stamp DATETIME DEFAULT NULL
// )

var Game = sequelize.define('game', {
  name: {
    type: Sequelize.STRING.BINARY,
    unique: true,
  },
  delete_stamp: {
    type: Sequelize.DATE,
    default: null,
  },
});

// User ------------------------------------------------------------------------

// CREATE TABLE IF NOT EXISTS users (
//  user_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
//  user_name VARCHAR(20) NOT NULL UNIQUE,
//  delete_stamp DATETIME DEFAULT NULL
// )

var User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING.BINARY,
    unique: true,
  },
  delete_stamp: {
    type: Sequelize.DATE,
    default: null,
  },
});

// Score -----------------------------------------------------------------------

// CREATE TABLE IF NOT EXISTS scores (
//  score_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
//  user_id INT UNSIGNED NOT NULL,
//  FOREIGN KEY (user_id) REFERENCES users(user_id),
//  game_id INT UNSIGNED NOT NULL,
//  FOREIGN KEY (game_id) REFERENCES games(game_id),
//  score INT UNSIGNED NOT NULL DEFAULT 0,
//  delete_stamp DATETIME DEFAULT NULL
// )

var Score = sequelize.define('score', {
  score: {
    type: Sequelize.INTEGER.UNSIGNED,
  },
  delete_stamp: {
    type: Sequelize.DATE,
    default: null,
  },
});



// a single game contains many different scores
Score.belongsTo(Game, {foreignKey: 'score_game_id'});
// each user will have multiple scores across games
Score.belongsTo(User, {foreignKey: 'score_user_id'});


module.exports.sequelize = sequelize;

module.exports.Game = Game;
module.exports.User = User;
module.exports.Score = Score;
