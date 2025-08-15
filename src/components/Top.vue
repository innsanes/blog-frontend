<template>
  <div class="VPNavBar">
    <div class="wrapper">
      <div class="container">
        <!-- 左侧 Logo 和标题 -->
        <div class="title">
          <RouterLink class="VPNavBarTitle title" to="/">
            <span>莹的网络日志</span>
          </RouterLink>
        </div>

        <div class="content">
          <div class="content-body">
            <RouterLink 
              class="VPLink link VPNavBarMenuLink" 
              active-class="active"
              to="/"
            >
              首页
            </RouterLink>
            <VPNavBarAppearance class="appearance" />
          </div>
        </div>
      </div>
    </div>

    <div class="divider">
      <div class="divider-line" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBlogStore } from '../stores/blog'
import { useRouter } from 'vue-router'

const router = useRouter()
const blogStore = useBlogStore()

const routerCreateNew = () => {
  blogStore.resetBlog()
  router.push('/blog/edit/0')
}
</script>

<style scoped>
/* 复用 VitePress 样式结构 */
.VPNavBar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: saturate(50%) blur(8px);
  transition: background-color 0.5s;
}

.wrapper {
  padding: 0 32px;
}

.container {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 1440px;
}

.title {
  display: flex;
  align-items: center;
  height: var(--vp-nav-height);
}

.VPNavBarTitle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.logo {
  border-radius: 4px;
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.1);
}

.content {
  flex-grow: 1;
  height: var(--vp-nav-height);
}

.content-body {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}

.VPNavBarMenu {
  display: flex;
  align-items: center;
  height: 100%;
}

.VPLink {
  position: relative;
  display: block;
  padding: 0 12px;
  line-height: var(--vp-nav-height);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}

.VPLink.active {
  color: var(--vp-c-brand);
}

.VPLink:hover {
  color: var(--vp-c-text-1);
}

.VPSwitchAppearance {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.25s;
}

.divider-line {
  height: 1px;
  background-color: var(--vp-c-divider);
  transition: background-color 0.5s;
}

@media (max-width: 768px) {
  .VPNavBarMenu {
    display: none;
  }
  
  .wrapper {
    padding: 0 16px;
  }
}
</style>