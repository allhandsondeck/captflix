import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/show-details',
      name: 'show-details',
      // route level code-splitting
      // this generates a separate chunk (ShowDetails.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ShowDetailsView.vue')
    }
  ]
})

export default router
