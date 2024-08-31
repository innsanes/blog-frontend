<template>
  <Top />
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import Top from './components/Top.vue'
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
</style>
