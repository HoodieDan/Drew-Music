<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)">
      </div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
          focus:outline-none" @click.prevent="newSong(song)">
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="text-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comments ({{ song.comment_count }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div class="text-white text-center font-bold p-4 mb-4" v-if="comment_show_alert"
           :class="comment_alert_variant">
            {{ comment_alert_message }}
          </div>
          <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
            <vee-field as="textarea" name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."></vee-field>
            <ErrorMessage class="text-red-600" name="comment" />
            <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block mb-4"
             :disabled="comment_in_submission">
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <label for="sort">Sort comments from:</label>
          <select v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded">
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li class="p-6 text-white border border-gray-200"
       v-for="comment in sortedComments"
        :key="comment.docID">
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>- {{ comment.content }}</p>
      </li>
    </ul>
  </main>
</template>

<script>
import { db, commentsCollection } from '@/includes/firebase';
import { onAuthStateChanged, getAuth } from '@firebase/auth';
import {
  addDoc, doc, getDoc, query, where, getDocs, updateDoc, increment,
} from 'firebase/firestore';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'SongView',
  data() {
    return {
      song: {},
      schema: {
        comment: 'required|min:3',
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Please wait! Your comment is being submitted.',
      comments: [],
      sort: '1',
    };
  },
  methods: {
    ...mapActions(['newSong']),
    addComment(values, { resetForm }) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = 'bg-blue-500';
      this.comment_alert_message = 'Please Wait! Your comment is being submitted';

      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        const comment = {
          content: values.comment,
          datePosted: new Date().toString(),
          sid: this.$route.params.id,
          name: user.displayName,
          uid: user.uid,
        };

        await addDoc(commentsCollection, comment);

        this.song.comment_count += 1;
        await updateDoc(doc(db, 'songs', this.$route.params.id), {
          comment_count: increment(1),
        });

        this.getComments();

        this.comment_in_submission = false;
        this.comment_alert_variant = 'bg-green-500';
        this.comment_alert_message = 'Comment added!';

        resetForm();
      });
    },
    async getComments() {
      this.comments = [];
      const q = query(commentsCollection, where('sid', '==', this.$route.params.id));

      const snapshot = await getDocs(q);

      this.comment = [];
      snapshot.forEach((document) => {
        this.comments.push({
          docID: document.id,
          ...document.data(),
        });
      });
    },
  },
  computed: {
    ...mapState({
      userLoggedIn: (state) => state.auth.userLoggedIn,
    }),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }

        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  async beforeRouteEnter(to, from, next) {
    const docRef = doc(db, 'songs', to.params.id);
    const docSnapshot = await getDoc(docRef);

    next((vm) => {
      if (!docSnapshot.exists()) {
        vm.$router.push({ name: 'home' });
        return;
      }

      const { sort } = vm.$route.query;
      vm.sort = sort === '1' || sort === '2' ? sort : '1';

      vm.song = docSnapshot.data();

      vm.getComments();
    });

  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }

      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
};
</script>

<style>

</style>
