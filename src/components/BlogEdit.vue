<template>
  <div style="margin-top: 80px;"></div>
  <el-input
    v-model="blogStore.blogName"
    style="width: 240px"
    clearable
  />
  <button :onclick="saveBlog">提交更改</button>
  <MarkdownEditor />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MarkdownEditor from './MarkdownEditor.vue'
import { useRoute, useRouter } from 'vue-router'
import ElementPlus from 'element-plus'
import { fetchBlog, blogupdate, blogcreate } from '../api/blog'
import { useBlogStore } from '../stores/blog'

const blogStore = useBlogStore()
const route = useRoute()
const router = useRouter()

const getBlog = async (id: number) => {
    try {
        const response = await fetchBlog(id)
        blogStore.blogName = response.name
        blogStore.blogContent = response.content
    } catch (error) {
        console.error('Failed to fetch blog:', error)
    }
}

const saveBlog = async () => {
    if (blogStore.blogId === 0) {
        try {
            await blogcreate({
                name: blogStore.blogName,
                content: blogStore.blogContent
            })
            router.push('/')
        } catch (error) {
            console.error('Failed to update blog:', error)
        }
    } else  {
        try {
            await blogupdate({
                id: blogStore.blogId,
                name: blogStore.blogName,
                content: blogStore.blogContent
            })
            router.push('/blog/' + blogStore.blogId)
        } catch (error) {
            console.error('Failed to update blog:', error)
        }
    }
}

onMounted(() => {
    blogStore.blogId = Number(route.params.id)
    if (!blogStore.blogId || blogStore.blogId === 0) {
        blogStore.blogId = 0
        blogStore.blogName = ''
        blogStore.blogContent = ''
    } else {
        getBlog(blogStore.blogId)
    }
})
</script>

<style scoped>
</style>
