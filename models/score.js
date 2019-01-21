

// CREATE TABLE IF NOT EXISTS scores (
//  score_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
//  user_id INT UNSIGNED NOT NULL,
//  FOREIGN KEY (user_id) REFERENCES users(user_id),
//  game_id INT UNSIGNED NOT NULL,
//  FOREIGN KEY (game_id) REFERENCES games(game_id),
//  score INT UNSIGNED NOT NULL DEFAULT 0,
//  delete_stamp DATETIME DEFAULT NULL
// )

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
    // a single game contains many different scores
    score.belongsTo(models.game, {foreignKey: 'score_game_id'});
    // each user will have multiple scores across games
    score.belongsTo(models.user, {foreignKey: 'score_user_id'});
  }

  return score;
}



// a single game contains many different scores
//Score.belongsTo(Game, {foreignKey: 'score_game_id'});
// each user will have multiple scores across games
//Score.belongsTo(User, {foreignKey: 'score_user_id'});
