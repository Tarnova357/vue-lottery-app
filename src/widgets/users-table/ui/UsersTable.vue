<script setup lang="ts">
import Column from 'primevue/column'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import type { User } from '@/entities/user'
import { AppTable, AppButton } from '@/shared/ui'

interface Props {
  users: User[]
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'deleteUser', id: number): void
}>()

const confirm = useConfirm()
const toast = useToast()

function confirmDelete(user: User): void {
  confirm.require({
    message: `Ви дійсно бажаєте видалити ${user.firstName} ${user.lastName}?`,
    header: 'Підтвердження видалення',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Ні',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Так',
      severity: 'danger',
    },
    accept: () => {
      emit('deleteUser', user.id)
      toast.add({
        severity: 'success',
        summary: 'Успіх',
        detail: 'Користувача видалено',
        life: 3000,
      })
    },
  })
}
</script>

<template>
  <AppTable :value="users" :loading="loading">
    <Column field="id" header="#" style="width: 4rem" />
    <Column header="Ім'я">
      <template #body="{ data }">
        <strong>{{ data.firstName }} {{ data.lastName }}</strong>
      </template>
    </Column>
    <Column field="email" header="Email" />
    <Column field="username" header="Username">
      <template #body="{ data }"> @{{ data.username }} </template>
    </Column>
    <Column field="phone" header="Телефон" />
    <Column header="Дії" style="width: 12rem; text-align: center">
      <template #body="{ data }">
        <div class="users-table__actions">
          <RouterLink :to="`/users/${data.id}`">
            <AppButton icon="pi pi-eye" size="small" variant="text" severity="info" />
          </RouterLink>
          <RouterLink :to="`/users/${data.id}/edit`">
            <AppButton icon="pi pi-pencil" size="small" variant="text" severity="warn" />
          </RouterLink>
          <AppButton
            icon="pi pi-trash"
            size="small"
            variant="text"
            severity="danger"
            @click="confirmDelete(data)"
          />
        </div>
      </template>
    </Column>
  </AppTable>
</template>

<style scoped lang="scss">
.users-table__actions {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
}
</style>
