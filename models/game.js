


//  CREATE TABLE IF NOT EXISTS games (
//    id INTEGER NOT NULL auto_increment,
//    name VARCHAR(255) BINARY UNIQUE,
//    delete_stamp DATETIME,
//    createdAt DATETIME NOT NULL,
//    updatedAt DATETIME NOT NULL,
//    PRIMARY KEY (id)
//  );



module.exports = (sequelize, DataTypes) => {
  const game = sequelize.define('game', {
    name: {
      type: DataTypes.STRING.BINARY,
      unique: true,
    },
    delete_stamp: {
      type: DataTypes.DATE,
      default: null,
    },
  });

  game.associate = (models) => {
    // a single game contains many different scores
    game.hasMany(models.score, {as: 'scores'});
  }

  return game;
}
