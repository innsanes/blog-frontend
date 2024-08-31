import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '../components/BlogList.vue'
import BlogView from '../components/Blog.vue'
import EditView from '../components/BlogEdit.vue'
import LoginView from '../components/Login.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/blog/edit/:id', component: EditView },
  { path: '/blog/:id', component: BlogView },
  { path: '/login', component: LoginView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router