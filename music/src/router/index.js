import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/manage',
    alias: '/manage-music',
    meta: {
      requiresAuth: true
    },
    name: 'manage',
    component: () => import('../views/ManageView.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  } 

  if (store.state.userLoggedIn) {
    next();
  } else {
    next({ name: 'home' });
  }
})

export default router;
