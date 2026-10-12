import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ServiceProvider } from '@/services/service-provider'
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user'

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

  function applyLocalOverrides(serverUsers: User[]): User[] {
    return serverUsers
      .filter((u) => !deletedIds.value.includes(u.id))
      .map((u) => {
        const patch = updatedUsers.value[u.id]
        return patch ? { ...u, ...patch } : u
      })
  }

  async function fetchUsers(params: { limit: number; skip: number; q?: string }): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const result = await ServiceProvider.users.getAll(params)
      let combined = applyLocalOverrides(result.items)

      if (params.skip === 0 && !params.q) {
        const localCreated = createdUsers.value.filter((u) => !deletedIds.value.includes(u.id))
        combined = [...localCreated, ...combined]
      }

      users.value = combined
      total.value = result.total + createdUsers.value.length - deletedIds.value.length
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
        data = await ServiceProvider.users.getById(id)
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
      const created = await ServiceProvider.users.create(data)
      const simulatedUser: User = { ...created, id: Date.now() }

      createdUsers.value = [simulatedUser, ...createdUsers.value]
      localStorage.setItem(STORAGE_KEYS.CREATED, JSON.stringify(createdUsers.value))

      users.value = [simulatedUser, ...users.value]
      total.value += 1
      return simulatedUser
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
      const updated = await ServiceProvider.users.update(id, data)

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

  async function deleteUser(id: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      await ServiceProvider.users.delete(id)

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
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
  }
})
