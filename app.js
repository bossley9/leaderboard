// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var db;

// template engine
app.set('view engine', 'ejs');

// middleware
app.use(express.static('public'));

// middleware to handle POST and other information-sensitive requests
urlencodedParser = bodyParser.urlencoded({ extended: false });

// promise to verify database exists before establishing a connection
const KEYS = require('./KEYS.json');
var dbPromise = new Promise(function(resolve, reject) {

  var mysql = require('mysql2');
  var connection = mysql.createConnection({
    host: KEYS.host,
    user: KEYS.username,
    password: KEYS.password,
  });

  connection.query('CREATE DATABASE IF NOT EXISTS ' + KEYS.database, function (err, result) {
    if (err) reject(err);
    else resolve(result);
  });

});

dbPromise.then(function() {

  // initialize models
  require('./models/index')
  .then(function(db) {

    // routes
    require('./routes')(app, db);

  }).then(function() {

    // server
    app.listen(8081, function() {
      console.log('Server is active at 127.0.0.1:8081.');
    });

  });

}).catch(function(e) { throw e });
