<template>
  <div class="bg-dark text-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Upload</span>
        <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
        <!-- Upload Dropbox -->
        <div
            class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
            border-gray-400 text-gray-400 transition duration-500 hover:text-white
            hover:bg-green-400 hover:border-green-400 hover:border-solid"
            :class="{ 'bg-green-400 border-green-400 border-solid': isDraggedOver }"
            @drag.prevent.stop=""
            @dragstart.prevent.stop=""
            @dragend.prevent.stop="isDraggedOver = false"
            @dragover.prevent.stop="isDraggedOver = true"
            @dragenter.prevent.stop="isDraggedOver = true"
            @dragleave.prevent.stop="isDraggedOver = false"
            @drop.prevent.stop="upload($event)">
            <h5>Drop your files here</h5>
        </div>
        <label for="file">Music Upload</label>
        <input name="file" type="file" multiple @change="upload($event)" />
        <hr class="my-6" />
        <!-- Progess Bars -->
        <div class="mb-4" v-for="upload in uploads" :key="upload.name">
            <!-- File Name -->
            <div class="font-bold text-sm" :class="upload.text_class">
                <i :class="upload.icon"></i> {{ upload.name }}
            </div>
            <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
            <!-- Inner Progress Bar -->
            <div class="transition-all progress-bar bg-blue-400"
                :style="{ width: upload.current_progress + '%' }"
                :class="upload.variant"></div>
            </div>
            <p class="text-red-400" v-if="upload.error_message">{{ upload.error_message }}</p>
        </div>
    </div>
  </div>
</template>

<script>
import { storage, db } from '@/includes/firebase';
import { addDoc, collection } from '@firebase/firestore';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export default {
  name: 'UploadFiles',
  data() {
    return {
      isDraggedOver: false,
      songURL: '',
      uploads: [],
    };
  },
  props: ['addSong'],
  methods: {
    upload($event) {
      this.isDraggedOver = false;

      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files];

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          return;
        }

        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: file.name,
            variant: 'bg-red-400',
            icon: 'fas fa-times',
            text_class: 'text-red-400',
          })
          return;
        }
        // console.log(file)
        const storageRef = ref(storage, `songs/${file.name}`);

        const task = uploadBytesResumable(storageRef, file);
        // getDownloadURL(ref(storage, `songs/${file.name}`)).then((downloadURL) => {
        //       this.songURL = downloadURL;
        //   });
        const uploadIndex = this.uploads.push({
          task,
          current_progress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: '',
          error_message: '',
        }) - 1;
        task.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploads[uploadIndex].current_progress = progress;
        }, (error) => {
          this.uploads[uploadIndex].variant = 'bg-red-400';
          this.uploads[uploadIndex].icon = 'fas fa-times';
          this.uploads[uploadIndex].text_class = 'text-red-400';
          if (error.code === 'storage/unauthorized') {
            this.uploads[uploadIndex].error_message = 'Please upload file less than 10mb.';
          }
        }, async () => {
          const auth = getAuth();
          onAuthStateChanged(auth, (user) => {
            const song = {
              uid: user.uid,
              display_name: user.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: '',
              comment_count: 0,
              url: '',
            };

            getDownloadURL(ref(storage, `songs/${file.name}`)).then(async (downloadURL) => {
              song.url = downloadURL;

              await addDoc(collection(db, 'songs'), song);
            });
            this.addSong();
          });

          this.uploads[uploadIndex].variant = 'bg-green-400';
          this.uploads[uploadIndex].icon = 'fas fa-check';
          this.uploads[uploadIndex].text_class = 'text-green-400';
        });
      });
    },
    cancelUploads() {
      this.uploads.forEach((upload) => {
        upload.task.cancel();
      });
    },
  },
};
</script>

<style>

</style>
