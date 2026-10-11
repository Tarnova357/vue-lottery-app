import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ServiceProvider } from '@/services/service-provider'
import type { LoginRequest, AuthResponse, CurrentUser } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('accessToken'))
  const user = ref<CurrentUser | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  )
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => Boolean(token.value))

  async function login(credentials: LoginRequest): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response: AuthResponse = await ServiceProvider.auth.login(credentials)
      token.value = response.accessToken
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)

      const currentUser: CurrentUser = {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        username: response.username,
        age: 0,
        gender: response.gender as 'male' | 'female' | 'other',
        phone: '',
        image: response.image,
      }
      user.value = currentUser
      localStorage.setItem('user', JSON.stringify(currentUser))
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function logout(): void {
    token.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  async function fetchMe(): Promise<void> {
    if (!token.value) return
    try {
      user.value = await ServiceProvider.auth.getCurrentUser()
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch {
      logout()
    }
  }

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    fetchMe,
  }
})
