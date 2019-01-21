
"use strict";

var fs = require('fs');
var path = require('path');
var Sequelize = require("sequelize");

// client-sensitive information stored here
var KEYS = require('../KEYS');

const sequelize = new Sequelize(KEYS.database, KEYS.username, KEYS.password, {
  host: KEYS.host,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // TEMP - suppresses String-based operator warning
  operatorsAliases: false
});


var db = {};


fs.readdirSync(__dirname).filter(function(file) {

  return (file.indexOf(".") !== 0) && (file !== "index.js");

}).forEach(function(file) {

  var model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;

});


Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.sequelize.sync();

module.exports = db;
