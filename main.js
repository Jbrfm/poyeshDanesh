const { app, BrowserWindow } = require('electron');
const path = require('path');
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      icon:'./assets/logo/logo.png',
      nodeIntegration: true,
    },
  });

  mainWindow.maximize();

  // Load the Angular app from the dist folder
  mainWindow.loadFile(path.join(__dirname, 'dist/poyeshdanesh/index.html'));

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
