<template>
    <div class="blog">
        <h1>{{ blogStore.blogName }}</h1>
        <p class="author">Innsane</p>
        <div class="edit-link">
            <RouterLink v-if="userStore.token != ''" :to="getBlogEditRouter()">
                Edit
            </RouterLink>
        </div>
        <el-divider />
        <MarkdownPreview :mdContent="blogStore.content" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { fetchBlog } from '../api/blog'
import { useBlogStore } from '../stores/blog';
import { useUserStore } from '../stores/user'
import MarkdownPreview from './MarkdownPreview.vue'

const userStore = useUserStore()
const blogStore = useBlogStore()
// const blog = ref({ id: 0, name: '', content: '' })
const route = useRoute()

const getBlogEditRouter = function (id: number) {
    // blogStore.blogId = id
    // blogStore.blogName = blog.value.name
    // blogStore.blogContent = blog.value.content
    return '/blog/edit/' + blogStore.blogId
}

const getBlog = async (id: number) => {
    try {
        const response = await fetchBlog(id)
        blogStore.blogName = response.name
        blogStore.blogContent = response.content
    } catch (error) {
        console.error('Failed to fetch blog:', error)
    }
}

onMounted(() => {
    const blogId = Number(route.params.id)
    if (blogId !== 0) {
        blogStore.blogId = blogId
        getBlog(blogId as number)
    }
})
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
  text-align: center;
}

.author {
  color: #888;
  margin-bottom: 20px;
  text-align: right;
}

.blog {
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding: 20px;
}
.edit-link {
    text-align: right;
}
</style>