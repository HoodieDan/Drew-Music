import { createStore } from 'vuex';
import {
  getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/includes/firebase';

const auth = getAuth();
const user = auth.currentUser;

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
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
    loggedOut(state) {

    },
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
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

      updateProfile(user, {
        displayName: payload.name,
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
    async signOut({ commit }) {
      await auth.signOut();

      commit('toggleAuth');
    },
  },
});
