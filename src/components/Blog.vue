<template>
    <div>
        <h1>{{ blog.name }}</h1>
        <RouterLink :to='getBlogEditRouter(blog.id)'>Edit</RouterLink>
        <MarkdownPreview :mdContent="blog.content" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchBlog } from '../api/blog'
import { useBlogStore } from '../stores/blog';
import MarkdownPreview from './MarkdownPreview.vue'

const blogStore = useBlogStore()
const blog = ref({ id: 0, name: '', content: '' })
const route = useRoute()

const getBlogEditRouter = function (id: number) {
    blogStore.editBlogId = id
    blogStore.editBlogName = blog.value.name
    blogStore.editBlogContent = blog.value.content
    return '/blog/edit/' + id
}

const getBlog = async (id: number) => {
    try {
        const response = await fetchBlog(id)
        blog.value.name = response.name
        blog.value.content = response.content
    } catch (error) {
        console.error('Failed to fetch blog:', error)
    }
}

onMounted(() => {
    const blogId = Number(route.params.id)
    if (blogId) {
        blog.value.id = blogId
        getBlog(blogId as number)
    }
})
</script>

<style scoped>
h1 {
    margin: 0;
}

p {
    margin: 10px 0 0;
}
</style>