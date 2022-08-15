<template>
<vee-form
    @submit="login" :validation-schema="loginSchema">
    <div class="text-white text-center font-bold p-4 mb-4" v-if="login_show_alert"
    :class="login_alert_variant">
    {{ login_alert_message }}
    </div>
    <!-- Email -->
    <div class="mb-3">
        <label for="email" class="inline-block mb-2">Email</label>
        <vee-field type="email" name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email" />
        <ErrorMessage class="text-red-600" name="email"></ErrorMessage>
    </div>
    <!-- Password -->
    <div class="mb-3">
        <label for="password" class="inline-block mb-2">Password</label>
        <vee-field type="password" name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password" />
        <ErrorMessage class="text-red-600" name="password"></ErrorMessage>
    </div>
    <button type="submit" :disabled="login_in_submission"
        class="block w-full bg-blue-600 text-white py-1.5 px-3 rounded transition
        hover:bg-blue-600">
        Submit
    </button>
</vee-form>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';

export default {
  name: 'LoginForm',
  data() {
    return {
      loginSchema: {
        email: 'required|min:11|max:100|email',
        password: 'required|min:8|max:30',
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: 'bg-blue-500',
      login_alert_message: 'Please wait! We are logging you in.',
    };
  },
  methods: {
    async login(values) {
      this.login_in_submission = true;
      this.login_show_alert = true;
      this.login_alert_variant = 'bg-blue-500';
      this.login_alert_message = 'Please wait! We are logging you in.';
      try {
        await this.$store.dispatch('login', values)
      } catch (error) {
        this.login_in_submission = false;
        this.login_alert_variant = 'bg-red-500';

        console.error(error);
        const errorCode = error.code;

        if (errorCode === 'auth/invalid-email') {
          this.login_alert_message = 'Invalid Email Address entered';
        } else if (errorCode === 'auth/user-not-found') {
          this.login_alert_message = 'Login failed! User not found';
        } else if (errorCode === 'auth/wrong-password') {
          this.login_alert_message = 'Password is incorrect';
        } else {
          this.login_alert_message = 'Something went wrong. Please try again later.';
        }
        return;
      }
      this.login_alert_variant = 'bg-green-500';
      this.login_alert_message = 'Success, you are now logged in.';

      window.location.reload();
    },
  },
};
</script>

<style>
.bg-blue-600 {
  background-color: #0bce5a !important;
}
</style>
