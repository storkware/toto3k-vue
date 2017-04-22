<template>
  <div>
    <h1>Hello world!</h1>
    <form>
      <label>
        <span>Folder:</span>
        <input type="text" v-model="folder">
      </label>
      <button v-on:click="browseFolder()" type="button">Scan</button>
    </form>
    <ul>
      <li v-for="path in paths">
        {{ path }}
        <button v-on:click="playFile(path)" type="button">Play</button>
      </li>
    </ul>
  </div>
</template>

<script>
import os from 'os';
import constants from '../../commons/constants';
import { ipcRenderer } from 'electron';

export default {
  data () {
    return {
      paths: [],
      folder: os.homedir()
    };
  },
  created () {
    // Using => to keep proper reference to 'this'
    ipcRenderer.on(constants.events.FILES_SCANNED, (event, data) => {
      this.paths = data;
    });
  },
  methods: {
    browseFolder () {
      console.log('browsing', this.folder);
      ipcRenderer.send(constants.events.FOLDER_CHANGED, this.folder);
    },
    playFile (filePath) {
      console.log('play', filePath);
      ipcRenderer.send(constants.events.FILE_SELECTED, filePath);
    }
  },
  name: 'landing-page'
};
</script>

<style scoped>

</style>
