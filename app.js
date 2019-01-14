


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

// create connection
var sequelize = new Sequelize('leaderboards', KEYS.username, KEYS.password, {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

});



// server
app.listen(8081, function() {
  console.log('Server is active at 127.0.0.1:8081.');
});
