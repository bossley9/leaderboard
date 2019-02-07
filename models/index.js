


"use strict";



module.exports = new Promise(function(resolve, reject) {

  let fs = require('fs');
  let path = require('path');
  let Sequelize = require("sequelize");

  // client-sensitive information stored here
  let KEYS = require('../KEYS');

  const Op = Sequelize.Op;
  const sequelize = new Sequelize(KEYS.database, KEYS.username, KEYS.password, {
    host: KEYS.host,
    dialect: 'mysql',

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },

    operatorsAliases: Op,
  });


  let db = {};
  let model;

  fs.readdirSync(__dirname).filter(function(file) {

    return (file.indexOf(".") !== 0) && (file !== "index.js");

  }).forEach(function(file) {

    model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;

  });


  Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
      db[modelName].associate(db);
    }
  });


  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  db.sequelize.sync()
  //db.sequelize.sync({force: true})

  .then(function() {
    resolve(db);
  })
  .catch(function(e) { throw e });

});
