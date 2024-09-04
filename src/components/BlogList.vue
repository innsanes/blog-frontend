<template>
  <div class="blog-list">
    <h1>Innsane Blog</h1>
    <el-table :data="blogs" style="width: 100%">
      <el-table-column prop="name" label="Title">
        <template #default="scope">
          <RouterLink :to="blogRouter(scope.row.id)">{{ scope.row.name }}</RouterLink>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="CreateTime"  width="180">
        <template #default="scope">
          <span>{{ timeFormat(scope.row.createTime) }}</span>
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
.el-button {
  margin-bottom: 20px;
}
.blog-list {
  max-width: 1000px;
  margin: 0 auto;
}
</style>