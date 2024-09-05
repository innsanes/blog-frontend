<template>
    <div class="markdown-body custom-markdown-body" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js' // https://highlightjs.org
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItToc from 'markdown-it-toc-done-right'
import { useBlogStore } from '../stores/blog'
import 'github-markdown-css/github-markdown-light.css';
import 'highlight.js/styles/github.css'; // 引入样式 (可以根据需要选择不同的样式)

const blogStore = useBlogStore()
const renderedHtml = ref<HTMLElement | null>(null)

const md = MarkdownIt({
    html: false, // Enable HTML tags in source
    xhtmlOut: false, // Use '/' to close single tags (<br />)
    breaks: false, // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-', // CSS language prefix for fenced blocks
    linkify: true, // autoconvert URL-like texts to links
    typographer: true, // Enable smartypants and other sweet transforms
    _highlight: true,
    _strict: false,
    _view: 'html', // html / src / debug
    highlight: function (str, lang) {
        var esc = md.utils.escapeHtml;
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(str, {language: lang, ignoreIllegals: true }).value +
                    '</code></pre>';
            } catch (__) {}
        } else {
            return '<pre class="hljs"><code>' + esc(str) + '</code></pre>';
        }
    }
})
md.use(MarkdownItAnchor, {
    permalink: MarkdownItAnchor.permalink.linkInsideHeader({  // 在标题内部添加一个可点击的图标
        symbol: '#',  // 链接符号可以是任何你喜欢的符号，比如 '#'
        placement: 'after',  // 将图标放在标题的前面
        class: 'header-anchor',  // 给链接添加类名，便于自定义样式
    }),
    slugify: s => s.trim().toLowerCase().replace(/\s+/g, '-'),  // 自定义slugify函数，可以根据需求生成URL友好的锚点链接
})
md.use(MarkdownItToc, {
    containerClass: 'custom-toc',
    // containerId: 'toc',
    listType: 'ul',
    listClass: 'custom-toc-list',
    itemClass: 'custom-toc-item',
    linkClass: 'custom-toc-link',
    level: [1, 2, 3, 4],
    slugify: s => s.trim().toLowerCase().replace(/\s+/g, '-'),
    callback: (html, ast) => {},
})

onMounted(() => {
    renderedHtml.value = md.render('[TOC]\n' + blogStore.blogContent)
})

watch(() => blogStore.blogContent, () => {
    renderedHtml.value = md.render('[TOC]\n' + blogStore.blogContent)
})

</script>

<style>
nav.custom-toc {
  position: fixed;
  top: 100px; /* 距离顶部 100px */
  left: 20px; /* 距离左边 20px */
  width: 240px; /* 适当的宽度 */
  background-color: #f5f7fa; /* Element Plus 的背景色 */
  border: 1px solid #ebeef5; /* Element Plus 的边框色 */
  border-radius: 4px; /* Element Plus 的圆角 */
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* Element Plus 的阴影 */
}

ul.custom-toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
li.custom-toc-item {
  margin: 8px 0;
}
li.custom-toc-item:hover {
  margin: 8px 0;
}

a.custom-toc-link {
    display: flex;
    width: 100%;
    color: #44464b;
    padding: 4px 8px;
    border-radius: 4px;
  text-decoration: none;
}
a.custom-toc-link:hover {
    color: #0969da; /* Element Plus 的主要颜色 */
    background-color: #409eff1a;
    text-decoration: none;
}

/* 层级缩进 */
.custom-toc-list > li {
  padding-left: 0;
}

.custom-toc-list > li > ul > li {
  padding-left: 20px;
}

.custom-toc-list > li > ul > li > ul > li {
  padding-left: 40px;
}

.custom-markdown-body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 0px 20px;
}

@media (max-width: 767px) {
    .custom-markdown-body {
        padding: 15px;
    }
}

a.header-anchor {
    color: rgba(0, 0, 0, 0);
}

.header-anchor:hover {
    display: inline;
    color: #0969da;

}
</style>
