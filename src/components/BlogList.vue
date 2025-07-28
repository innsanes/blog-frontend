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
    
    <el-table 
      :data="blogs" 
      class="vp-table"
      :show-header="true"
    >
      <el-table-column prop="name">
        <template #default="scope">
          <div class="blog-item">
            <div class="title-with-categories">
              <RouterLink 
                class="vp-link blog-title" 
                :to="blogRouter(scope.row.id)"
              >
                {{ scope.row.name }}
              </RouterLink>
              <span class="blog-categories" v-if="scope.row.categories && scope.row.categories.length > 0">
                <Category
                  v-for="category in scope.row.categories"
                  :key="category"
                  :category="category"
                />
              </span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column 
        prop="createTime" 
        width="120"
        class-name="vp-time-cell"
      >
        <template #default="scope">
          <span class="vp-time">
            {{ timeFormatDate(scope.row.createTime) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
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
  const size = parseInt(route.query.size as string) || 10
  const useCursor = route.query.useCursor === 'true'
  const cursor = parseInt(route.query.cursor as string) || undefined
  const forward = route.query.forward === 'true'
  
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
}

/* 博客项容器 */
.blog-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 标题和分类容器 */
.title-with-categories {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 12px;
}

/* 博客标题 */
.blog-title {
  font-weight: 500;
  line-height: 1.4;
  flex-shrink: 0;
}

/* 分类标签容器 */
.blog-categories {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
}

/* 表格样式 */
.vp-table {
  width: 100%;
  background: var(--vp-c-bg);
  --el-table-border-color: transparent;
  --el-table-header-bg-color: transparent;
}

/* 隐藏表头 */
.vp-table :deep(.el-table__header) {
  display: none;
}

/* 行样式 */
.vp-table :deep(.el-table__row) {
  background: var(--vp-c-bg);
  transition: background-color 0.25s;
}

.vp-table :deep(.el-table__row):hover {
  background: var(--vp-c-bg-alt) !important;
}

/* 单元格样式 */
.vp-table :deep(.el-table__cell) {
  padding: 12px 0;
  border: none !important;
  border-bottom: 1px solid var(--vp-c-divider) !important;
}

/* 链接样式 */
.vp-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.25s;
}

.vp-link:hover {
  color: var(--vp-c-brand);
  text-decoration: underline;
}

/* 时间样式 */
.vp-time {
  color: var(--vp-c-text-2);
  font-size: 0.9em;
  font-family: var(--vp-font-family-mono);
  float: right;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .blog-list {
    padding: 0 16px;
    margin-top: calc(var(--vp-nav-height) + 16px);
  }

  /* 隐藏表头 */
  .vp-table :deep(.el-table__header) {
    display: none;
  }

  /* 表格行变为垂直布局 */
  .vp-table :deep(.el-table__row) {
    display: block;
    margin-bottom: 16px;
    padding: 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    background: var(--vp-c-bg-soft);
  }

  /* 单元格布局调整 */
  .vp-table :deep(.el-table__cell) {
    display: block;
    border: none !important;
    padding: 0 !important;
  }

  /* 标题单元格：占满一行 */
  .vp-table :deep(.el-table__cell:first-child) {
    margin-bottom: 8px;
  }

  /* 创建第二行的flex容器 */
  .vp-table :deep(.el-table__row)::after {
    content: '';
    display: block;
    clear: both;
  }

  /* 时间单元格 */
  .vp-table :deep(.vp-time-cell) {
    float: right;
    text-align: right;
  }

  /* 时间样式调整 */
  .vp-time {
    display: inline-block;
    margin-top: 0;
    font-size: 0.8em;
    color: var(--vp-c-text-3);
  }

  /* 移动端：标题和分类垂直布局 */
  .title-with-categories {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  /* 分类标签样式调整 */
  .blog-categories {
    margin-top: 0;
    display: flex;
  }

  /* 标题样式 */
  .blog-title {
    font-size: 16px;
    line-height: 1.3;
  }
}

/* 中等屏幕优化 */
@media (max-width: 768px) and (min-width: 481px) {
  .blog-list {
    padding: 0 20px;
  }
}
</style>