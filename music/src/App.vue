<template>
  <app-header></app-header>
  <router-view />
  <auth-modal></auth-modal>
  <player />
</template>

<script>
import { mapState } from 'vuex';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import AppHeader from './components/Header.vue';
import AuthModal from './components/Auth.vue';
import Player from './components/Player.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AuthModal,
    Player,
  },
  computed: {
    ...mapState(['userLoggedIn']),
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.$store.dispatch('init_login');
      }
    });
  },
};
</script>

<style>
@import 'assets/styles/tailwind.postcss';
.bg-blue-600 {
  background-color: #0bce5a !important;
}
.text-blue-600 {
  color: #0bce5a;
}
.text-white-500, .text-white {
  color: #fff !important;
}
.song-duration {
  position: absolute;
  right: 10px;
}
/* .song-container {
  overflow-x: initial !important;
  overflow-y: hidden;
}
.song {
  overflow-x: auto !important;
} */
</style>
