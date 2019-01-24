


//  CREATE TABLE IF NOT EXISTS users (
//    id INTEGER NOT NULL auto_increment,
//    name VARCHAR(255) BINARY UNIQUE,
//    delete_stamp DATETIME,
//    createdAt DATETIME NOT NULL,
//    updatedAt DATETIME NOT NULL,
//    PRIMARY KEY (`id`)
//  );



module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: {
      type: DataTypes.STRING.BINARY,
      unique: true,
    },
    delete_stamp: {
      type: DataTypes.DATE,
      default: null,
    },
  });

  user.associate = (models) => {
    // each user will have multiple scores (across games)
    user.hasMany(models.score, {as: 'scores'});
  }

  return user;
}
