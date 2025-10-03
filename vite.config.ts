import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 添加 Node.js 模块的浏览器 polyfill
      'stream': 'stream-browserify',
      'events': 'events',
      'crypto': 'crypto-browserify',
      'buffer': 'buffer',
      'process': 'process/browser',
      'util': 'util',
      'assert': 'assert',
      'url': 'url',
      'querystring': 'querystring-es3',
      'path': 'path-browserify',
      'fs': 'browserify-fs'
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
      external: ['net', 'tls', 'child_process', 'vm'],
      output: {
        manualChunks: {
          // Vue 核心框架 - 必须首屏加载
          'vue-vendor': [
            'vue', 
            'vue-router', 
            'pinia', 
            'pinia-plugin-persistedstate'
          ],
          
          
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
          
          // 网络请求和加密 - 工具库
          'utils': [
            'axios',
            'crypto-js',
            'crypto-browserify',
            'buffer'
          ]
        }
      }
    }
  }
})