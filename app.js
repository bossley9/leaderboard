


// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var Sequelize = require('sequelize');

// template engine
app.set('view engine', 'ejs');

// middleware
app.use(express.static('public'));

// middleware to handle POST and other information-sensitive requests
urlencodedParser = bodyParser.urlencoded({ extended: false });

// client-sensitive information stored here
var KEYS = require('./KEYS');



// create connection and database
var mysql = require('mysql2');
connection = mysql.createConnection({
  host: 'localhost',
  user: KEYS.username,
  password: KEYS.password,
});

// TEMP - caveat - assumes "leaderboards" database has already been created

// create sequelize connection
var sequelize = new Sequelize('leaderboards', KEYS.username, KEYS.password, {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // TEMP - suppresses String based operator warning
  operatorsAliases: false
});

var models = require('./models/models');

var Score = models.score;
var User;
var Game;


// routes
app.use(require('./controllers/leaderboards/entries'));
app.use(require('./controllers/leaderboards/api/games'));
app.use(require('./controllers/leaderboards/api/scores'));



// server
app.listen(8081, function() {
  console.log('Server is active at 127.0.0.1:8081.');
});
