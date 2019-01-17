


// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


// template engine
app.set('view engine', 'ejs');

// middleware
app.use(express.static('public'));

// middleware to handle POST and other information-sensitive requests
urlencodedParser = bodyParser.urlencoded({ extended: false });

// client-sensitive information stored here
var KEYS = require('./KEYS');



// promise to verify database exists before establishing a connection
var dbPromise = new Promise(function(resolve, reject) {

  var mysql = require('mysql2');
  var connection = mysql.createConnection({
    host: 'localhost',
    user: KEYS.username,
    password: KEYS.password,
  });

  connection.query('CREATE DATABASE IF NOT EXISTS Leaderboard', function (err, result) {
    if (err) reject(err);
    else resolve(result);
  });

});

var Game, User, Score;

dbPromise.then(function(result) {

  // create models
  var models = require('./models/models');

  Game = models.Game;
  User = models.User;
  Score = models.Score;

  //return models.sequelize.sync({force: true});
  return models.sequelize.sync();

}).then(function(result) {
  /*Game.create({name: "TestNull", delete_stamp: Date.now()})
  .then(() => {
    return Game.create({name: "TestValidGame"})
  })
  .then((game) => {
    User.create({name: "Bob"})
    .then((user) => {
      Score.create({
        score: 123,
        score_user_id: user.id,
        score_game_id: game.id,
      }
      //,
      // {
      //  include: [User, Game],
      //}
      )
    })
  })
  */

}).catch(function(e) { throw e });



// routes
app.use(require('./controllers/leaderboards/entries'));
app.use(require('./controllers/leaderboards/api/games'));
app.use(require('./controllers/leaderboards/api/scores'));



// server
app.listen(8081, function() {
  console.log('Server is active at 127.0.0.1:8081.');
});
