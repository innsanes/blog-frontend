<template>
  <div class="vp-doc blog-search">
    <!-- 搜索头部 -->
    <div class="search-header">
      <!-- 搜索框和返回按钮行 -->
      <div class="search-controls-row">
        <!-- 搜索框 -->
        <div class="search-container">
          <div class="search-box">
            <input 
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text" 
              placeholder="搜索博客..." 
              class="search-input"
            />
            <button @click="handleSearch" class="search-button">
              <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 返回按钮 -->
        <RouterLink to="/" class="back-button">
          <svg class="back-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          返回博客列表
        </RouterLink>
      </div>
      
      <!-- 搜索信息行 -->
      <div class="search-info-row" v-if="currentCategory">
        <!-- 分类信息 -->
        <div class="category-info">
          <span class="category-label">分类:</span>
          <span class="category-name">{{ currentCategory }}</span>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在搜索...</p>
    </div>

    <!-- 搜索结果列表 -->
    <div v-else-if="searchResults.length > 0" class="search-results">
      <article 
        v-for="result in searchResults" 
        :key="result.id" 
        class="search-result-item"
      >
        <RouterLink 
          class="result-link" 
          :to="blogRouter(result.id)"
        >
          <div class="result-header">
            <div class="result-title">{{ result.name }}</div>
            <div class="result-match-count" v-if="result.matchCount > 0">
              匹配 {{ result.matchCount }} 次
            </div>
          </div>
          <div class="result-summary" v-html="getSummaryPreview(result)"></div>
        </RouterLink>
      </article>
    </div>

    <!-- 无结果状态 -->
    <div v-else class="no-results">
      <div class="no-results-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
          <path d="M11 8v6"/>
          <path d="M8 11h6"/>
        </svg>
      </div>
      <h3>未找到相关博客</h3>
      <p>请尝试其他关键词或返回博客列表</p>
      <RouterLink to="/" class="back-to-list">
        返回博客列表
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { timeFormatDate } from '../util/time'
import { searchBlogs, type BlogSearchResult } from '../api/blog'

const route = useRoute()
const router = useRouter()

const searchQuery = ref<string>('')
const searchResults = ref<BlogSearchResult[]>([])
const loading = ref<boolean>(false)
const currentCategory = ref<string>('')

// 博客路由生成
const blogRouter = (id: number) => {
  return `/blog/${id}`
}

// 搜索处理
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value.trim() }
    })
  }
}

// 获取摘要预览（压缩显示）
const getSummaryPreview = (result: BlogSearchResult) => {
  let summary = ''
  
  // 优先使用summary字段
  if (result.summary) {
    summary = result.summary
  } else if (result.content) {
    // 如果没有summary，从content中提取
    const textContent = result.content.replace(/<[^>]*>/g, '')
    summary = textContent.substring(0, 150)
    if (textContent.length > 150) {
      summary += '...'
    }
  }
  
  // 高亮搜索关键词
  if (searchQuery.value && summary) {
    const regex = new RegExp(`(${searchQuery.value})`, 'gi')
    summary = summary.replace(regex, '<mark class="search-highlight">$1</mark>')
  }
  
  return summary
}

// 执行搜索
const performSearch = async (query: string) => {
  if (!query.trim()) {
    searchResults.value = []
    return
  }
  
  loading.value = true
  
  try {
    const response = await searchBlogs(query)
    searchResults.value = response.data || []
  } catch (error: any) {
    ElMessage.error('搜索失败: ' + (error.message || '未知错误'))
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

// 监听路由变化
watch(() => route.query.q, (newQuery) => {
  if (newQuery && typeof newQuery === 'string') {
    searchQuery.value = newQuery
    performSearch(newQuery)
  }
}, { immediate: true })

// 监听分类变化
watch(() => route.query.category, (newCategory) => {
  if (newCategory && typeof newCategory === 'string') {
    currentCategory.value = newCategory
  } else {
    currentCategory.value = ''
  }
}, { immediate: true })

onMounted(() => {
  const query = route.query.q
  if (query && typeof query === 'string') {
    searchQuery.value = query
    performSearch(query)
  }
  
  const category = route.query.category
  if (category && typeof category === 'string') {
    currentCategory.value = category
  }
})
</script>

<style scoped>
/* 基础布局 */
.blog-search {
  max-width: 1024px;
  margin: calc(var(--vp-nav-height) + 24px) auto 0;
  padding: 0 24px;
}

/* 搜索头部 */
.search-header {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.search-controls-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-container {
  flex: 1;
  min-width: 300px;
}

.search-box {
  position: relative;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 12px 50px 12px 16px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 16px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: all 0.2s ease;
  outline: none;
}

.search-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

.search-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--vp-c-brand-1);
  border: none;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-50%) scale(1.05);
}

.search-icon {
  color: white;
  width: 20px;
  height: 20px;
}

.search-info-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}


.category-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.category-label {
  color: var(--vp-c-text-3);
}

.category-name {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--vp-c-brand-1);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: var(--vp-c-brand-2);
  color: white;
  transform: translateY(-1px);
}

.back-icon {
  width: 16px;
  height: 16px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: var(--vp-c-text-2);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vp-c-divider);
  border-top: 3px solid var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 搜索结果列表 */
.search-results {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-result-item {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: all 0.2s ease;
  overflow: hidden;
}

.search-result-item:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
  background: var(--vp-c-bg);
}

.result-link {
  display: block;
  padding: 16px 20px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
}

.result-link:hover {
  text-decoration: none;
}

.result-link:hover .result-title {
  color: var(--vp-c-brand-1);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 12px;
}

.result-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;
  flex: 1;
}

.result-match-count {
  font-size: 12px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.result-summary {
  font-size: 14px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.search-highlight {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 1px 3px;
  border-radius: 3px;
  font-weight: 500;
}

/* 无结果状态 */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  text-align: center;
  color: var(--vp-c-text-2);
}

.no-results-icon {
  margin-bottom: 24px;
  opacity: 0.6;
}

.no-results h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 8px 0;
}

.no-results p {
  font-size: 14px;
  margin: 0 0 24px 0;
}

.back-to-list {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--vp-c-brand-1);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-to-list:hover {
  background: var(--vp-c-brand-2);
  color: white;
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .blog-search {
    padding: 0 16px;
    margin-top: calc(var(--vp-nav-height) + 16px);
  }
  
  .search-controls-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .search-container {
    min-width: auto;
    width: 100%;
  }
  
  .search-info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .category-info {
    font-size: 13px;
  }
  
  .search-result-item {
    margin: 0 -4px;
  }
  
  .result-link {
    padding: 14px 16px;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .result-title {
    font-size: 15px;
  }
  
  .result-match-count {
    font-size: 11px;
    align-self: flex-start;
  }
  
  .result-summary {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .blog-search {
    padding: 0 12px;
  }
  
  .search-controls-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .search-container {
    min-width: auto;
    width: 100%;
  }
  
  .search-info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .category-info {
    font-size: 12px;
  }
  
  .search-result-item {
    margin: 0 -2px;
  }
  
  .result-link {
    padding: 12px 14px;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  
  .result-title {
    font-size: 14px;
  }
  
  .result-match-count {
    font-size: 10px;
    align-self: flex-start;
  }
  
  .result-summary {
    font-size: 12px;
  }
}
</style>
