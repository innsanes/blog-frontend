<template>
  <div class="vp-doc blog-list">
    <el-table 
      :data="blogs" 
      class="vp-table"
      :show-header="true"
    >
      <el-table-column prop="name">
        <template #default="scope">
          <RouterLink 
            class="vp-link" 
            :to="blogRouter(scope.row.id)"
          >
            {{ scope.row.name }}
          </RouterLink>
        </template>
      </el-table-column>
      <el-table-column 
        prop="createTime" 
        width="180"
        class-name="vp-time-cell"
      >
        <template #default="scope">
          <span class="vp-time">
            {{ timeFormat(scope.row.createTime) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { bloglist } from '../api/blog'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { timeFormat } from '../util/time'

const blogs = ref([])

const blogRouter = function (id: number) {
  return '/blog/' + id
}

const fetchBlogs = async () => {
  try {
    const response = await bloglist()
    blogs.value = response
  } catch (error) {
    ElMessage.error('Failed to fetch blogs: ' + error.message)
  }
}

const router = useRouter()

onMounted(() => {
  fetchBlogs()
})
</script>

<style scoped>
/* 基础布局 */
.blog-list {
  max-width: 1024px;
  margin: calc(var(--vp-nav-height) + 24px) auto 0;
  padding: 0 24px;
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
@media (max-width: 768px) {
  .blog-list {
    padding: 0 16px;
    margin-top: calc(var(--vp-nav-height) + 16px);
  }

  .vp-time {
    float: none;
    display: block;
    margin-top: 4px;
  }

  .vp-table :deep(.el-table__cell) {
    display: flex;
    flex-direction: column;
    padding: 16px 0;
  }
}
</style>