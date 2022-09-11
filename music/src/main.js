import { createApp } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeValidatePlugin from './includes/Validation';
import './includes/firebase';
import Icon from './directives/icon';
import './assets/main.css';
import './registerServiceWorker';
import GlobalComponents from './includes/_globals'
import progressBar from './includes/progress-bar';
import 'nprogress/nprogress.css';

progressBar(router);

const auth = getAuth();
let app;

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App);

    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(GlobalComponents);
    app.directive('icon', Icon);

    app.mount('#app');
  }
});
