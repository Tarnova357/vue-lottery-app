<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import type { CreateUserDto } from '@/types/user'
import AppButton from '@/components/base/AppButton.vue'
import AppInput from '@/components/base/AppInput.vue'

const emit = defineEmits<{
  (e: 'add-user', data: CreateUserDto): void
}>()

const schema = yup.object({
  firstName: yup.string().required("Ім'я є обов'язковим"),
  lastName: yup.string().required("Прізвище є обов'язковим"),
  email: yup.string().email('Некоректний email').required("Email є обов'язковим"),
  username: yup.string().required("Нікнейм є обов'язковим"),
  password: yup.string().min(6, 'Мінімум 6 символів').required("Пароль є обов'язковим"),
  age: yup
    .number()
    .typeError('Має бути числом')
    .positive('Вік має бути додатним')
    .required("Вік є обов'язковим"),
  gender: yup.string().oneOf(['male', 'female', 'other']).required("Стать є обов'язковою"),
  phone: yup.string().required("Телефон є обов'язковим"),
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    gender: 'male',
  },
})

const {
  value: firstName,
  errorMessage: firstNameError,
  meta: firstNameMeta,
} = useField<string>('firstName')
const {
  value: lastName,
  errorMessage: lastNameError,
  meta: lastNameMeta,
} = useField<string>('lastName')
const { value: email, errorMessage: emailError, meta: emailMeta } = useField<string>('email')
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
const { value: age, errorMessage: ageError, meta: ageMeta } = useField<number>('age')
const { value: gender } = useField<string>('gender')
const { value: phone, errorMessage: phoneError, meta: phoneMeta } = useField<string>('phone')

const onSubmit = handleSubmit((values) => {
  emit('add-user', values as CreateUserDto)
  resetForm()
})
</script>

<template>
  <form id="register-user-form" @submit.prevent="onSubmit">
    <div class="row">
      <div class="col-md-6">
        <AppInput
          id="firstName"
          v-model="firstName"
          label="First Name"
          placeholder="Введіть ім'я"
          :error="firstNameError"
          :is-valid="firstNameMeta.valid && firstNameMeta.dirty"
        />
      </div>
      <div class="col-md-6">
        <AppInput
          id="lastName"
          v-model="lastName"
          label="Last Name"
          placeholder="Введіть прізвище"
          :error="lastNameError"
          :is-valid="lastNameMeta.valid && lastNameMeta.dirty"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <AppInput
          id="email"
          v-model="email"
          type="email"
          label="Email"
          placeholder="example@mail.com"
          :error="emailError"
          :is-valid="emailMeta.valid && emailMeta.dirty"
        />
      </div>
      <div class="col-md-6">
        <AppInput
          id="phone"
          v-model="phone"
          label="Phone"
          placeholder="+380XXXXXXXXX"
          :error="phoneError"
          :is-valid="phoneMeta.valid && phoneMeta.dirty"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <AppInput
          id="username"
          v-model="username"
          label="Username"
          placeholder="Введіть нікнейм"
          :error="usernameError"
          :is-valid="usernameMeta.valid && usernameMeta.dirty"
        />
      </div>
      <div class="col-md-6">
        <AppInput
          id="password"
          v-model="password"
          type="password"
          label="Password"
          placeholder="Введіть пароль"
          :error="passwordError"
          :is-valid="passwordMeta.valid && passwordMeta.dirty"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <AppInput
          id="age"
          :model-value="age ? String(age) : ''"
          type="number"
          label="Age"
          placeholder="Вкажіть вік"
          :error="ageError"
          :is-valid="ageMeta.valid && ageMeta.dirty"
          @update:model-value="age = Number($event)"
        />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label fw-bold" style="font-size: 0.95rem">Gender</label>
        <select v-model="gender" class="form-select">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>

    <div class="d-flex justify-content-end mt-3">
      <AppButton type="submit" variant="primary"> Додати користувача </AppButton>
    </div>
  </form>
</template>
