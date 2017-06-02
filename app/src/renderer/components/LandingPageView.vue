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
        <button v-on:click="pauseFile(path)" type="button">Pause</button>
      </li>
    </ul>
    <audio id="audio"></audio>
  </div>
</template>

<script>
// import os from 'os';
import constants from '../../commons/constants';
import { ipcRenderer } from 'electron';

export default {
  data () {
    return {
      paths: [],
      folder: "/Users/chris/Music/iTunes/iTunes Media/Music/Sharon Van Etten/I Don't Want to Let You Down" // os.homedir()
    };
  },
  created () {
    // Using => to keep proper reference to 'this'
    ipcRenderer.on(constants.events.FILES_SCANNED, (event, data) => {
      this.paths = data;
    });
    ipcRenderer.on(constants.events.FILE_TO_PLAY, (event, data) => {
      let audio = document.getElementById('audio');
      let src = constants.protocol.PROTOCOL_WITH_SLASHES + data;

      audio.autoplay = true;
      audio.volume = 0.2;

      if (src !== audio.src) {
        audio.src = src;
      } else {
        audio.play();
      }
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
    },
    pauseFile (filePath) {
      console.log('pause', filePath);
      let audio = document.getElementById('audio');
      audio.pause();
    }
  },
  name: 'landing-page'
};
</script>

<style scoped>

</style>
