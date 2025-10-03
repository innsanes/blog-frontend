<template>
  <Top />
  <div class="main-container">
    <main class="main-content">
      <RouterView />
    </main>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import Top from './components/Top.vue'
import Footer from './components/Footer.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped>
.main-container {
  min-height: calc(100vh - 120px); /* 减去 header 和 footer 的高度 */
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}
</style>
