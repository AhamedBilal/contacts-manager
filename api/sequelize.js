const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.USERPROFILE+'\\Contacts Manager\\database.sqlite'
});

module.exports = sequelize;

