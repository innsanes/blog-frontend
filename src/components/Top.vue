<template>
    <nav>
        <RouterLink v-if="userStore.token === ''" to="/login">Login</RouterLink>
        <RouterLink to="/">Home</RouterLink>
    </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

</script>

<style scoped></style>
