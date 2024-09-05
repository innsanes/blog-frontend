<template>
    <!-- <el-button type="primary" @click="createNewBlog"></el-button> -->
    <el-button @click="buttonClick" class="menu-button">Menu</el-button>
    <el-drawer
      v-model="drawerVisible"
      title="Menu"
      direction="ltr"
      size="200px"
      custom-class="nav-drawer"
    >
        <el-menu
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        >
            <el-menu-item index="1">
                <template #title>
                    <RouterLink @click="closeDrawer" to="/">Home</RouterLink>
                </template>
            </el-menu-item>
            <el-menu-item v-if="!userStore.isLogin" index="2">
            <template #title>
                <RouterLink @click="closeDrawer" to="/login">Login</RouterLink>
            </template>
            </el-menu-item>
            <el-menu-item v-if="userStore.isLogin" index="3">
            <template #title>
                <RouterLink  @click="closeDrawer" to="/blog/edit/0">NewBlog</RouterLink>
            </template>
            </el-menu-item>
        </el-menu>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useBlogStore } from '../stores/blog'
import { useRouter} from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const blogStore = useBlogStore()
const drawerVisible = ref(false)
const isCollapse = ref(false)
const buttonClick = () => {
    drawerVisible.value = true
}

const closeDrawer = () => {
    drawerVisible.value = false
}

const routerCreateNew = () => {
    closeDrawer()
    blogStore.blogId = 0
    blogStore.blogName = ''
    blogStore.blogContent = ''
    router.push('/blog/edit/0')
}

</script>

<style scoped>
.menu-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background-color: #409eff;
  color: #fff;
  border-radius: 8px;
  padding: 10px 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.nav-drawer {
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.el-menu-vertical-demo {
  border-right: none;
}

.el-menu-item {
  border-radius: 8px;
  margin: 5px 0;
  overflow: hidden;
}

.el-menu-item:hover {
  background-color: #f5f5f5;
}

.el-menu-item .el-menu-item__title {
  padding: 10px 20px;
}
</style>
