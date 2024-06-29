import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/movie-details/:id',
      name: 'movie-details',
      component: () => import('../views/MovieDetailsView.vue')
    }
  ]
});

export default router;
