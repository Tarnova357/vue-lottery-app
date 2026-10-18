<script setup lang="ts">
import { AppButton } from '@/shared/ui'
</script>

<template>
  <div class="not-found-page">
    <h1>404</h1>
    <p>Сторінку не знайдено</p>
    <RouterLink to="/">
      <AppButton label="На головну" class="mt-3" />
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.not-found-page {
  text-align: center;
  padding: 5rem 0;

  h1 {
    font-size: 5rem;
    font-weight: 800;
    color: var(--p-primary-color, #3b82f6);
  }

  p {
    color: var(--p-text-muted-color, #64748b);
    font-size: 1.25rem;
  }
}
</style>
