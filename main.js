const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: `${__dirname}/dist/contacts-manager/assets/logo.ico`,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
      enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    }
  })

  if (serve) {
    console.log('served')
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.setMenu(null)
    win.loadURL(`file://${__dirname}/dist/contacts-manager/index.html`);
  }
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

