<script setup lang="ts">
import { onMounted } from 'vue'
import Toast from 'primevue/toast'
import { AppHeader } from '@/widgets/app-header'
import { AppConfirmDialog } from '@/shared/ui'
import { useThemeStore } from '@/features/theme-toggle'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.applyTheme()
})
</script>

<template>
  <div class="app-layout">
    <Toast position="top-right" />
    <AppConfirmDialog />
    <AppHeader />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
