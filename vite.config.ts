import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    exclude: ['fsevents']
  },
  build: {
    // 启用压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
        drop_debugger: true // 移除 debugger
      }
    },
    // 设置 chunk 大小警告限制
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      exclude: ['fsevents']
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue 核心框架 - 必须首屏加载
          'vue-vendor': [
            'vue', 
            'vue-router', 
            'pinia', 
            'pinia-plugin-persistedstate'
          ],
          
          // Element Plus UI 库 - 按需加载
          'element-plus': ['element-plus'],
          
          // Markdown 核心引擎 - 博客核心功能
          'markdown-core': [
            'markdown-it',
            'markdown-it-async',
            '@mdit-vue/shared'
          ],
          
          // Markdown 基础插件 - 常用功能
          'markdown-basic': [
            'markdown-it-anchor',
            'markdown-it-attrs',
            'markdown-it-container',
            'markdown-it-emoji',
            'markdown-it-toc-done-right'
          ],
          
          // MDit Vue 插件 - Vue 集成
          'mdit-vue-plugins': [
            '@mdit-vue/plugin-component',
            '@mdit-vue/plugin-frontmatter',
            '@mdit-vue/plugin-headers',
            '@mdit-vue/plugin-sfc',
            '@mdit-vue/plugin-title',
            '@mdit-vue/plugin-toc'
          ],
          
          // 代码高亮 - 按需加载
          'highlight-libs': [
            'shiki',
            '@shikijs/transformers',
            'highlight.js'
          ],
          
          // 图表渲染 - 按需加载
          'diagram-libs': [
            'mermaid',
            'markdown-it-mermaid'
          ],
          
          // 图片处理 - 按需加载
          'image-libs': [
            'medium-zoom'
          ],
          
          // 网络请求和加密 - 工具库
          'utils': [
            'axios',
            'crypto-js',
            'crypto-browserify',
            'buffer'
          ],
          
          // 评论系统 - 按需加载
          'comment': [
            '@giscus/vue'
          ]
        }
      }
    }
  }
})