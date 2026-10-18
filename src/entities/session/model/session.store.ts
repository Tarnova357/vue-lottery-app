import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import type { AuthService } from '../api/auth.service'
import type { LoginRequest, CurrentUser } from './types'

const STORAGE_KEYS = {
  TOKEN: 'session:token',
  REFRESH_TOKEN: 'session:refreshToken',
  USER: 'session:user',
}

export const useSessionStore = defineStore('session', () => {
  const accessToken = ref<string | null>(
    localStorage.getItem(STORAGE_KEYS.TOKEN) || localStorage.getItem('accessToken'),
  )
  const refreshToken = ref<string | null>(
    localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || localStorage.getItem('refreshToken'),
  )
  const user = ref<CurrentUser | null>(
    localStorage.getItem(STORAGE_KEYS.USER)
      ? JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)!)
      : localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')!)
        : null,
  )

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => accessToken.value !== null)

  const authService = () => ServiceProvider.get<AuthService>('auth')

  async function login(credentials: LoginRequest): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService().login(credentials)
      setSession(response.accessToken, response.refreshToken)

      const currentUser: CurrentUser = {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        username: response.username,
        gender: response.gender,
        image: response.image,
      }
      user.value = currentUser
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser))
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function setSession(token: string, refToken?: string): void {
    accessToken.value = token
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    localStorage.setItem('accessToken', token)

    if (refToken) {
      refreshToken.value = refToken
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refToken)
      localStorage.setItem('refreshToken', refToken)
    }
  }

  function clearSession(): void {
    accessToken.value = null
    refreshToken.value = null
    user.value = null

    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  return {
    accessToken,
    refreshToken,
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    setSession,
    clearSession,
  }
})
