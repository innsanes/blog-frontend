<template>
  <Top />
  <el-container class="main-container">
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
  <Footer />
</template>

<script setup lang="ts">
import Top from './components/Top.vue'
import Footer from './components/Footer.vue'
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped></style>
