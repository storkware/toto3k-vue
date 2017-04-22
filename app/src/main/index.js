'use strict';

import fs from 'fs';
import { app, BrowserWindow, ipcMain } from 'electron';

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`;

function readFolder (event, path) {
  fs.readdir(path, (err, data) => {
    if (err) {
      console.log('error: ' + err);
      return;
    }
    console.log(data);
    mainWindow.webContents.send('files-scanned', data);
  });
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.webContents.on('did-finish-load', () => {
    ipcMain.on('folder-changed', readFolder);
  });
  // eslint-disable-next-line no-console
  console.log('mainWindow opened');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
