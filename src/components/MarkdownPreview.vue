<template>
    <div class="markdown-body" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import 'github-markdown-css/github-markdown.css';

const props = defineProps<{
    mdContent: string
}>()

const md = new MarkdownIt()
const renderedHtml = computed(() => {
    return md.render(props.mdContent)
})
</script>

<style scoped></style>