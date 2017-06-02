<template>
  <div>
    <h1>Hello world!</h1>
    <form>
      <label>
        <span>Folder:</span>
        <input type="text" v-model="folder">
      </label>
      <button v-on:click="scanFolder()" type="button">Scan</button>
    </form>
    <ul>
      <li v-for="path in paths">
        {{ path }}
        <button v-on:click="playFile(path)" type="button">Play</button>
      </li>
    </ul>
    <audio id="audio"></audio>
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
    ipcRenderer.on(constants.events.FILE_TO_PLAY, (event, data) => {
      let audio = document.getElementById('audio');
      audio.autoplay = true;
      audio.src = constants.protocol.PROTOCOL_WITH_SLASHES + data;
      audio.volume = 0.2;
    });
  },
  methods: {
    scanFolder () {
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
