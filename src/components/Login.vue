<template>
  <div class="login-container">
    <el-card style="max-width: 600px">
        <template #header>
            <div class="card-header">
                <span>Login</span>
            </div>
        </template>
        <el-form :model="form" :rules="rules" ref="loginForm" label-width="100px">
        <el-form-item label="Username" prop="username">
            <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
            <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleLogin">Login</el-button>
        </el-form-item>
        </el-form>
    </el-card>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import { login } from '../api/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const form = ref({
  username: '',
  password: ''
})

const rules = ref({
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' }
  ]
})

const loginForm = ref(null)
const userStore = useUserStore()
const router = useRouter()

const handleLogin = () => {
  loginForm.value.validate((valid: boolean) => {
    if (valid) {
      login({ name: form.value.username, password: form.value.password })
        .then(response => {
          userStore.token = response.token
          ElMessage.success('Login successful')
          router.push('/')
        })
        .catch(error => {
          ElMessage.error('Login failed: ' + error.message)
        })
    } else {
      ElMessage.error('Please fill in the form correctly')
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
</style>
