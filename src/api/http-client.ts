const BASE_URL = import.meta.env.VITE_API_URL

interface HttpOptions extends RequestInit {
  skipAuth?: boolean
}

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else if (token) {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

async function refreshToken(): Promise<string> {
  const storedRefreshToken = localStorage.getItem('refreshToken')
  if (!storedRefreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refreshToken: storedRefreshToken,
      expiresInMins: 30,
    }),
  })

  if (!response.ok) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    window.location.href = '/login'
    throw new Error('Failed to refresh token')
  }

  const data = await response.json()
  localStorage.setItem('accessToken', data.accessToken)
  localStorage.setItem('refreshToken', data.refreshToken)
  return data.accessToken
}

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const { skipAuth = false, headers = {}, ...restOptions } = options
  const token = localStorage.getItem('accessToken')

  const requestHeaders = new Headers(headers)
  if (!requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  if (token && !skipAuth) {
    requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...restOptions,
    headers: requestHeaders,
  })

  if (
    response.status === 401 &&
    !skipAuth &&
    !path.includes('/auth/login') &&
    !path.includes('/auth/refresh')
  ) {
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((newToken) => {
        requestHeaders.set('Authorization', `Bearer ${newToken}`)
        return http<T>(path, { ...options, headers: requestHeaders })
      })
    }

    isRefreshing = true

    try {
      const newToken = await refreshToken()
      processQueue(null, newToken)
      requestHeaders.set('Authorization', `Bearer ${newToken}`)
      return await http<T>(path, { ...options, headers: requestHeaders })
    } catch (refreshErr) {
      processQueue(refreshErr, null)
      throw refreshErr
    } finally {
      isRefreshing = false
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = errorBody?.message || `HTTP ${response.status}: ${response.statusText}`
    throw new Error(message)
  }

  return response.json() as Promise<T>
}
