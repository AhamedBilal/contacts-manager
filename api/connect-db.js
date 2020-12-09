const sequelize = require('./sequelize');
const User = require('./models/User');

const models = {
    User: User.init(sequelize)
}
Object.values(models)
    .filter(model => typeof model.associate === 'function')
    .forEach(model => model.associate(models));

module.exports = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        await sequelize.sync();
        console.log('Database tables updated successfully.');
    } catch (e) {
        console.log('Database error:', e);
    }
};