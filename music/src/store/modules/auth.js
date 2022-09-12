import {
    getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword,
    onAuthStateChanged,
  } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/includes/firebase';

const auth = getAuth();

export default {
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  getters: {

  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn;
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
  }
}