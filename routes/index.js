

var fs = require('fs');


function addRoutes(dir, app, db) {

  fs.readdirSync(dir).filter(function(file) {

      return (file !== "index.js");

  }).forEach(function (file) {
    
    // find all files recursively
    if(fs.lstatSync(dir + '/' + file).isDirectory()) {
      addRoutes(dir + '/' + file, app, db);
    } else {

      // use route
      var folder = "routes";
      var newDir = dir.slice(dir.indexOf(folder) + (folder).length);

      app.use(newDir, require(dir + "/" + file)(db));

    }

  });

}


module.exports = function (app, db) {

  addRoutes(__dirname, app, db);

}
