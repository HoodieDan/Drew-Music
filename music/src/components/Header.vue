<template>
  <!-- Header -->
  <header id="header">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link to="/" class="drew-music text-white font-bold text-2xl mr-4 head-font" href="#">
        Drew Music
      </router-link>

      <div class="flex flex-grow items-center primary-nav">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link to="/about" class="px-2 text-white" :class="{ 'text-green': route === 'about' }" href="#">About</router-link>
          </li>
          <li v-if="!userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">
            Login / Register
            </a>
          </li>
          <template v-else>
            <li>
              <router-link to="/manage" class="px-2 text-white" :class="{ 'text-green': route === 'manage' }" href="#">Manage</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="signOut">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'HeaderComp',
  methods: {
    ...mapMutations(['toggleAuthModal']),
    signOut() {
      this.$store.dispatch('signOut');

      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: 'home' })
      }
    },
  },
  computed: {
    ...mapState(['userLoggedIn']),
    route() {
      return this.$route.name;
    },
  },
};
</script>

<style>
div.primary-nav {
  justify-content: flex-end;
}
a:hover {
  color: #0bce5a !important;
}
</style>
