import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../components/BlogList.vue'
import BlogSearch from '../components/BlogSearch.vue'

const routes = [
  { path: '/', component: HomeView },
  { 
    path: '/blog/:id', 
    component: () => import('../components/Blog.vue')
  },
  { path: '/search', component: BlogSearch },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router