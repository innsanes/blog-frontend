<template>
  <h1> BlogEdit </h1>
  <el-input
    v-model="blogStore.editBlogName"
    style="width: 240px"
    clearable
  />
  <button :onclick="saveBlog">提交更改</button>
  <MarkdownEditor />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MarkdownEditor from './MarkdownEditor.vue'
import { useRoute } from 'vue-router'
import ElementPlus from 'element-plus'
import { fetchBlog, blogupdate, blogcreate } from '../api/blog'
import { useBlogStore } from '../stores/blog'

const blogStore = useBlogStore()
const route = useRoute()

const getBlog = async (id: number) => {
    try {
        const response = await fetchBlog(id)
        blogStore.editBlogName = response.name
        blogStore.editBlogContent = response.content
    } catch (error) {
        console.error('Failed to fetch blog:', error)
    }
}

const saveBlog = async () => {
    if (blogStore.editBlogId === 0) {
        try {
            await blogcreate({
                name: blogStore.editBlogName,
                content: blogStore.editBlogContent
            })
        } catch (error) {
            console.error('Failed to update blog:', error)
        }
    } else  {
        try {
      console.log('Blog updated:', blogStore.editBlogId, blogStore.editBlogName, blogStore.editBlogContent)
        await blogupdate({
            id: blogStore.editBlogId,
            name: blogStore.editBlogName,
            content: blogStore.editBlogContent
        })
        } catch (error) {
            console.error('Failed to update blog:', error)
        }
    }
}

onMounted(() => {
    blogStore.editBlogId = Number(route.params.id)
    if (blogStore.editBlogId) {
        getBlog(blogStore.editBlogId)
    }
})
</script>

<style scoped>
</style>
