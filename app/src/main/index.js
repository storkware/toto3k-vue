'use strict';

import fs from 'fs';
import path from 'path';
import decode from 'urldecode';
import constants from '../commons/constants';
import { app, BrowserWindow, ipcMain, protocol } from 'electron';

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`;

function scanFiles (event, folderPath) {
  fs.readdir(folderPath, function (err, data) {
    if (err) {
      console.log('error: ' + err);
      return;
    }
    console.log(data);
    data = data.map(filename => path.join(folderPath, filename));
    event.sender.send(constants.events.FILES_SCANNED, data);
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

  mainWindow.webContents.on('did-finish-load', function () {
    ipcMain.on(constants.events.FOLDER_CHANGED, scanFiles);
  });

  protocol.registerFileProtocol(constants.protocol.PROTOCOL, (request, callback) => {
    // Decode URLs as they might contain some weird characters (encoded by Chrome automatically).
    const url = decode(request.url.substr(constants.protocol.PROTOCOL_WITH_SLASHES.length));
    callback({path: path.normalize(`${url}`)});
  }, (error) => {
    if (error) console.error('Failed to register protocol');
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
