<template>
  <Top />
  <el-container class="main-container">
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import Top from './components/Top.vue'
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped></style>
