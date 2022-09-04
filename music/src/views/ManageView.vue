<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <Upload ref="upload" :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-dark text-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <CompositionItems
              v-for="(song, i) in songs"
              :key="song.id" :song="song"
              :update="update"
              :index="i"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
            <!-- Composition item ends here -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import store from '@/store';
import Upload from '@/components/Upload.vue';
import { onAuthStateChanged, getAuth } from '@firebase/auth';
import {
  collection, query, where, getDocs,
} from 'firebase/firestore';
import { db } from '@/includes/firebase';
import CompositionItems from '../components/CompositionItems.vue';

export default {
  name: 'manage',
  created() {
    this.getSongs();
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  methods: {
    getSongs() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        const q = query(collection(db, 'songs'), where('uid', '==', user.uid));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          this.songs.push({ id: doc.id, ...doc.data() });
        });
      });
    },
    update(i, values) {
      this.songs[i].modified_name = values.song_name,
      this.songs[i].genre = values.song_genre;
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    addSong() {
      this.songs = [];
      this.getSongs();
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  components: { Upload, CompositionItems },
  beforeRouteLeave(to, from, next) {
    if (this.unsavedFlag === false) {
      this.$refs.upload.cancelUploads();
      next();
    } else {
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
      next(leave);
    }
  },
};
</script>

<style>

</style>
