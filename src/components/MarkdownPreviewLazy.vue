<template>
  <MarkdownPreview :mdContent="mdContent" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// 动态导入 MarkdownPreview 组件
const MarkdownPreview = defineAsyncComponent(() => import('./MarkdownPreview.vue'))

defineProps<{
  mdContent?: string
}>()
</script>

<style scoped>
/* 简单的懒加载组件，样式由 MarkdownPreview 处理 */
</style>