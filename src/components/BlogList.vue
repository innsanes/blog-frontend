<template>
  <div class="vp-doc blog-list">
    <!-- 当前分类过滤显示 -->
    <div class="category-header" v-if="currentCategory">
      <span class="category-display">category: {{ currentCategory }}</span>
      <RouterLink to="/" class="clear-filter">
        清除过滤
      </RouterLink>
    </div>
    
    <!-- 博客总数显示 -->
    <div class="blog-count" v-if="totalCount > 0">
      共 {{ totalCount }} 篇博客
    </div>
    
    <!-- 博客文章列表 -->
    <div class="blog-articles">
      <article 
        v-for="blog in blogs" 
        :key="blog.id" 
        class="blog-article"
      >
        <div class="article-header">
          <RouterLink 
            class="article-title" 
            :to="blogRouter(blog.id)"
          >
            {{ blog.name }}
          </RouterLink>
        </div>
        
        <div class="article-meta">
          <div class="meta-item">
            <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
              <path d="M16 3v4" />
              <path d="M8 3v4" />
              <path d="M4 11h16" />
              <path d="M7 14h.013" />
              <path d="M10.01 14h.005" />
              <path d="M13.01 14h.005" />
              <path d="M16.015 14h.005" />
              <path d="M13.015 17h.005" />
              <path d="M7.01 17h.005" />
              <path d="M10.01 17h.005" />
            </svg>
            <time class="article-date">{{ timeFormatDate(blog.createTime) }}</time>
          </div>
          <div class="meta-item">
            <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M3 8v4.172a2 2 0 0 0 .586 1.414l5.71 5.71a2.41 2.41 0 0 0 3.408 0l3.592 -3.592a2.41 2.41 0 0 0 0 -3.408l-5.71 -5.71a2 2 0 0 0 -1.414 -.586h-4.172a2 2 0 0 0 -2 2z" />
              <path d="M18 19l1.592 -1.592a4.82 4.82 0 0 0 0 -6.816l-4.592 -4.592" />
              <path d="M7 10h-.01" />
            </svg>
            <span class="article-categories" v-if="blog.categories && blog.categories.length > 0">
              <Category
                v-for="category in blog.categories"
                :key="category"
                :category="category"
              />
            </span>
          </div>
        </div>
        
        <div class="article-excerpt" v-if="getBlogSummary(blog)">
          {{ getBlogSummary(blog) }}
        </div>
        
        <div class="article-footer">
          <RouterLink 
            class="read-more" 
            :to="blogRouter(blog.id)"
          >
            继续阅读 →
          </RouterLink>
        </div>
      </article>
    </div>
    
    <!-- 分页导航 -->
    <div class="pagination" v-if="totalCount > 0">
      <span class="page-info">[1] 2 >>></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { bloglist, type BlogListItem, type BlogListParams } from '../api/blog'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { timeFormatDate } from '../util/time'
import Category from './Category.vue'

const blogs = ref<BlogListItem[]>([])
const totalCount = ref<number>(0)
const currentCategory = ref<string>('')
const route = useRoute()

const blogRouter = function (id: number) {
  return '/blog/' + id
}

const getBlogSummary = function (blog: BlogListItem) {
  // 如果有summary字段，直接返回
  if (blog.summary) {
    return blog.summary
  }
  
  // 如果没有summary但有content，从content中提取摘要
  if (blog.content) {
    // 移除HTML标签，获取纯文本
    const plainText = blog.content.replace(/<[^>]*>/g, '')
    // 截取前150个字符作为摘要
    if (plainText.length > 150) {
      return plainText.substring(0, 150) + '...'
    }
    return plainText
  }
  
  return ''
}

const fetchBlogs = async (params?: BlogListParams) => {
  try {
    const response = await bloglist(params)
    // 安全处理函数，确保每个博客都有categories字段
    const safeProcessBlogs = (blogList: any[]) => {
      return blogList.map(blog => ({
        ...blog,
        categories: blog.categories || []
      }))
    }

    // 根据实际API响应结构调整数据访问路径
    // 如果后端直接返回BlogListResponse结构
    if (response.data.data && response.data.count !== undefined) {
      blogs.value = safeProcessBlogs(response.data.data)
      totalCount.value = response.data.count
    }
    // 如果后端返回被包装的结构（如 {code, data: BlogListResponse, message}）
    else if (response.data && response.data.data && response.data.data.data && response.data.data.count !== undefined) {
      blogs.value = safeProcessBlogs(response.data.data.data)
      totalCount.value = response.data.data.count
    }
    // 兜底：保持原有逻辑
    else {
      const rawData = response.data?.data || response.data || []
      blogs.value = safeProcessBlogs(rawData)
      totalCount.value = response.data?.count || blogs.value.length
    }
  } catch (error: any) {
    ElMessage.error('获取博客列表失败: ' + (error.message || '未知错误'))
  }
}

const router = useRouter()

