const {Op} = require("sequelize");
const User = require('../models/User')
const electron = require('electron');
const {dialog} = require('electron');
const ipc = electron.ipcMain;
const {writeFile} = require('fs');
const XLSX = require('xlsx');

module.exports = async () => {
  ipc.on('add-user', async (event, user) => {
    try {
      if (user.name === null || user.name === "") {
        user.name = 'unknown';
      }
      const newUser = await User.create(user);
      event.returnValue = newUser.dataValues;
    } catch (ex) {
      event.returnValue = null;
    }
  });

  ipc.on('update-user', async (event, user) => {
    try {
      const newUser = await User.update(user, {
        where: {
          userId: user.userId
        }
      });
      event.returnValue = user;
    } catch (ex) {
      event.returnValue = null;
    }
  });

  ipc.on('delete-user', async (event, id) => {
    try {
      await User.destroy({
        where: {
          userId: id
        }
      });
      event.returnValue = 'deleted';
    } catch (ex) {
      event.returnValue = null;
    }
  });

  ipc.on('get-users', async (event, ...args) => {
    try {
      let users = await User.findAll({
        order: [['updatedAt', 'DESC']]
      });
      if (users.length > 0) {
        event.returnValue = users.map(value => value.dataValues);
      } else {
        const result = await dialog.showOpenDialog({
          buttonLabel: 'Select File',
          properties: ['openFile'],
          filters: [
            {name: 'Sheets', extensions: ['xlsx']},
          ]
        });
        if (result.canceled) {
          event.returnValue = [];
        } else {
          const workbook = await XLSX.readFile(result.filePaths[0]);
          const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
          await User.bulkCreate(json, {
            updateOnDuplicate: ['number']
          });
          const us = await User.findAll({
            order: [['updatedAt', 'DESC']]
          });
          event.returnValue = us.map(val => val.dataValues);
        }
      }
    } catch (ex) {
      event.returnValue = [];
    }

  });
  ipc.on('find-user', async (event, data) => {
    try {
      const regx = /^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\d)\d{6}$/;
      if (regx.test(data)) {
        const users = await User.findAll({
          where: {
            number: data
          }
        });
        event.returnValue = users.map(value => value.dataValues);
      } else {
        const users = await User.findAll({
          where: {
            name: {
              [Op.substring]: data
            }
          }
        });
        event.returnValue = users.map(value => value.dataValues);
      }
    } catch (ex) {
      event.returnValue = null;
    }
  });
  ipc.on('generate', async (event, num, startWith = null, out = 1, format = 'text') => {
    const result = await dialog.showOpenDialog({
      buttonLabel: 'Select Folder',
      properties: ['openDirectory']
    });
    if (result.canceled) {
      event.returnValue = result || num;
    } else {
      let temp;
      if (startWith !== null) {
        temp = (await User.findAll({
          where: {
            number: {
              [Op.like]: `${startWith}%`
            }
          }
        })).map(value => value.dataValues);
      } else {
        temp = (await User.findAll()).map(value => value.dataValues);
      }
      let i = 1;
      console.log(num);
      while (temp.length > 0) {
        const ts = temp.splice(0, num);
        if (format === 'text') {
          let user;
          if (out === 1) {
            user = ts.map(val => `${val.name},${val.number}`).join('\n');
          } else {
            user = ts.map(val => `${val.number}`).join('\n');
          }
          writeFile(result.filePaths[0] + `\\text${new Date().toISOString().slice(0, 10).replace(/-/g, "")}(${i}).txt`, user, function (err, data) {
            if (err) {
              console.log(err)
            } else {
            }
          });
        } else {
          let mapArray;
          if (out === 1) {
            mapArray = ts.map(val => [val.name, val.number]);
          } else {
            mapArray = ts.map(val => [val.number]);
          }
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet(mapArray);
          XLSX.utils.book_append_sheet(wb, ws);
          XLSX.writeFile(wb, result.filePaths[0] + `\\excel${new Date().toISOString().slice(0, 10).replace(/-/g, "")}(${i}).xlsx`);

        }


        i++;
      }
      event.returnValue = 'saved';
    }

  });

  ipc.on('google-doc', async (event, num) => {
    const result = await dialog.showOpenDialog({
      buttonLabel: 'Select File',
      properties: ['openFile'],
      filters: [
        {name: 'Sheets', extensions: ['csv', 'xlsx']},
      ]
    });
    if (result.canceled) {
      event.returnValue = result;
    } else {
      const workbook = await XLSX.readFile(result.filePaths[0]);
      const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      const regex = /7(0|1|2|5|6|7|8)\d{7}/g;
      const temp = [];
      json.forEach((value) => {
        let num = value['Phone 1 - Value'] + '';
        if (num !== '') {
          num = num.replace(/ /g, '');
          const numbers = num.match(regex);
          console.log(value['Name'], num);
          if (numbers) {
            console.log(numbers);
            numbers.forEach(val => {
              temp.push({name: value['Name'] || 'unknown', number: val});
            });
          }
        }

      });
      await User.bulkCreate(temp, {
        updateOnDuplicate: ['number']
      })
      event.returnValue = 'successful';
    }

  });
};
