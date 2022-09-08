<template>
 <!-- Auth Modal -->
  <div class="fixed z-10 inset-0 overflow-y-auto"
  :class="{ hidden: !authModalShow }" id="modal">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center
      sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-dark opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div class="text-white bg-dark modal inline-block align-bottom
        bg-white rounded-lg text-left overflow-hidden
        shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">

        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-orange text-2xl font-bold">Your Account</p>
            <!-- Modal Close Button -->
            <div class="modal-close cursor-pointer z-50">
              <i class="fas fa-times" @click.prevent="toggleAuthModal" @keydown="openModal"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a class="block rounded py-3 px-4 transition"
              :class="{ 'hover:text-white text-white bg-blue-600': tab ==='login',
              'hover:green': tab === 'register' }"
              @click.prevent="tab = 'login'"
              href="#">Login</a>
            </li>
            <li class="flex-auto text-center">
              <a class="block rounded py-3 px-4 transition"
              :class="{ 'hover:text-white text-white bg-blue-600': tab === 'register',
              'hover:green': tab === 'login' }"
              @click.prevent="tab = 'register'"
                href="#">Register</a>
            </li>
          </ul>

          <LoginForm v-if="tab === 'login'"></LoginForm>
          <RegisterForm v-else></RegisterForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';

export default {
  name: 'AuthModal',
  data() {
    return {
      tab: 'login',
    };
  },
  computed: {
    ...mapState(['authModalShow']),
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),
    openModal(event) {
      if (event.key === 'a') {
        this.toggleAuthModal();
      }
    },
  },
  components: { LoginForm, RegisterForm },
};
</script>

<style>
.bg-blue-600 {
  background-color: #0bce5a;
}
.green {
  color: #0bce5a !important;
}
.modal {
  border: #fff 1px solid;
}
</style>
