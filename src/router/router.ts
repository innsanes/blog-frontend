import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../components/BlogList.vue'
import BlogView from '../components/Blog.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/blog/:id', component: BlogView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router