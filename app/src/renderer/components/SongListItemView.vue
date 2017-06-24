<template>
  <div>
    <ul>
      <li v-for="datum in metadata" v-bind:key="datum">
        {{ datum }}
      </li>
      <li>
        <button @click="playFile()" type="button">Play</button>
      </li>
      <li>
        <button @click="pauseFile()" type="button">Pause</button>
      </li>
    </ul>
  </div>
</template>
<script>
import constants from '../../commons/constants';

export default {
  props: ['metadata', 'path'],
  methods: {
    playFile () {
      this.$emit(constants.events.PLAY_FILE, this.path);
    },
    pauseFile () {
      this.$emit(constants.events.PAUSE_FILE, this.path);
    }
  },
  name: 'song-list-item'
};
</script>
<style scoped>

</style>
