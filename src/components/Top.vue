<template>
  <div class="VPNavBar top">
    <div class="wrapper">
      <div class="container">
        <!-- 左侧 Logo 和标题 -->
        <div class="title">
          <RouterLink class="VPNavBarTitle title" to="/">
            <img class="VPImage logo" src="@/assets/tangram_2.png" width="24" height="24" alt="">
            <span>Innsane Blog</span>
          </RouterLink>
        </div>

        <!-- 右侧导航内容 -->
        <div class="content">
          <div class="content-body">
            <!-- 导航菜单 -->
            <nav class="VPNavBarMenu menu">
              <RouterLink 
                class="VPLink link VPNavBarMenuLink" 
                active-class="active"
                to="/"
              >
                首页
              </RouterLink>
              
              <RouterLink
                v-if="!userStore.isLogin"
                class="VPLink link VPNavBarMenuLink"
                active-class="active"
                to="/login"
              >
                登录
              </RouterLink>

              <RouterLink
                v-if="userStore.isLogin"
                class="VPLink link VPNavBarMenuLink"
                active-class="active"
                to="/blog/edit/0"
                @click="routerCreateNew"
              >
                新建文章
              </RouterLink>
            </nav>

            <!-- 右侧功能区 -->
            <div class="VPNavBarExtra">
              <!-- 主题切换 -->
              <button class="VPSwitch VPSwitchAppearance">
                <span class="check">
                  <span class="icon">
                    <span class="vpi-sun"></span>
                    <span class="vpi-moon"></span>
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部装饰线 -->
    <div class="divider">
      <div class="divider-line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { useBlogStore } from '../stores/blog'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const blogStore = useBlogStore()

const routerCreateNew = () => {
  blogStore.blogId = 0
  blogStore.blogName = ''
  blogStore.blogContent = ''
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