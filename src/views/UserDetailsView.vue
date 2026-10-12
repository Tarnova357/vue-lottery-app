<script setup lang="ts">
import { onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'

const props = defineProps<{
  id: string
}>()

const usersStore = useUsersStore()

onMounted(() => {
  usersStore.fetchUserById(Number(props.id))
})
</script>

<template>
  <div>
    <div v-if="usersStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status" />
    </div>

    <div v-else-if="usersStore.error" class="alert alert-danger">
      {{ usersStore.error }}
    </div>

    <div v-else-if="usersStore.currentUser" class="lottery-card col-md-8 mx-auto">
      <div class="d-flex align-items-center gap-3 pb-3 border-bottom mb-3">
        <img
          v-if="usersStore.currentUser.image"
          :src="usersStore.currentUser.image"
          alt="Avatar"
          class="rounded-circle border"
          width="64"
          height="64"
        />
        <div>
          <h3 class="h5 mb-0">
            {{ usersStore.currentUser.firstName }} {{ usersStore.currentUser.lastName }}
          </h3>
          <span class="text-muted">@{{ usersStore.currentUser.username }}</span>
        </div>
      </div>

      <div class="mb-4">
        <p class="mb-2"><strong>Email:</strong> {{ usersStore.currentUser.email }}</p>
        <p class="mb-2"><strong>Phone:</strong> {{ usersStore.currentUser.phone }}</p>
        <p class="mb-2"><strong>Age:</strong> {{ usersStore.currentUser.age }}</p>
        <p class="mb-2"><strong>Gender:</strong> {{ usersStore.currentUser.gender }}</p>
      </div>

      <div class="d-flex justify-content-between pt-3 border-top">
        <RouterLink to="/users" class="btn btn-secondary app-button"> Назад до списку </RouterLink>
        <RouterLink :to="{ name: 'user-edit', params: { id } }" class="btn btn-primary app-button">
          Редагувати профіль
        </RouterLink>
      </div>
    </div>
  </div>
</template>
