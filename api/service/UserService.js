const sequelize = require('../sequelize');
const User = require('../models/User')
const electron = require('electron');
const ipc = electron.ipcMain;

module.exports = async () => {
  ipc.on('add-user', async (event, user)=> {
    try {
      const newUser = await User.create(user);
    } catch (ex){
      console.log(ex);
    }
  });

  ipc.on('update-user', async (event, user)=> {
    const newUser = await User.update(user, {
      where: {
        number: user.number
      }
    });
  });

  ipc.on('remove-user', async (event, number)=> {
    await User.destroy({
      where: {
        number: number
      }
    });
  });

};
