import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home').then((m) => m.HomePage),
    meta: { title: 'Головна' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/about').then((m) => m.AboutPage),
    meta: { title: 'Про автора' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login').then((m) => m.LoginPage),
    meta: { title: 'Авторизація' },
  },
  {
    path: '/users',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'users-list',
        component: () => import('@/pages/users').then((m) => m.UsersPage),
        meta: { title: 'Користувачі' },
      },
      {
        path: ':id',
        name: 'user-details',
        component: () => import('@/pages/user-details').then((m) => m.UserDetailsPage),
        props: true,
        meta: { title: 'Деталі користувача' },
      },
      {
        path: ':id/edit',
        name: 'user-edit',
        component: () => import('@/pages/user-edit').then((m) => m.UserEditPage),
        props: true,
        meta: { title: 'Редагування користувача' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/not-found').then((m) => m.NotFoundPage),
    meta: { title: '404 Не знайдено' },
  },
]
