const Group = require('../models/Group')
const electron = require('electron');
const ipc = electron.ipcMain;

module.exports = async () => {
  ipc.on('add-group', async (event, group) => {
    try {
      const newGroup = await Group.create(group);
      event.returnValue = newGroup.dataValues;
    } catch (ex) {
      event.returnValue = null;
    }
  });

  ipc.on('update-group', async (event, user) => {
    try {
      const newUser = await Group.update(user, {
        where: {
          groupId: user.groupId
        }
      });
      event.returnValue = user;
    } catch (ex) {
      event.returnValue = null;
    }
  });

  ipc.on('delete-group', async (event, id) => {
    try {
      await Group.destroy({
        where: {
          groupId: id
        }
      });
      event.returnValue = 'deleted';
    } catch (ex) {
      event.returnValue = null;
    }
  });

  ipc.on('get-groups', async (event, ...args) => {
    try {
      let users = await Group.findAll();
      event.returnValue = users.map(value => value.dataValues);
    } catch (ex) {
      event.returnValue = [];
    }

  });
};
