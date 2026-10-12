<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import AppInput from '@/components/base/AppInput.vue'
import AppButton from '@/components/base/AppButton.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const schema = yup.object({
  username: yup.string().required("Ім'я користувача є обов'язковим"),
  password: yup
    .string()
    .min(6, 'Пароль повинен містити щонайменше 6 символів')
    .required("Пароль є обов'язковим"),
})

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    username: 'emilys',
    password: 'emilyspass',
  },
})

const {
  value: username,
  errorMessage: usernameError,
  meta: usernameMeta,
} = useField<string>('username')
const {
  value: password,
  errorMessage: passwordError,
  meta: passwordMeta,
} = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.login(values)
    const redirectPath = (route.query.redirect as string) || '/users'
    router.push(redirectPath)
  } catch {}
})
</script>

<template>
  <div>
    <h3 class="text-center mb-4">Вхід у систему</h3>

    <div v-if="authStore.error" class="alert alert-danger py-2" role="alert">
      {{ authStore.error }}
    </div>

    <form @submit.prevent="onSubmit">
      <AppInput
        id="username"
        v-model="username"
        label="Username"
        placeholder="Введіть ім'я користувача"
        :error="usernameError"
        :is-valid="usernameMeta.valid && usernameMeta.dirty"
      />

      <AppInput
        id="password"
        v-model="password"
        type="password"
        label="Password"
        placeholder="Введіть пароль"
        :error="passwordError"
        :is-valid="passwordMeta.valid && passwordMeta.dirty"
      />

      <div class="mt-4">
        <AppButton type="submit" variant="primary" :disabled="authStore.isLoading" class="w-100">
          <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-1" />
          Увійти
        </AppButton>
      </div>
    </form>
  </div>
</template>
