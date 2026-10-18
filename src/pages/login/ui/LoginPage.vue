<script setup lang="ts">
import { LoginForm } from '@/features/auth'
</script>

<template>
  <div class="login-page">
    <div class="login-page__card">
      <h2 class="login-page__title">Вхід у систему</h2>
      <LoginForm />
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;

  &__card {
    width: 100%;
    max-width: 420px;
    background: var(--p-content-background, #ffffff);
    border: 1px solid var(--p-content-border-color, #e2e8f0);
    padding: 2rem;
    border-radius: var(--p-border-radius, 8px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  &__title {
    text-align: center;
    margin-bottom: 1.5rem;
  }
}
</style>
