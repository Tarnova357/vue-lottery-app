<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
import { useUsersStore } from '@/entities/user'
import type { CreateUserDto } from '@/entities/user'
import { UsersTable } from '@/widgets/users-table'
import { UserForm } from '@/features/user-form'
import { AppInput, AppButton } from '@/shared/ui'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const usersStore = useUsersStore()
const { users, total, isLoading } = storeToRefs(usersStore)

const limit = 10
const page = computed(() => Number(route.query.page) || 1)
const searchQuery = ref((route.query.q as string) || '')
const isCreateOpen = ref(false)

const totalPages = computed(() => Math.ceil(total.value / limit) || 1)

function syncData(): void {
  const skip = (page.value - 1) * limit
  usersStore.fetchUsers(limit, skip, searchQuery.value)
}

function updateQuery(newPage: number, newQ: string): void {
  router.push({
    query: {
      ...(newPage > 1 ? { page: newPage } : {}),
      ...(newQ ? { q: newQ } : {}),
    },
  })
}

function onSearch(): void {
  updateQuery(1, searchQuery.value)
}

function onPageChange(newPage: number): void {
  if (newPage >= 1 && newPage <= totalPages.value) {
    updateQuery(newPage, searchQuery.value)
  }
}

async function onCreateUser(dto: CreateUserDto): Promise<void> {
  await usersStore.createUser(dto)
  isCreateOpen.value = false
  toast.add({ severity: 'success', summary: 'Успіх', detail: 'Користувача створено', life: 3000 })
}

function onDeleteUser(id: number): void {
  usersStore.removeUser(id)
}

watch(
  () => route.query,
  () => {
    searchQuery.value = (route.query.q as string) || ''
    syncData()
  },
)

onMounted(() => {
  syncData()
})
</script>

<template>
  <div class="users-page">
    <div class="users-page__header">
      <h2>Таблиця учасників (DummyJSON Users)</h2>
      <AppButton label="Додати користувача" icon="pi pi-plus" @click="isCreateOpen = true" />
    </div>

    <div class="users-page__filters">
      <AppInput v-model="searchQuery" placeholder="Пошук за ім'ям..." @keydown.enter="onSearch" />
      <AppButton label="Шукати" icon="pi pi-search" severity="secondary" @click="onSearch" />
    </div>

    <UsersTable :users="users" :loading="isLoading" @delete-user="onDeleteUser" />

    <div class="users-page__pagination">
      <span class="users-page__page-info"
        >Сторінка {{ page }} з {{ totalPages }} (Всього: {{ total }})</span
      >
      <div class="users-page__page-buttons">
        <AppButton
          label="Попередня"
          severity="secondary"
          :disabled="page <= 1"
          @click="onPageChange(page - 1)"
        />
        <AppButton
          label="Наступна"
          severity="secondary"
          :disabled="page >= totalPages"
          @click="onPageChange(page + 1)"
        />
      </div>
    </div>

    <Dialog
      v-model:visible="isCreateOpen"
      header="Реєстрація нового користувача"
      modal
      :style="{ width: '45rem' }"
    >
      <UserForm :loading="isLoading" @submit="onCreateUser" @cancel="isCreateOpen = false" />
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.users-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__filters {
    display: flex;
    gap: 0.5rem;
    max-width: 450px;
  }

  &__pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid var(--p-content-border-color, #e2e8f0);
  }

  &__page-info {
    font-size: 0.875rem;
    color: var(--p-text-muted-color, #64748b);
  }

  &__page-buttons {
    display: flex;
    gap: 0.5rem;
  }
}
</style>
