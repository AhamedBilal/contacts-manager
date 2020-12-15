const {app, BrowserWindow, Menu, screen} = require('electron')
const path = require('path')

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');


function createWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    icon: `${__dirname}/dist/contacts-manager/assets/logo.ico`,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
      enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    }
  });
  win.setMenu(null)
  win.loadFile(`${__dirname}/dist/contacts-manager/index.html`);
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
require('./api/connect-db')();
require('./api/service/UserService')();

