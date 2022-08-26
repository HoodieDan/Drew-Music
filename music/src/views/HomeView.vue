<template>
    <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative main-header-content">
    <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5 head-font">Listen to Great Music!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Phasellus et dolor mollis, congue augue non, venenatis elit.
          Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
          sapien. Duis sed magna pulvinar, fringilla lorem eget,
          ullamcorper urna.
        </p>
      </div>
    </div>
  </section>

  <!-- Main Content -->
  <section class="container mx-auto main">
    <div class="bg-dark rounded border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title text-blue-600">Songs</span>
        <!-- Icon -->
        <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <SongItem v-for="song in songs" :key="song.docID" :song="song" />
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>

</template>

<script>
import SongItem from "../components/SongItem.vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from '@/includes/firebase';

  export default {
    name: "HomeView",
    data() {
        return {
            songs: []
        };
    },
    async created() {
        const snapshots = await getDocs(collection(db, "songs"));
        snapshots.forEach((doc) => {
            this.songs.push({
                "docID": doc.id,
                ...doc.data()
            });
            console.log(doc.id, " => ", doc.data());
        });
    },
    components: { SongItem }
}
</script>
