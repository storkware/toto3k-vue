'use strict';

import fs from 'fs';
import constants from '../commons/constants';
import { app, BrowserWindow, ipcMain } from 'electron';

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`;

function scanFiles (event, path) {
  fs.readdir(path, function (err, data) {
    if (err) {
      console.log('error: ' + err);
      return;
    }
    console.log(data);
    event.sender.send(constants.events.FILES_SCANNED, data);
  });
}

function playFile (event, path) {
  console.log("should play", path);
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

  mainWindow.webContents.on('did-finish-load', function () {
    ipcMain.on(constants.events.FOLDER_CHANGED, scanFiles);
    ipcMain.on(constants.events.FILE_SELECTED, playFile);
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
