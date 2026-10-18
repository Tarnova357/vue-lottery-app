<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/entities/user'
import { AppButton } from '@/shared/ui'

const props = defineProps<{ id: string }>()
const usersStore = useUsersStore()
const { currentUser, isLoading } = storeToRefs(usersStore)

onMounted(() => {
  usersStore.fetchUserById(Number(props.id))
})
</script>

<template>
  <div class="user-details-page">
    <div v-if="isLoading" class="user-details-page__loading">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <div v-else-if="currentUser" class="user-details-page__card">
      <div class="user-details-page__header">
        <img
          v-if="currentUser.image"
          :src="currentUser.image"
          alt="Avatar"
          class="user-details-page__avatar"
        />
        <div>
          <h2>{{ currentUser.firstName }} {{ currentUser.lastName }}</h2>
          <span class="user-details-page__username">@{{ currentUser.username }}</span>
        </div>
      </div>

      <div class="user-details-page__body">
        <p><strong>Email:</strong> {{ currentUser.email }}</p>
        <p><strong>Phone:</strong> {{ currentUser.phone }}</p>
        <p><strong>Age:</strong> {{ currentUser.age }}</p>
        <p><strong>Gender:</strong> {{ currentUser.gender }}</p>
      </div>

      <div class="user-details-page__actions">
        <RouterLink to="/users">
          <AppButton label="Назад до списку" severity="secondary" variant="outlined" />
        </RouterLink>
        <RouterLink :to="`/users/${currentUser.id}/edit`">
          <AppButton label="Редагувати профіль" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-details-page {
  max-width: 600px;
  margin: 0 auto;

  &__loading {
    text-align: center;
    padding: 3rem 0;
  }

  &__card {
    background: var(--p-content-background, #ffffff);
    border: 1px solid var(--p-content-border-color, #e2e8f0);
    padding: 2rem;
    border-radius: var(--p-border-radius, 8px);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--p-content-border-color, #e2e8f0);
  }

  &__avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 2px solid var(--p-content-border-color, #cbd5e1);
  }

  &__username {
    color: var(--p-text-muted-color, #64748b);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    padding-top: 1rem;
    border-top: 1px solid var(--p-content-border-color, #e2e8f0);
  }
}
</style>
