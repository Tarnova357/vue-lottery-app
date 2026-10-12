<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import type { User, CreateUserDto } from '@/types/user'
import SearchBar from '@/components/participants/SearchBar.vue'
import ParticipantsTable from '@/components/participants/ParticipantsTable.vue'
import RegisterForm from '@/components/participants/RegisterForm.vue'
import DeleteConfirmModal from '@/components/participants/DeleteConfirmModal.vue'
import AppModal from '@/components/base/AppModal.vue'
import AppButton from '@/components/base/AppButton.vue'

const usersStore = useUsersStore()
const router = useRouter()
const route = useRoute()

const limit = 10
const page = computed(() => Number(route.query.page) || 1)
const searchQuery = ref((route.query.q as string) || '')

const showAddModal = ref(false)
const showDeleteModal = ref(false)
const selectedUser = ref<User | null>(null)

const totalPages = computed(() => Math.ceil(usersStore.total / limit) || 1)

function syncData() {
  const skip = (page.value - 1) * limit
  usersStore.fetchUsers({ limit, skip, q: searchQuery.value })
}

function updateUrlQuery(newPage: number, newQ: string) {
  router.push({
    query: {
      ...(newPage > 1 ? { page: newPage } : {}),
      ...(newQ ? { q: newQ } : {}),
    },
  })
}

function handleSearch() {
  updateUrlQuery(1, searchQuery.value)
}

function handleChangePage(newPage: number) {
  if (newPage >= 1 && newPage <= totalPages.value) {
    updateUrlQuery(newPage, searchQuery.value)
  }
}

async function handleAddUser(userData: CreateUserDto) {
  await usersStore.createUser(userData)
  showAddModal.value = false
}

function openDeleteModal(user: User) {
  selectedUser.value = user
  showDeleteModal.value = true
}

async function confirmDeleteUser() {
  if (selectedUser.value) {
    await usersStore.deleteUser(selectedUser.value.id)
    showDeleteModal.value = false
    selectedUser.value = null
  }
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
  <div class="lottery-card">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0">Таблиця учасників (DummyJSON Users)</h2>
      <AppButton variant="primary" @click="showAddModal = true"> Додати користувача </AppButton>
    </div>

    <SearchBar v-model="searchQuery" @search="handleSearch" />

    <div v-if="usersStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status" />
      <div class="mt-2 text-muted">Завантаження користувачів...</div>
    </div>

    <div v-else-if="usersStore.error" class="alert alert-danger" role="alert">
      {{ usersStore.error }}
    </div>

    <ParticipantsTable
      v-else
      :users="usersStore.users"
      :current-page="page"
      :total-pages="totalPages"
      @delete="openDeleteModal"
      @change-page="handleChangePage"
    />

    <AppModal
      :is-open="showAddModal"
      title="Реєстрація нового користувача"
      @close="showAddModal = false"
    >
      <RegisterForm @add-user="handleAddUser" />
    </AppModal>

    <DeleteConfirmModal
      :is-open="showDeleteModal"
      :user="selectedUser"
      @close="showDeleteModal = false"
      @confirm-delete="confirmDeleteUser"
    />
  </div>
</template>
