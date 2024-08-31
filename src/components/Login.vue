<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <div>
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="username" required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required />
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
// 可以在组件中的任意位置访问 `store` 变量 ✨
const userStore = useUserStore()
const username = ref('')
const password = ref('')

const handleLogin = () => {
    // 处理登录逻辑
    if (username.value && password.value) {
        userStore.userlogin({ username: username.value, password: password.value })
            .then(response => {
                console.log('Login successful:', response)
            })
            .catch(error => {
                console.error('Login failed:', error)
            })
    } else {
        console.error('Username and password are required')
    }
}
</script>

<style scoped>
/* 添加一些简单的样式 */
form {
    display: flex;
    flex-direction: column;
    width: 300px;
    margin: auto;
}

div {
    margin-bottom: 10px;
}

label {
    margin-bottom: 5px;
}

input {
    padding: 8px;
    font-size: 16px;
}

button {
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
}
</style>
