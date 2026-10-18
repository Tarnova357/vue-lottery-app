<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { AppButton } from '@/shared/ui'

const sessionStore = useSessionStore()
const router = useRouter()

function onLogout(): void {
  sessionStore.clearSession()
  router.push({ name: 'login' })
}
</script>

<template>
  <AppButton label="Logout" severity="danger" variant="outlined" size="small" @click="onLogout" />
</template>
