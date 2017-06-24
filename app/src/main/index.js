'use strict';

import fs from 'fs';
import path from 'path';
import decode from 'urldecode';
import constants from '../commons/constants';
import mm from 'musicmetadata';
import { app, BrowserWindow, ipcMain, protocol } from 'electron';
import dir from 'node-dir';

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`;

function scanFiles (event, folderPath) {
  let data = [];
  dir.readFiles(folderPath, (err, content, file, next) => {
    if (err) {
      console.log('error: ' + err);
      return;
    }
    // TODO: Manage more extensions properly with different metadata parsers.
    if (!file.endsWith('.mp3')) {
      return next();
    }
    let readableStream = fs.createReadStream(file);
    console.log(file);
    mm(readableStream, function (err, metadata) {
      if (err) {
        throw err;
      }
      data.push({ path: file, metadata: metadata });
      readableStream.close();
    });
    next();
  }, function (err, files) {
    if (err) {
      throw err;
    }
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
