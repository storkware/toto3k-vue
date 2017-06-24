'use strict';

import path from 'path';
import decode from 'urldecode';
import constants from '../commons/constants';
import id3 from 'node-id3';
import { app, BrowserWindow, ipcMain, protocol } from 'electron';
import dir from 'node-dir';

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`;

function scanFiles (event, folderPath) {
  dir.files(folderPath, 'file', (err, files) => {
    if (err) {
      console.log('error: ' + err);
      return;
    }
    console.log(files);
    // TODO: Manage more extensions properly with different metadata parsers.
    files = files.filter((file) => file.endsWith('.mp3'));
    let data = [];
    files.forEach((file) => {
      // Synchronous call...
      data.push({ path: file, metadata: id3.read(file) });
      // ffmetadata.read(file, function (err, metadata) {
      //   if (err) {
      //     console.error('Error reading metadata', err);
      //     return;
      //   }
      //   console.log(metadata);
      //   data.push({ path: file, metadata: metadata });
      //   if (data.length === files.length) {
      //     event.sender.send(constants.events.FILES_SCANNED, data);
      //   }
      // });
    });
    console.log(data);
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
    callback({ path: path.normalize(`${url}`) });
  }, (error) => {
    if (error) {
      console.error('Failed to register protocol');
    }
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
