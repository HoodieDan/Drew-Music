import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeValidatePlugin from './includes/Validation';
import './includes/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import './assets/main.css';

const auth = getAuth();
let app;

onAuthStateChanged(auth, () => {
    if (!app) {
        app = createApp(App);

        app.use(store);
        app.use(router);
        app.use(VeeValidatePlugin);

        app.mount('#app');

    }
});
