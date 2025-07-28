<template>
  <RouterLink 
    :to="`/?category=${encodeURIComponent(category)}`"
    class="category-link"
  >
    #{{ category }}
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface Props {
  category: string
}

defineProps<Props>()
</script>

<style scoped>
.category-link {
  display: inline-block;
  margin-right: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: all 0.25s;
  white-space: nowrap;
  cursor: pointer;
}

.category-link:hover {
  color: var(--vp-c-brand);
  text-decoration: underline;
}

.category-link:active {
  color: var(--vp-c-brand-dark);
}
</style>
