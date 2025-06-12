<template>
    <MarkdownPreview :mdContent="blogStore.content" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { fetchBlog } from '../api/blog'
import { useBlogStore } from '../stores/blog';
import MarkdownPreview from './MarkdownPreview.vue'

const blogStore = useBlogStore()
// const blog = ref({ id: 0, name: '', content: '' })
const route = useRoute()

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