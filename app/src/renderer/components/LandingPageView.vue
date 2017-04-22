<template>
  <div>
    <h1>Hello world!</h1>
    <form>
      <label>
        <span>Folder:</span>
        <input type="text" v-model="folder">
      </label>
      <button v-on:click="browseFolder" type="button">Scan</button>
    </form>
    <ul>
      <li v-for="path in paths">
        {{ path }}
      </li>
    </ul>
  </div>
</template>

<script>
import os from 'os';
import { ipcRenderer } from 'electron';

export default {
  data () {
    return {
      paths: [],
      folder: os.homedir()
    };
  },
  created () {
    ipcRenderer.on('files-scanned', (event, data) => {
      this.paths = data;
    });
  },
  methods: {
    browseFolder () {
      ipcRenderer.send('folder-changed', this.folder);
    }
  },
  name: 'landing-page'
};
</script>

<style scoped>

</style>
