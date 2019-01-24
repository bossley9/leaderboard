


//  CREATE TABLE IF NOT EXISTS scores (
//    id INTEGER NOT NULL auto_increment,
//    score INTEGER UNSIGNED,
//    delete_stamp DATETIME,
//    createdAt DATETIME NOT NULL,
//    updatedAt DATETIME NOT NULL,
//    gameId INTEGER,
//    userId INTEGER,
//    PRIMARY KEY (id),
//    FOREIGN KEY (gameId) REFERENCES games (id) ON DELETE SET NULL ON UPDATE CASCADE,
//    FOREIGN KEY (userId) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
//  );



module.exports = (sequelize, DataTypes) => {
  const score = sequelize.define('score', {
    score: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    delete_stamp: {
      type: DataTypes.DATE,
      default: null,
    },
  });

  score.associate = (models) => {
    // each score has one game
    score.belongsTo(models.game);
    // each score has one user
    score.belongsTo(models.user);
  }

  return score;
}
