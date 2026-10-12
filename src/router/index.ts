import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Головна | Lottery App', layout: 'DefaultLayout' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'Про автора | Lottery App', layout: 'DefaultLayout' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Авторизація | Lottery App', layout: 'AuthLayout' },
  },
  {
    path: '/users',
    component: () => import('@/views/UsersRootView.vue'),
    meta: { requiresAuth: true, layout: 'DefaultLayout' },
    children: [
      {
        path: '',
        name: 'users-list',
        component: () => import('@/views/UsersListView.vue'),
        meta: { title: 'Користувачі | Lottery App' },
      },
      {
        path: ':id',
        name: 'user-details',
        component: () => import('@/views/UserDetailsView.vue'),
        props: true,
        meta: { title: 'Деталі користувача | Lottery App' },
      },
      {
        path: ':id/edit',
        name: 'user-edit',
        component: () => import('@/views/UserEditView.vue'),
        props: true,
        meta: { title: 'Редагування користувача | Lottery App' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '404 Не знайдено | Lottery App', layout: 'DefaultLayout' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'users-list' })
    return
  }

  next()
})

router.afterEach((to) => {
  document.title = to.meta.title || 'Lottery App'
})

export default router
