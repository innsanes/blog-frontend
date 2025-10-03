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
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（浏览器前进/后退），则恢复到该位置
    if (savedPosition) {
      return savedPosition
    }
    // 否则滚动到页面顶部
    return { top: 0 }
  }
})

export default router