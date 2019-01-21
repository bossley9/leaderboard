


// CREATE TABLE IF NOT EXISTS games (
//  game_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
//  game_name VARCHAR(40) NOT NULL UNIQUE,
//  delete_stamp DATETIME DEFAULT NULL
// )

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('game', {
    name: {
      type: DataTypes.STRING.BINARY,
      unique: true,
    },
    delete_stamp: {
      type: DataTypes.DATE,
      default: null,
    },
  })
}
