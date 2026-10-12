<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AppButton from '@/components/base/AppButton.vue'

const authStore = useAuthStore()
const router = useRouter()

function handleAuth() {
  if (authStore.isAuthenticated) {
    authStore.logout()
    router.push({ name: 'login' })
  } else {
    router.push({ name: 'login' })
  }
}
</script>

<template>
  <div class="nav-container">
    <nav class="nav-links">
      <RouterLink to="/" class="nav-item">Home</RouterLink>
      <RouterLink to="/about" class="nav-item">About author</RouterLink>
      <RouterLink to="/users" class="nav-item">Users</RouterLink>
    </nav>

    <AppButton
      :variant="authStore.isAuthenticated ? 'danger' : 'primary'"
      class="nav-auth-btn"
      @click="handleAuth"
    >
      {{ authStore.isAuthenticated ? 'Logout' : 'Login' }}
    </AppButton>
  </div>
</template>

<style scoped lang="scss">
.nav-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.nav-item {
  color: #495057;
  font-weight: 500;
  text-decoration: none;
  font-size: 0.95rem;
  padding-bottom: 0.2rem;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: #33a3dc;
  }

  &.router-link-active {
    color: #33a3dc;
    font-weight: 700;
    border-bottom-color: #33a3dc;
  }
}

.nav-auth-btn {
  padding: 0.35rem 1rem;
  font-size: 0.88rem;
}
</style>
