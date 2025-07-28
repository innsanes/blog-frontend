<template>
    <MarkdownPreview :mdContent="blogStore.blogContent" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { fetchBlog, type BlogDetail } from '../api/blog'
import { useBlogStore } from '../stores/blog';
import MarkdownPreview from './MarkdownPreview.vue'

const blogStore = useBlogStore()
const route = useRoute()

const getBlog = async (id: number) => {
    try {
        const response = await fetchBlog(id)
        const blogData = response as any;
        if (blogData && blogData.name && blogData.content) {
            blogStore.blogName = blogData.name
            blogStore.blogContent = blogData.content
        }
    } catch (error) {
        console.error('获取博客失败:', error)
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