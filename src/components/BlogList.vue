<template>
  <div>
    <h1>BlogList</h1>
    <RouterLink to="/blog/edit/0">Create New Blog</RouterLink>
    <ul>
      <li v-for="blog in blogs" :key="blog.id">
        <RouterLink :to="blogRouter(blog.id)">{{ blog.name }}</RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { bloglist } from '../api/blog'

const blogs = ref([])

const blogRouter = function (id: number) {
  return '/blog/' + id
}

const fetchBlogs = async () => {
  try {
    const response = await bloglist()
    blogs.value = response
  } catch (error) {
    console.error('Failed to fetch blogs:', error)
  }
}

onMounted(() => {
  fetchBlogs()
})
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 20px;
}

h2 {
  margin: 0;
}

p {
  margin: 5px 0 0;
}
</style>