const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'unknown'
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    }, {
      sequelize,
      tableName: 'user',
      modelName: 'user'
    });
  }
}

module.exports = User;
