import { createStore } from 'vuex';
import {
  getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, onAuthStateChanged,
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/includes/firebase';
import { Howl } from 'howler';
import helper from '@/includes/helper';

const auth = getAuth();

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    songPosition: 0,
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },
    loggedIn(state) {
      state.userLoggedIn = true;
    },
    newSong(state, payload) {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
      state.songPosition = (state.sound.seek() / state.sound.duration()) * 100;
    },
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
    },
  },
  actions: {
    async register({ commit }, payload) {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password,
      );

      await setDoc(doc(db, 'users', userCred.user.uid), {
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
      });

      onAuthStateChanged(auth, (user) => {
        updateProfile(user, {
          displayName: payload.name,
        }).then(() => {
          console.log('Profile Updated');
        }).catch((error) => {
          console.log(error.code);
        });
      });

      commit('toggleAuth');
    },
    init_login({ commit }) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          commit('toggleAuth');
        }
      });
    },
    async login({ commit }, payload) {
      await signInWithEmailAndPassword(auth, payload.email, payload.password);

      commit('toggleAuth');
    },
    async signOut({ commit }, payload) {
      await auth.signOut();

      commit('toggleAuth');

      if (payload.route.meta.requiresAuth) {
        payload.router.push({ name: 'home' });
      }
    },
    async newSong({ commit, state, dispatch }, payload) {
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }
      commit('newSong', payload);

      state.sound.play();

      state.sound.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      });
    },
    async toggleAudio({ state }) {
      if (!state.sound.playing) {
        return;
      }

      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    progress({ commit, state, dispatch }) {
      commit('updatePosition');

      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
    updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) {
        return;
      }

      const { x, width } = payload.currentTarget.getBoundingClientRect();
      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;

      state.sound.seek(seconds);

      state.sound.once('seek', () => {
        dispatch('progress');
      });
    },
  },
});
