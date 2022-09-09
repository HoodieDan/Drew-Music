<template>
    <!-- Player -->
  <div class="bg-dark fixed bottom-0 left-0 bg-white p-5 pb-4 text-left align-top w-full h-16">
    <div class="relative">
      <!-- Play/Pause Button -->
      <div class="float-left w-10 h-10 leading-3">
        <button type="button"
          @click.prevent="toggleAudio"
          class="w-full h-full"
          @keydown="pause()">
          <i class="fa text-white-500 text-xl"
          :class="{ 'fa-play': !playing, 'fa-pause': 'playing' }"></i>
        </button>
      </div>
      <!-- Current Position -->
      <div class="float-left w-7 h-7 leading-3 text-white-400 mt-0 text-lg w-14 ml-5 mt-3">
        <span class="player-currenttime text-white">{{ seek }}</span>
      </div>
      <!-- Scrub -->
      <div class="float-left w-7 h-7 leading-3 ml-7 mt-2 player-scrub">
        <div
          class="absolute left-0 right-0 text-lg text-center mx-auto player-song-info text-blue-600"
          v-if="currentSong.modified_name">
          <div class="c text-center mx-auto">
            <p class="song-title text-white">{{ currentSong.modified_name }} 
              <span class="text-blue-600">Uploaded by</span> 
              {{ currentSong.display_name }}
            </p>
          </div>
        </div>
        <!-- Scrub Container  -->
        <span
          class="block w-full h-2 rounded m-1 mt-2 bg-gray-200 relative cursor-pointer"
          @click.prevent="updateSeek"
          @keydown="seekOut">
          <!-- Player Ball -->
          <span
            class="absolute top-neg-8  text-white text-lg"
            :style="{ left: songPosition - 1 +'%' }">
              <i class="fas fa-circle"></i>
          </span>
          <!-- Player Progress Bar-->
          <span class="block h-2 rounded bg-gradient-to-r bg-blue-600"
            :style="{ width: songPosition +'%' }"></span>
        </span>
      </div>
      <!-- Duration -->
      <div class="float-left w-7 h-7 leading-3  text-white mt-0 text-lg w-14 song-duration mt-3">
        <span class="player-duration">{{ duration }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'PlayerComponent',
  data() {
    return {
      seeked: '',
    };
  },
  methods: {
    ...mapActions(['toggleAudio', 'updateSeek']),
    pause(event) {
      if (event.key === '') {
        this.toggleAudio();
      }
    },
    seekOut(event) {
      this.seeked = event.key;
    },
  },
  computed: {
    ...mapGetters(['playing']),
    ...mapState(['seek', 'duration', 'currentSong', 'songPosition']),
  },
};
</script>

<style scoped>
/* .song-container{
  overflow-x: initial !important;
  overflow-y: hidden;
} */
/* .song {
  overflow-x: auto;
} */
</style>
