import { createRouter, createWebHistory } from 'vue-router';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(
  qiankunWindow.__POWERED_BY_QIANKUN__
      ? '/sub-app-2/'
      : '/'
  ),
  routes,
});

export default router;