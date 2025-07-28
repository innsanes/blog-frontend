<template>
  <div class="vp-doc blog-list">
    <el-table 
      :data="blogs" 
      class="vp-table"
      :show-header="true"
    >
      <el-table-column prop="name">
        <template #default="scope">
          <div class="blog-item">
            <RouterLink 
              class="vp-link blog-title" 
              :to="blogRouter(scope.row.id)"
            >
              {{ scope.row.name }}
            </RouterLink>
          </div>
        </template>
      </el-table-column>
      <el-table-column 
        prop="tags" 
        width="100"
        class-name="vp-tags-cell"
      >
        <template #default="scope">
          <div class="blog-tags" v-if="scope.row.tags && scope.row.tags.length > 0">
            <el-tag
              v-for="tag in scope.row.tags"
              :key="tag"
              size="small"
              type="info"
              class="blog-tag"
            >
              {{ tag }}
            </el-tag>
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
import { ref, onMounted } from 'vue'
import { bloglist, type BlogListItem, type BlogListParams } from '../api/blog'
import { useRouter } from 'vue-router'
import { ElMessage, ElTag } from 'element-plus'
import { timeFormatDate } from '../util/time'

const blogs = ref<BlogListItem[]>([])
const totalCount = ref<number>(0)

const blogRouter = function (id: number) {
  return '/blog/' + id
}

const fetchBlogs = async (params?: BlogListParams) => {
  try {
    const response = await bloglist(params)
    // 根据实际API响应结构调整数据访问路径
    // 如果后端直接返回BlogListResponse结构
    if (response.data.data && response.data.count !== undefined) {
      blogs.value = response.data.data
      totalCount.value = response.data.count
    }
    // 如果后端返回被包装的结构（如 {code, data: BlogListResponse, message}）
    else if (response.data && response.data.data && response.data.data.data && response.data.data.count !== undefined) {
      blogs.value = response.data.data.data
      totalCount.value = response.data.data.count
    }
    // 兜底：保持原有逻辑
    else {
      blogs.value = response.data?.data || response.data || []
      totalCount.value = response.data?.count || blogs.value.length
    }
  } catch (error: any) {
    ElMessage.error('获取博客列表失败: ' + (error.message || '未知错误'))
  }
}

const router = useRouter()

onMounted(() => {
  // 默认获取前10条博客
  fetchBlogs({ size: 10 })
})

// 暴露给外部使用的方法
defineExpose({
  fetchBlogs,
  refresh: () => fetchBlogs({ size: 10 })
})
</script>

<style scoped>
/* 基础布局 */
.blog-list {
  max-width: 1024px;
  margin: calc(var(--vp-nav-height) + 24px) auto 0;
  padding: 0 24px;
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

/* 博客标题 */
.blog-title {
  font-weight: 500;
  line-height: 1.4;
}

/* 标签容器 */
.blog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* 标签样式 */
.blog-tag {
  --el-tag-bg-color: var(--vp-c-default-soft);
  --el-tag-border-color: var(--vp-c-border);
  --el-tag-text-color: var(--vp-c-text-2);
  border-radius: 12px;
  font-size: 12px;
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

  /* 第二行：标签和时间的容器 */
  .vp-table :deep(.vp-tags-cell),
  .vp-table :deep(.vp-time-cell) {
    display: inline-block;
    vertical-align: middle;
  }

  /* 标签单元格 */
  .vp-table :deep(.vp-tags-cell) {
    float: left;
    max-width: 60%;
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

  /* 标签样式调整 */
  .blog-tags {
    margin-top: 0;
    display: inline-block;
  }

  .blog-tag {
    font-size: 11px;
    margin-right: 4px;
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