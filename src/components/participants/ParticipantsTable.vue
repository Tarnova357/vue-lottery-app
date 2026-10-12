<script setup lang="ts">
import type { User } from '@/types/user'
import AppButton from '@/components/base/AppButton.vue'

interface Props {
  users: User[]
  currentPage: number
  totalPages: number
}

defineProps<Props>()

defineEmits<{
  (e: 'delete', user: User): void
  (e: 'change-page', page: number): void
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table custom-table align-middle">
      <thead>
        <tr>
          <th class="col-num">#</th>
          <th>Ім'я</th>
          <th>Email</th>
          <th>Username</th>
          <th>Телефон</th>
          <th class="text-center">Деталі</th>
          <th class="text-center">Редагування</th>
          <th class="text-center">Видалення</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="users.length === 0">
          <td colspan="8" class="text-center py-4 text-muted">Користувачів не знайдено</td>
        </tr>
        <tr v-for="user in users" v-else :key="user.id">
          <td class="col-num">{{ user.id }}</td>
          <td class="fw-semibold">{{ user.firstName }} {{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>@{{ user.username }}</td>
          <td>{{ user.phone }}</td>
          <td class="text-center">
            <RouterLink
              :to="{ name: 'user-details', params: { id: user.id } }"
              class="btn btn-sm btn-outline-info"
            >
              Перегляд
            </RouterLink>
          </td>
          <td class="text-center">
            <RouterLink
              :to="{ name: 'user-edit', params: { id: user.id } }"
              class="btn btn-sm btn-outline-primary"
            >
              Редагувати
            </RouterLink>
          </td>
          <td class="text-center">
            <AppButton variant="danger" class="btn-action" @click="$emit('delete', user)">
              Видалити
            </AppButton>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
      <span class="text-muted small">Сторінка {{ currentPage }} з {{ totalPages }}</span>
      <div class="d-flex gap-2">
        <AppButton
          variant="secondary"
          :disabled="currentPage <= 1"
          @click="$emit('change-page', currentPage - 1)"
        >
          Попередня
        </AppButton>
        <AppButton
          variant="secondary"
          :disabled="currentPage >= totalPages"
          @click="$emit('change-page', currentPage + 1)"
        >
          Наступна
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-table {
  margin-bottom: 0;

  thead th {
    font-size: 0.9rem;
    font-weight: 700;
    color: #495057;
    border-bottom: 2px solid #e9ecef;
    padding: 0.75rem 0.6rem;
    white-space: nowrap;
  }

  tbody td {
    font-size: 0.9rem;
    color: #495057;
    border-bottom: 1px solid #f1f3f5;
    padding: 0.75rem 0.6rem;
  }
}

.col-num {
  color: #adb5bd;
  width: 50px;
}

.btn-action {
  padding: 0.25rem 0.65rem;
  font-size: 0.82rem;
}
</style>
