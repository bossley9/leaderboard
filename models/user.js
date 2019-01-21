

// CREATE TABLE IF NOT EXISTS users (
//  user_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
//  user_name VARCHAR(20) NOT NULL UNIQUE,
//  delete_stamp DATETIME DEFAULT NULL
// )

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    name: {
      type: DataTypes.STRING.BINARY,
      unique: true,
    },
    delete_stamp: {
      type: DataTypes.DATE,
      default: null,
    },
  });
}
