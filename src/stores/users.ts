import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ServiceProvider } from '@/services/service-provider'
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers(params: { limit: number; skip: number; q?: string }): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const result = await ServiceProvider.users.getAll(params)
      users.value = result.items
      total.value = result.total
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
      const data = await ServiceProvider.users.getById(id)
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
