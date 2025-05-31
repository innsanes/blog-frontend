<template>
  <div class="VPDoc has-aside" v-if="!loading">
    <div class="container" >
      <div class="aside" v-if="emptyHeader">
        <div class="aside-curtain"></div>
        <div class="aside-container">
          <div class="aside-content VPDocAside" v-html="renderedTOCHtml"></div>
        </div>
      </div>
      <div class="content" >
        <div class="content-container">
          <div class="VPContent vp-doc" v-html="renderedContentHtml" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useBlogStore } from '../stores/blog'
import { renderMermaidSSE } from './markdownvp/plugins/mermaid'
import {createMarkdownRenderer} from './markdownvp/markdown'
import { useCopyCode } from './markdownvp/copyCode'

const blogStore = useBlogStore()
const renderedContentHtml = ref<string>('')
const renderedTOCHtml = ref<string>('')
const md = ref<any>(null)
const emptyHeader = ref(true)
const loading = ref(true)
 
const renderMarkdown = async (id: number, title: string, content: string) => {
  loading.value = true

  if (!md.value) {
    md.value = await createMarkdownRenderer()
  }

  // 加个防抖 delay 的话，也可以防止切换过快闪烁
  const html = await md.value.renderAsync(`[[TOC]]\n<!---split--->\n`+`# `+title+`\n`+content)
  const [tocHtml, contentHtml] = html.split('<!---split--->')
  if (id == blogStore.blogId) {
    renderedContentHtml.value = contentHtml
    renderedTOCHtml.value = tocHtml
  }
  
  emptyHeader.value = true
  if (tocHtml === `<nav class="VPDocAsideOutline has-outline"><ul class="VPDocOutlineItem nested"></ul></nav>\n`) [
    emptyHeader.value = false
  ]
  // blogStore.blogHeaders = getHeaders()
  renderMermaidSSE()
  loading.value = false
}

onMounted(() => {
  useCopyCode()
  renderMarkdown(blogStore.blogId, blogStore.blogName, blogStore.blogContent)
})

watch(() => blogStore.blogContent, () => {
  renderMarkdown(blogStore.blogId, blogStore.blogName, blogStore.blogContent)
})

</script>


<style scoped>
.VPDoc {
  padding: 32px 24px 96px;
  width: 100%;
}

@media (min-width: 768px) {
  .VPDoc {
    padding: 48px 32px 128px;
  }
}

@media (min-width: 960px) {
  .VPDoc {
    padding: 48px 32px 0;
  }

  .VPDoc:not(.has-sidebar) .container {
    display: flex;
    justify-content: center;
    max-width: 992px;
  }

  .VPDoc:not(.has-sidebar) .content {
    max-width: 752px;
  }
}

@media (min-width: 1280px) {
  .VPDoc .container {
    display: flex;
    justify-content: center;
  }

  .VPDoc .aside {
    display: block;
  }
}

@media (min-width: 1440px) {
  .VPDoc:not(.has-sidebar) .content {
    max-width: 784px;
  }

  .VPDoc:not(.has-sidebar) .container {
    max-width: 1104px;
  }
}

.container {
  margin: 0 auto;
  width: 100%;
}

.aside {
  position: relative;
  display: none;
  order: 2;
  flex-grow: 1;
  padding-left: 32px;
  width: 100%;
  max-width: 256px;
}

.aside-container {
  position: fixed;
  top: 0;
  padding-top: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + var(--vp-doc-top-height, 0px) + 48px);
  width: 224px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.aside-container::-webkit-scrollbar {
  display: none;
}

.aside-curtain {
  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 224px;
  height: 32px;
  background: linear-gradient(transparent, var(--vp-c-bg) 70%);
  pointer-events: none;
}

.aside-content {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - (var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 48px));
  padding-bottom: 32px;
}

.content {
  position: relative;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 960px) {
  .content {
    padding: 0 32px 128px;
  }
}

@media (min-width: 1280px) {
  .content {
    order: 1;
    margin: 0;
    min-width: 640px;
  }
}

.content-container {
  margin: 0 auto;
}

.VPDoc.has-aside .content-container {
  max-width: 688px;
}

.VPContent {
  flex-grow: 1;
  flex-shrink: 0;
  margin: var(--vp-layout-top-height, 0px) auto 0;
  width: 100%;
}

@media (min-width: 960px) {
  .VPContent {
    padding-top: var(--vp-nav-height);
  }
}

.VPDocAside {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.spacer {
  flex-grow: 1;
}

.VPDocAside :deep(.spacer + .VPDocAsideSponsors),
.VPDocAside :deep(.spacer + .VPDocAsideCarbonAds) {
  margin-top: 24px;
}

.VPDocAside :deep(.VPDocAsideSponsors + .VPDocAsideCarbonAds) {
  margin-top: 16px;
}

::v-deep(.root) {
  position: relative;
  z-index: 1;
}

::v-deep(.nested) {
  padding-right: 16px;
  padding-left: 16px;
}

::v-deep(.outline-link) {
  display: block;
  line-height: 32px;
  font-size: 14px;
  font-weight: 400;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.5s;
}

::v-deep(.outline-link:hover),
::v-deep(.outline-link.active) {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

::v-deep(.outline-link.nested) {
  padding-left: 13px;
}

::v-deep(.VPDocAsideOutline) {
  display: none;
}

::v-deep(.VPDocAsideOutline.has-outline){
  display: block;
}

::v-deep(.aside-content) {
  position: relative;
  border-left: 1px solid var(--vp-c-divider);
  padding-left: 16px;
  font-size: 13px;
  font-weight: 500;
}

::v-deep(.outline-marker) {
  position: absolute;
  top: 32px;
  left: -1px;
  z-index: 0;
  opacity: 0;
  width: 2px;
  border-radius: 2px;
  height: 18px;
  background-color: var(--vp-c-brand-1);
  transition:
    top 0.25s cubic-bezier(0, 1, 0.5, 1),
    background-color 0.5s,
    opacity 0.25s;
}

::v-deep(.outline-title) {
  line-height: 32px;
  font-size: 14px;
  font-weight: 600;
}
</style>