import { http } from '@/api/http-client'
import type { LoginRequest, AuthResponse, CurrentUser } from '@/types/auth'

export class AuthService {
  login(credentials: LoginRequest): Promise<AuthResponse> {
    return http<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true,
    })
  }

  getCurrentUser(): Promise<CurrentUser> {
    return http<CurrentUser>('/auth/me')
  }
}
