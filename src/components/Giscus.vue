<template>
  <Giscus
    id="comments"
    repo="innsanes/blog-giscus"
    repo-id="R_kgDOPfGPoA"
    category="Announcements"
    category-id="DIC_kwDOPfGPoM4CuQAM"
    mapping="pathname"
    strict="0"
    reactions-enabled="1"
    emit-metadata="0"
    input-position="bottom"
    theme="preferred_color_scheme"
    lang="zh-CN"
    class="giscus-container"
  />
</template>

<script setup lang="ts">
import Giscus from '@giscus/vue'
</script>

<style scoped>
.giscus-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  background: var(--vp-c-bg);
  border-radius: 8px;
  margin-top: 48px;
  padding: 8px;
  box-sizing: border-box;
}

/* 确保Giscus内容正确显示 */
.giscus-container :deep(.giscus) {
  width: 100% !important;
  max-width: 100% !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .giscus-container {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .giscus-container {
    padding: 12px;
  }
}
</style>