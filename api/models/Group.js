const Sequelize = require('sequelize');

class Group extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      groupId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    }, {
      sequelize,
      tableName: 'group',
      modelName: 'group'
    });
  }
  static associate(models) {
    this.belongsToMany(models.User, {
      foreignKey: 'userId',
      through: 'UserGroup'
    });
  }
}

module.exports = Group;
