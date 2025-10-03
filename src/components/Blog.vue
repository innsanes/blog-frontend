<template>
    <MarkdownPreviewLazy :mdContent="blogStore.currentBlog?.content" />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchBlog } from '../api/blog'
import { useBlogStore, type Blog } from '../stores/blog';
import MarkdownPreviewLazy from './MarkdownPreviewLazy.vue'

const blogStore = useBlogStore()
const route = useRoute()

const getBlog = async (id: number) => {
    try {
        blogStore.setLoading(true)
        const response = await fetchBlog(id)
        // 由于axios拦截器返回response.data，所以response就是博客数据
        const blogData = response as unknown as Blog;
        
        if (blogData && blogData.name && blogData.content) {
            // 使用新的setBlog方法设置完整的博客对象
            // 确保categories字段存在
            const safeBlogData: Blog = {
                ...blogData,
                categories: blogData.categories || []
            }
            blogStore.setBlog(safeBlogData)
            
            // 设置页面标题
            document.title = `${safeBlogData.name} - 莹的网络日志`
        
        }
    } catch (error) {
        console.error('获取博客失败:', error)
    } finally {
        blogStore.setLoading(false)
    }
}

onMounted(() => {
    const blogId = Number(route.params.id)
    if (blogId !== 0) {
        // 先设置ID，然后获取博客数据
        blogStore.updateBlog({ id: blogId })
        getBlog(blogId)
    } else {
        // 如果是新博客，重置store
        blogStore.resetBlog()
    }
})

// 监听路由变化，确保页面标题和跟踪正确
watch(() => route.params.id, (newId) => {
    if (newId && Number(newId) !== 0) {
        getBlog(Number(newId))
    }
})
</script>