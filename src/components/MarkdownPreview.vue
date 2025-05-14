<template>
  <!-- <div class="markdown-body custom-markdown-body" v-html="renderedHtml"></div> -->
  <!-- public/index.html -->
  <div class="vp-doc custom-markdown-body" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import Shiki from '@shikijs/markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItToc from 'markdown-it-toc-done-right'
import MarkdownItContainer from 'markdown-it-container'
import { useBlogStore } from '../stores/blog'
import '@/styles/vitepress/vars.css'
import '@/styles/vitepress/base.css'
import '@/styles/vitepress/components/custom-block.css'
import '@/styles/vitepress/components/vp-code.css'
import '@/styles/vitepress/components/vp-doc.css'
import {createMarkdownRenderer} from './markdownvp/markdown'

const blogStore = useBlogStore()
const renderedHtml = ref<string>('')  // 正确类型


const md = await createMarkdownRenderer()
onMounted(async () => {
  renderedHtml.value = md.renderAsync(blogStore.blogContent)
})

watch(() => blogStore.blogContent, () => {
  renderedHtml.value = md.render(blogStore.blogContent)
})

</script>

<style>
nav.custom-toc {
  position: fixed;
  top: 100px;
  /* 距离顶部 100px */
  left: 20px;
  /* 距离左边 20px */
  width: 240px;
  /* 适当的宽度 */
  background-color: #f5f7fa;
  /* Element Plus 的背景色 */
  border: 1px solid #ebeef5;
  /* Element Plus 的边框色 */
  border-radius: 4px;
  /* Element Plus 的圆角 */
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  /* Element Plus 的阴影 */
}

ul.custom-toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

li.custom-toc-item {
  margin: 8px 0;
}

li.custom-toc-item:hover {
  margin: 8px 0;
}

a.custom-toc-link {
  display: flex;
  width: 100%;
  color: #44464b;
  padding: 4px 8px;
  border-radius: 4px;
  text-decoration: none;
}

a.custom-toc-link:hover {
  color: #0969da;
  /* Element Plus 的主要颜色 */
  background-color: #409eff1a;
  text-decoration: none;
}

/* 层级缩进 */
.custom-toc-list>li {
  padding-left: 0;
}

.custom-toc-list>li>ul>li {
  padding-left: 20px;
}

.custom-toc-list>li>ul>li>ul>li {
  padding-left: 40px;
}

.custom-markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 0px 20px;
}

@media (max-width: 767px) {
  .custom-markdown-body {
    padding: 15px;
  }
}

a.header-anchor {
  color: rgba(0, 0, 0, 0);
}

.header-anchor:hover {
  display: inline;
  color: #0969da;

}
</style>
