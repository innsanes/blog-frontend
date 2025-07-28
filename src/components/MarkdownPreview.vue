<template>
  <div class="VPDoc has-aside" v-if="!loading">
    <div class="container" >
      <div class="aside" v-if="emptyHeader">
        <div class="aside-curtain"></div>
        <div class="aside-container">
          <div class="aside-content VPDocAside">
            <nav aria-labelledby="doc-outline-aria-label" class="VPDocAsideOutline has-outline" ref="container">
                <div class="content">
                <div class="outline-marker" ref="marker" />
                <div aria-level="2" class="outline-title" id="doc-outline-aria-label" role="heading">
                  Outline
                </div>
                <MarkdownOutline :headers :root="true" />
                <div class="outline-divider"></div>
                <div aria-level="2" class="outline-title" id="doc-outline-aria-label" role="heading">
                  Categories
                </div>
                <div class="outline-categories" v-if="blogStore.blogCategories && blogStore.blogCategories.length > 0">
                  <Category
                    v-for="category in blogStore.blogCategories"
                    :key="category"
                    :category="category"
                  />
                </div>
                <div class="outline-divider"></div>
                <div aria-level="2" class="outline-title" id="doc-outline-aria-label" role="heading">
                  Information
                </div>
                  <div class="outline-info"  id="doc-outline-aria-label" role="heading">
                   <div class="outline-info-item">
                     <span class="outline-info-label">View:</span>
                     <span class="outline-info-value">{{ blogStore.blogView }}</span>
                   </div>
                   <div class="outline-info-item">
                     <span class="outline-info-label">Created:</span>
                     <span class="outline-info-value">{{ timeFormatDate(blogStore.blogCreateTime) }}</span>
                   </div>
                   <div class="outline-info-item">
                     <span class="outline-info-label">Updated:</span>
                     <span class="outline-info-value">{{ timeFormatDate(blogStore.blogUpdateTime) }}</span>
                   </div>
                 </div>
              </div>
            </nav>
          </div>
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
import { ref, onMounted, watch, nextTick, shallowRef} from 'vue'
import { RouterLink } from 'vue-router'
import { useBlogStore } from '../stores/blog'
import { renderMermaidSSE } from './markdownvp/plugins/mermaid'
import {createMarkdownRenderer} from './markdownvp/markdown'
import { useCopyCode } from './markdownvp/copyCode'
import { getHeaders, useActiveAnchor, refreshResolvedHeaders, type OutlineItem } from './markdownvp/outline'
import MarkdownOutline from './MarkdownOutline.vue'
import Category from './Category.vue'
import { timeFormatDate } from '../util/time'

const blogStore = useBlogStore()
const renderedContentHtml = ref<string>('')
const renderedTOCHtml = ref<string>('')
const md = ref<any>(null)
const emptyHeader = ref(true)


const loading = ref(true)
const container = ref()
const marker = ref()
const headers = shallowRef<OutlineItem[]>([])

// Call useActiveAnchor at the top level of setup
useActiveAnchor(container, marker)
 
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
  
  renderMermaidSSE()
  loading.value = false

  // 等待 DOM 更新完成后再获取 headers
  await nextTick();
  
  // 刷新 resolvedHeaders 缓存
  refreshResolvedHeaders()
  
  // 重新获取 headers 并更新
  headers.value = getHeaders([2, 2])
  
  // 延迟一点时间确保 DOM 完全渲染后再触发 active 状态更新
  setTimeout(() => {
    // 手动触发一次滚动事件来更新 active 状态
    window.dispatchEvent(new Event('scroll'))
  }, 200)
}

onMounted(() => {
  // console.log('MarkdownPreview onMounted') // Redundant, useActiveAnchor has its own onMounted
  // console.log('container ref:', container.value) // These will be null here, before child components are mounted
  // console.log('marker ref:', marker.value)
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

@media (min-width: 1080px) {
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

@media (min-width: 1080px) {
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
  padding-top: var(--vp-nav-height);
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
  transition: color 0.2s;
}

::v-deep(.outline-link:hover),
::v-deep(.outline-link.active) {
  color: var(--vp-c-text-1);
  transition: color 0.1s;
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
    top 0.15s cubic-bezier(0, 1, 0.5, 1),
    background-color 0.3s,
    opacity 0.15s;
}

::v-deep(.outline-title) {
  line-height: 32px;
  font-size: 14px;
  font-weight: 600;
}

/* 分隔符样式 */
.outline-divider {
  height: 1px;
  background-color: var(--vp-c-divider);
  margin: 16px 0;
  opacity: 0.6;
}

/* 分类容器样式 */
.outline-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

/* 博客信息样式 */
.outline-info {
  margin-top: 8px;
}

.outline-info-item {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--vp-c-text-2);
}

.outline-info-label {
  font-weight: 500;
  margin-right: 6px;
}

.outline-info-value {
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
}

/* 修复点击outline时的滚动偏移 */
.VPContent :where(h1, h2, h3, h4, h5, h6) {
  scroll-margin-top: var(--vp-nav-height);
}

/* 确保整个文档区域的滚动行为 */
html {
  scroll-padding-top: var(--vp-nav-height);
  scroll-behavior: smooth;
}
</style>