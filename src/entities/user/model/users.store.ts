import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import type { UserService } from '../api/user.service'
import type { User, CreateUserDto, UpdateUserDto } from './types'

const STORAGE_KEYS = {
  CREATED: 'local_created_users',
  UPDATED: 'local_updated_users',
  DELETED: 'local_deleted_user_ids',
}

function getStored<T>(key: string, fallback: T): T {
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : fallback
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const createdUsers = ref<User[]>(getStored(STORAGE_KEYS.CREATED, []))
  const updatedUsers = ref<Record<number, UpdateUserDto>>(getStored(STORAGE_KEYS.UPDATED, {}))
  const deletedIds = ref<number[]>(getStored(STORAGE_KEYS.DELETED, []))

  const hasUsers = computed(() => users.value.length > 0)
  const service = () => ServiceProvider.get<UserService>('users')

  function applyLocalOverrides(serverUsers: User[]): User[] {
    return serverUsers
      .filter((u) => !deletedIds.value.includes(u.id))
      .map((u) => {
        const patch = updatedUsers.value[u.id]
        return patch ? { ...u, ...patch } : u
      })
  }

  async function fetchUsers(limit = 10, skip = 0, q = ''): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const data = await service().getAll({ limit, skip, q })
      let combined = applyLocalOverrides(data.items)

      if (skip === 0 && !q) {
        const localCreated = createdUsers.value.filter((u) => !deletedIds.value.includes(u.id))
        combined = [...localCreated, ...combined]
      }

      users.value = combined
      total.value = data.total + createdUsers.value.length - deletedIds.value.length
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUserById(id: number): Promise<User | null> {
    isLoading.value = true
    error.value = null
    try {
      const local = createdUsers.value.find((u) => u.id === id)
      let data: User

      if (local) {
        data = local
      } else {
        data = await service().getById(id)
      }

      const patch = updatedUsers.value[id]
      if (patch) {
        data = { ...data, ...patch }
      }

      currentUser.value = data
      return data
    } catch (err) {
      error.value = (err as Error).message
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(data: CreateUserDto): Promise<User> {
    isLoading.value = true
    error.value = null
    try {
      const created = await service().create(data)
      const simulated: User = { ...created, id: Date.now() }

      createdUsers.value = [simulated, ...createdUsers.value]
      localStorage.setItem(STORAGE_KEYS.CREATED, JSON.stringify(createdUsers.value))

      users.value = [simulated, ...users.value]
      total.value += 1
      return simulated
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
    isLoading.value = true
    error.value = null
    try {
      const updated = await service().update(id, data)

      updatedUsers.value[id] = { ...(updatedUsers.value[id] || {}), ...data }
      localStorage.setItem(STORAGE_KEYS.UPDATED, JSON.stringify(updatedUsers.value))

      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...updated }
      }
      if (currentUser.value?.id === id) {
        currentUser.value = { ...currentUser.value, ...updated }
      }
      return updated
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function removeUser(id: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      await service().delete(id)

      if (!deletedIds.value.includes(id)) {
        deletedIds.value.push(id)
        localStorage.setItem(STORAGE_KEYS.DELETED, JSON.stringify(deletedIds.value))
      }

      createdUsers.value = createdUsers.value.filter((u) => u.id !== id)
      localStorage.setItem(STORAGE_KEYS.CREATED, JSON.stringify(createdUsers.value))

      users.value = users.value.filter((u) => u.id !== id)
      total.value -= 1
      if (currentUser.value?.id === id) {
        currentUser.value = null
      }
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    total,
    currentUser,
    isLoading,
    error,
    hasUsers,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    removeUser,
  }
})
