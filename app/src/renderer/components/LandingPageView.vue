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
      <li v-for="song in songs" v-bind:key="song">
        <song-list-item
          :metadata="song.metadata"
          :columns="columns"
          :path="song.path"
          @play-file="playFile($event)"
          @pause-file="pauseFile($event)">
        </song-list-item>
      </li>
    </ul>
    <audio id="audio"></audio>
  </div>
</template>

<script>
// import os from 'os';
import constants from '../../commons/constants';
import { ipcRenderer } from 'electron';
import SongListItemView from 'components/SongListItemView';

export default {
  components: { 'song-list-item': SongListItemView },
  data () {
    return {
      columns: ['title', 'artist', 'album'],
      songs: [],
      // FIXME: folder: 'D:\\Music\\Occident' or os.homedir()
      folder: '/Users/chris/Music/iTunes/iTunes Media/Music' // os.homedir()
    };
  },
  created () {
    // Using => to keep proper reference to 'this'
    ipcRenderer.on(constants.events.FILES_SCANNED, (event, data) => {
      debugger;
      this.songs = data;
    });
  },
  methods: {
    scanFolder () {
      console.log('browsing', this.folder);
      ipcRenderer.send(constants.events.FOLDER_CHANGED, this.folder);
    },
    playFile (filePath) {
      console.log('play', filePath);
      let audio = document.getElementById('audio');
      let src = constants.protocol.PROTOCOL_WITH_SLASHES + filePath;

      audio.autoplay = true;
      audio.volume = 0.2;

      if (src !== audio.src) {
        audio.src = src;
      } else {
        audio.play();
      }
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