// 加载博客列表（支持多种查询参数）
const loadBlogs = () => {
  // 获取所有可能的查询参数
  const category = route.query.category as string
  const page = parseInt(route.query.page as string) || undefined
  const size = parseInt(route.query.size as string) || 30
  const useCursor = true
  const cursor = parseInt(route.query.cursor as string) || 99999
  const forward = false
  
  currentCategory.value = category || ''
  
  // 构建API查询参数
  const params: BlogListParams = { size }
  
  if (category) params.category = category
  if (page !== undefined) params.page = page
  if (useCursor) {
    params.useCursor = useCursor
    if (cursor !== undefined) params.cursor = cursor
    params.forward = forward
  }
  
  fetchBlogs(params)
}

onMounted(() => {
  loadBlogs()
})

// 监听路由查询参数变化
watch(() => route.query, () => {
  loadBlogs()
}, { deep: true })

// 暴露给外部使用的方法
defineExpose({
  fetchBlogs,
  refresh: loadBlogs
})
</script>

<style scoped>
/* 基础布局 */
.blog-list {
  max-width: 1024px;
  margin: calc(var(--vp-nav-height) + 24px) auto 0;
  padding: 0 24px;
}

/* 分类头部显示 */
.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: var(--vp-c-bg-soft);
  border-left: 4px solid var(--vp-c-brand);
  border-radius: 6px;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 44px;
  padding-right: 44px;
}

.category-display {
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.clear-filter {
  color: var(--vp-c-text-3);
  text-decoration: none;
  font-size: 13px;
  transition: color 0.25s;
}

.clear-filter:hover {
  color: var(--vp-c-brand);
}

/* 博客数量显示 */
.blog-count {
  margin-bottom: 16px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  padding-right: 24px;
}

/* 博客文章列表 */
.blog-articles {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.blog-article {
  padding: 16px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background-color 0.25s;
}

.blog-article:last-child {
  border-bottom: none;
}

.blog-article:hover {
  background: var(--vp-c-bg-soft);
  margin: 0 -24px;
  padding-left: 24px;
  padding-right: 24px;
  border-radius: 8px;
}

/* 文章标题 */
.article-header {
  margin-bottom: 12px;
}

.article-title {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.25s;
}

.article-title:hover {
  color: var(--vp-c-brand);
  text-decoration: underline;
}

/* 文章元数据 */
.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-family: var(--vp-font-family-mono);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-icon {
  width: 18px;
  height: 18px;
  color: var(--vp-c-text-3);
}

.article-date {
  color: var(--vp-c-text-3);
  font-size: 14px;
}

/* 文章分类标签 */
.article-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

/* 文章摘要 */
.article-excerpt {
  margin-bottom: 8px;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 显示3行 */
  -webkit-box-orient: vertical;
  max-height: 4.8em; /* 3行的高度 */
  word-wrap: break-word;
  hyphens: auto;
}

/* 文章底部 */
.article-footer {
  display: flex;
  justify-content: flex-end;
}

.read-more {
  color: var(--vp-c-text-3);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.25s;
}

.read-more:hover {
  color: var(--vp-c-brand);
  text-decoration: underline;
}

/* 分页导航 */
.pagination {
  margin-top: 32px;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}

.page-info {
  font-family: var(--vp-font-family-mono);
}

.meta-separator {
  color: var(--vp-c-text-3);
  font-size: 14px;
  margin: 0 4px;
  opacity: 0.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .blog-list {
    padding: 0 16px;
    margin-top: calc(var(--vp-nav-height) + 16px);
  }
  
  .category-header {
    margin-left: -16px;
    margin-right: -16px;
    padding-left: 32px;
    padding-right: 32px;
  }
  
  .blog-count {
    margin-left: -16px;
    margin-right: -16px;
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .blog-article {
    padding: 24px 0;
  }
  
  .blog-article:hover {
    margin: 0 -16px;
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .article-title {
    font-size: 20px;
  }
  
  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    font-family: var(--vp-font-family-mono);
  }
  
  .meta-separator {
    display: none;
  }
  
  .meta-item {
    gap: 6px;
  }
  
  .meta-icon {
    width: 14px;
    height: 14px;
  }
  
  .article-categories {
    gap: 2px;
  }
  
  .article-excerpt {
    font-size: 14px;
    -webkit-line-clamp: 2; /* 移动端显示2行 */
    max-height: 3.2em;
  }
}

@media (max-width: 480px) {
  .blog-list {
    padding: 0 12px;
  }
  
  .category-header {
    margin-left: -12px;
    margin-right: -12px;
    padding-left: 24px;
    padding-right: 24px;
  }
  
  .blog-count {
    margin-left: -12px;
    margin-right: -12px;
    padding-left: 12px;
    padding-right: 12px;
  }
  
  .blog-article {
    padding: 20px 0;
  }
  
  .blog-article:hover {
    margin: 0 -12px;
    padding-left: 12px;
    padding-right: 12px;
  }
  
  .article-title {
    font-size: 18px;
  }
  
  .category-header {
    padding: 12px 16px;
    margin-bottom: 16px;
  }
  
  .category-display {
    font-size: 16px;
  }
  
  .article-excerpt {
    font-size: 13px;
    -webkit-line-clamp: 2;
    max-height: 3.2em;
  }
  
  .meta-icon {
    width: 13px;
    height: 13px;
  }
  
  .article-meta {
    font-size: 13px;
    font-family: var(--vp-font-family-mono);
  }
  
  .article-date {
    font-size: 13px;
  }
}
</style>