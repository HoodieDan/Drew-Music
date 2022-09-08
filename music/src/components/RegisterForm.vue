<template>
  <vee-form :validation-schema="schema"
    @submit="register" :initial-values="userData">
    <div class="text-white text-center, font-bold p-5 mb-4"
    v-if="reg_show_alert" :class="reg_alert_variant">
    {{ reg_alert_message }}
    </div>
    <!-- Name -->
    <div class="mb-3">
      // eslint-disable-next-line
        <label for="name" class="inline-block mb-2">Name</label>
        <vee-field as="input" type="text" name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name" />
        <ErrorMessage class="text-red-600" name="name"></ErrorMessage>
    </div>
    <!-- Email -->
    <div class="mb-3">
        <label for="email" class="inline-block mb-2">Email</label>
        <vee-field as="input" type="email" name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email" />
        <ErrorMessage class="text-red-600" name="email"></ErrorMessage>
    </div>
    <!-- Age -->
    <div class="mb-3">
        <label for="age" class="inline-block mb-2">Age</label>
        <vee-field type="number" name="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded" />
        <ErrorMessage class="text-red-600" name="age"></ErrorMessage>
    </div>
    <!-- Password -->
    <div class="mb-3">
        <label for="password" class="inline-block mb-2">Password</label>
        <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input type="password" class="block w-full py-1.5 px-3 text-gray-800 border
        border-gray-300 transition duration-500 focus:outline-none focus:border-black
        rounded" placeholder="Password" v-bind="field" />
        <div class="text-red-600" v-for="error in errors" :key="error">
        {{ error }}
        </div>
        </vee-field>
        <ErrorMessage class="text-red-600" name="password"></ErrorMessage>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
        <label for="confirm_password" class="inline-block mb-2">Confirm Password</label>
        <vee-field type="password" name="confirm_password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password" />
        <ErrorMessage class="text-red-600" name="confirm_password"></ErrorMessage>
    </div>
    <!-- Country -->
    <div class="mb-3">
        <label for="country" class="inline-block mb-2">Country</label>
        <vee-field as="select" name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded">
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Nigeria">Nigeria</option>
        <option value="England">England</option>
        <option value="Russia">Russia</option>
        </vee-field>
        <ErrorMessage class="text-red-600" name="country"></ErrorMessage>
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
        <vee-field type="checkbox" name="tos" value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
        <label for="tos" class="inline-block">Accept terms of service</label>
        <ErrorMessage class="text-red-600" name="tos"></ErrorMessage>
    </div>
    <button type="submit" :disabled="reg_in_submission"
        class="block w-full bg-blue-600 text-white py-1.5 px-3 rounded transition
        hover:bg-blue-700">
        Submit
    </button>
  </vee-form>
</template>

<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:11|max:100|email',
        age: 'required|min_value:8|max_value:120',
        password: 'required|alpha_num|min:8|max:30',
        confirm_password: 'passwords_mismatch:@password',
        country: 'required|country_excluded:Russia',
        tos: 'tos',
      },
      userData: {
        country: 'Nigeria',
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_message: 'Please wait! Your account is being created.',
    };
  },
  methods: {
    async register(values) {
      this.reg_show_alert = true;
      this.reg_in_submission = true;
      this.reg_alert_variant = 'bg-blue-500';
      this.reg_alert_message = 'Please wait! Your account is being created.';

      try {
        await this.$store.dispatch('register', values);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = 'bg-red-500';

        const errorCode = error.code;

        if (errorCode === 'auth/weak-password') {
          this.reg_alert_message = 'The password entered is not strong enough.';
        } else if (errorCode === 'auth/email-already-in-use') {
          this.reg_alert_message = 'The email entered is already in use';
        } else {
          this.reg_alert_message = 'An unexpected error occured. Plese try again later';
        }
        return;
      }

      this.reg_alert_variant = 'bg-green-500';
      this.reg_alert_message = 'Success! Your account has been created';

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
