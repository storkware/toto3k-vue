'use strict';

import fs from 'fs';
import path from 'path';
import decode from 'urldecode';
import PromisePool from 'es6-promise-pool';
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
  dir.promiseFiles(folderPath).then((files) => {
    let index = 0;
    // TODO: Manage more extensions properly with different metadata parsers.
    files = files.filter((f) => f.endsWith('.mp3'));
    const promiseProducer = function () {
      if (index < files.length) {
        const file = files[index];
        index++;
        return new Promise(function (resolve, reject) {
          let readableStream = fs.createReadStream(file);
          mm(readableStream, function (err, metadata) {
            if (err) {
              resolve();
              console.log(file, err);
              return;
            }
            data.push({ path: file, metadata: metadata });
            resolve();
            readableStream.close();
          });
        });
      } else {
        return null;
      }
    };

    var pool = new PromisePool(promiseProducer, 20);

    pool.start().then(() => {
      event.sender.send(constants.events.FILES_SCANNED, data);
    });
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
