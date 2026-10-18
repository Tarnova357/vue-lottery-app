<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useRouter, useRoute } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { AppInput, AppButton } from '@/shared/ui'

const sessionStore = useSessionStore()
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

const { value: username, errorMessage: usernameError } = useField<string>('username')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    await sessionStore.login(values)
    const redirect = (route.query.redirect as string) || '/users'
    router.push(redirect)
  } catch {
    // Помилка фіксується у sessionStore.error
  }
})
</script>

<template>
  <form class="login-form" @submit.prevent="onSubmit">
    <div v-if="sessionStore.error" class="login-form__alert">
      {{ sessionStore.error }}
    </div>

    <AppInput
      id="username"
      v-model="username"
      label="Username"
      placeholder="Введіть логін"
      :error="usernameError"
    />

    <AppInput
      id="password"
      v-model="password"
      type="password"
      label="Password"
      placeholder="Введіть пароль"
      :error="passwordError"
    />

    <AppButton type="submit" label="Увійти" :loading="sessionStore.isLoading" class="w-full mt-3" />
  </form>
</template>

<style scoped lang="scss">
.login-form {
  display: flex;
  flex-direction: column;

  &__alert {
    background-color: var(--p-red-100, #fee2e2);
    color: var(--p-red-700, #b91c1c);
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }
}
</style>
