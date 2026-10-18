<script setup lang="ts">
import { useSessionStore } from '@/entities/session'
import { LogoutButton } from '@/features/auth'
import { ThemeToggle } from '@/features/theme-toggle'
import { AppButton } from '@/shared/ui'

const sessionStore = useSessionStore()
</script>

<template>
  <header class="app-header">
    <div class="app-header__container">
      <RouterLink to="/" class="app-header__logo">
        <span class="app-header__accent">Lottery</span>App
      </RouterLink>

      <nav class="app-header__nav">
        <RouterLink to="/" class="app-header__link">Home</RouterLink>
        <RouterLink to="/about" class="app-header__link">About author</RouterLink>
        <RouterLink to="/users" class="app-header__link">Users</RouterLink>
      </nav>

      <div class="app-header__actions">
        <ThemeToggle />
        <LogoutButton v-if="sessionStore.isAuthenticated" />
        <RouterLink v-else to="/login">
          <AppButton label="Login" size="small" />
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  border-bottom: 1px solid var(--p-content-border-color, #e2e8f0);
  background-color: var(--p-content-background, #ffffff);

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.85rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__logo {
    font-size: 1.25rem;
    font-weight: 800;
    text-decoration: none;
    color: var(--p-text-color);
  }

  &__accent {
    color: var(--p-primary-color, #3b82f6);
  }

  &__nav {
    display: flex;
    gap: 1.5rem;
  }

  &__link {
    text-decoration: none;
    color: var(--p-text-muted-color, #64748b);
    font-weight: 500;

    &.router-link-active {
      color: var(--p-primary-color, #3b82f6);
      font-weight: 700;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
}
</style>
