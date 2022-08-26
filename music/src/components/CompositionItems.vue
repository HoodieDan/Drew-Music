<template>
    <div class="border border-gray-200 p-3 mb-4 rounded">
        <div v-show="!showForm">
            <h4 class="inline-block text-2xl font-bold w-80">{{ song.modified_name }}</h4>
            <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right" @click="deleteSong(song)">
                <i class="fa fa-times"></i>
            </button>
            <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right" @click="edit()">
                <i class="fa fa-pencil-alt"></i>
            </button>
        </div>
        <div v-show="showForm">
            <div class="text-white text-center font-bold p-4 mb-4"
                v-if="show_alert"
                :class="alert_variant"
            >
                {{ alert_message }}
            </div>
            <vee-form @submit="updateSong" :validation-schema="schema" :initial-values="song">
                <div class="mb-3">
                    <label class="inline-block mb-2">Song Title</label>
                    <vee-field type="text"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Song Title"
                        v-model="song.modified_name"
                        name="song_name" />
                    <ErrorMessage class="text-red-600" name="song_name" />
                </div>
                <div class="mb-3">
                    <label class="inline-block mb-2">Genre</label>
                    <vee-field type="text"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Genre"
                        v-model="song.genre"
                        name="song_genre" />
                    <ErrorMessage class="text-red-600" name="song_genre" />
                </div>
                <button type="submit"
                class="py-1.5 px-3 rounded text-white bg-green-600"
                :disabled="in_submission">
                    Submit
                </button>
                <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600"
                @click="showForm = false"
                :disabled="in_submission">
                    Go Back
                </button>
            </vee-form>
        </div>
    </div>
</template>

<script>
import { onAuthStateChanged, getAuth } from '@firebase/auth';
import {
  collection, query, where, getDocs, doc, updateDoc, deleteDoc,
} from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { db } from '@/includes/firebase';

export default {
  name: 'CompositionItems',
  props: {
    song: {
      type: Object,
      required: true,
    },
    update: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    }
  },
  data() {
    return {
      schema: {
        song_name: 'required',
        song_genre: 'required|alpha_spaces',
      },
      showForm: false,
      songInfo: {},
      userSongs: [],
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait! Updating song info...',
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
          this.userSongs.push({ id: doc.id, ...doc.data() });
        });
        console.log(this.userSongs);
      });
    },
    edit() {
      this.showForm = true;
    },
    async deleteSong(song) {
      const storage = getStorage();
      const songRef = ref(storage, `songs/${song.original_name}`);

      await deleteObject(songRef).then(async () => {
        await deleteDoc(doc(db, 'songs', song.id));
        this.removeSong(this.index)
        console.log('song deleted');
      }).catch((error) => {
        console.error(error);
      });
    },
    async updateSong(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = 'bg-blue-500';
      this.alert_message = 'Please wait! Updating song info...';
      const songRef = doc(db, 'songs', this.song.id);

      try {
        await updateDoc(songRef, {
          modified_name: values.song_name,
          genre: values.song_genre,
        });
      } catch (error) {
        console.error(error.code);
        this.in_submission = false;
        this.show_alert = true;
        this.alert_variant = 'bg-red-500';
        this.alert_message = 'Something went wrong! Try again later.';
        return;
      }

      this.update(this.index, values);

      this.in_submission = false;
      this.show_alert = true;
      this.alert_variant = 'bg-green-500';
      this.alert_message = 'Name Updated successfully!';
      // this.showForm = false;
    },
  },
};
</script>

<style>

</style>
