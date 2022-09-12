<template>
  <main>
      <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative main-header-content">
      <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5 head-font">Listen to Great Music!</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Drew Music is a music web application where you can upload,
            listen to and share your favourite songs with all your friends.
            Enjoy and make sure you share with your friends!
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="container mx-auto main">
      <div class="bg-dark rounded border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
        v-icon.right.green="'headphones-alt'">
          <span class="card-title text-blue-600">Songs</span>
          <!-- Icon -->

        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <SongItem v-for="song in songs" :key="song.docID" :song="song" />
        </ol>
        <WaveLoader v-show="loading" />
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>

</template>

<script>
import {
  collection, getDocs, doc, orderBy, limit, query, startAfter, getDoc,
} from 'firebase/firestore';
import { db } from '@/includes/firebase';
import WaveLoader from '@/components/WaveLoader.vue';
import SongItem from '../components/SongItem.vue';

export default {
  name: 'HomeView',
  data() {
    return {
      songs: [],
      maxPerPage: 25,
      pendingRequest: false,
      loading: true,
    };
  },
  async created() {
    this.getSongs();

    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    // get songs from the database in alphabetical order
    async getSongs() {
      if (this.pendingRequest) {
        return;
      }

      this.pendingRequest = true;
      let snapshots;
      if (this.songs.length) {
        const last = doc(db, 'songs', this.songs[this.songs.length - 1].docID);
        const lastDocument = await getDoc(last);
        const q = query(
          collection(db, 'songs'),
          orderBy('modified_name'),
          startAfter(lastDocument),
          limit(this.maxPerPage),
        );

        snapshots = await getDocs(q);
      } else {
        const q = query(
          collection(db, 'songs'),
          orderBy('modified_name'),
          limit(this.maxPerPage),
        );

        snapshots = await getDocs(q);
      }
      if (snapshots) {
        this.loading = false;
      }
      snapshots.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data(),
        });
      });
      // lastDocument = snapshots[snapshots.length - 1];
      // console.log(lastDocument)
      this.pendingRequest = false;
    },
    // function to handle infinite scroll
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomOfWindow) {
        this.getSongs();
      }
    },
  },
  components: { SongItem, WaveLoader },
};
</script>
