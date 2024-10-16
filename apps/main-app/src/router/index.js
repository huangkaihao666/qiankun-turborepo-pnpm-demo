import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/sub-app-1',
    name: 'SubApp1',
    component: () => import('../views/SubApp1View.vue'),
  },
  {
    path: '/sub-app-2',
    name: 'SubApp2',
    component: () => import('../views/SubApp2View.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;