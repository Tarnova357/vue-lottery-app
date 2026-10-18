<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { type CreateUserDto, useUsersStore } from '@/entities/user'
import type { UpdateUserDto } from '@/entities/user'
import { UserForm } from '@/features/user-form'

const props = defineProps<{ id: string }>()
const router = useRouter()
const toast = useToast()
const usersStore = useUsersStore()
const { currentUser, isLoading } = storeToRefs(usersStore)

onMounted(() => {
  usersStore.fetchUserById(Number(props.id))
})

async function onUpdate(data: CreateUserDto | UpdateUserDto): Promise<void> {
  await usersStore.updateUser(Number(props.id), data)
  toast.add({ severity: 'success', summary: 'Успіх', detail: 'Дані оновлено', life: 3000 })
  router.push(`/users/${props.id}`)
}
</script>

<template>
  <div class="user-edit-page">
    <div class="user-edit-page__card">
      <h2 class="user-edit-page__title">Редагування користувача #{{ id }}</h2>
      <UserForm
        v-if="currentUser"
        :initial-data="currentUser"
        :loading="isLoading"
        @submit="onUpdate"
        @cancel="router.back()"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-edit-page {
  max-width: 650px;
  margin: 0 auto;

  &__card {
    background: var(--p-content-background, #ffffff);
    border: 1px solid var(--p-content-border-color, #e2e8f0);
    padding: 2rem;
    border-radius: var(--p-border-radius, 8px);
  }

  &__title {
    margin-bottom: 1.5rem;
  }
}
</style>
