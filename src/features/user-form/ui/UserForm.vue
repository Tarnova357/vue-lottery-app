<script setup lang="ts">
import { onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import type { User, CreateUserDto, UpdateUserDto } from '@/entities/user'
import { AppInput, AppButton } from '@/shared/ui'

interface Props {
  initialData?: User | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialData: null,
  loading: false,
})

const emit = defineEmits<{
  (e: 'submit', data: CreateUserDto | UpdateUserDto): void
  (e: 'cancel'): void
}>()

const schema = yup.object({
  firstName: yup.string().required("Обов'язкове поле"),
  lastName: yup.string().required("Обов'язкове поле"),
  email: yup.string().email('Некоректний email').required("Обов'язкове поле"),
  username: yup.string().required("Обов'язкове поле"),
  password: yup.string().when([], {
    is: () => !props.initialData,
    then: (s) => s.min(6, 'Мінімум 6 символів').required("Обов'язкове поле"),
    otherwise: (s) => s.notRequired(),
  }),
  age: yup
    .number()
    .typeError('Має бути числом')
    .positive('Має бути більше 0')
    .required("Обов'язкове поле"),
  gender: yup.string().oneOf(['male', 'female', 'other']).required("Обов'язкове поле"),
  phone: yup.string().required("Обов'язкове поле"),
})

interface FormValues {
  firstName: string
  lastName: string
  email: string
  username: string
  password?: string
  age: number
  gender: 'male' | 'female' | 'other'
  phone: string
}

const { handleSubmit, resetForm } = useForm<FormValues>({
  validationSchema: schema,
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    age: 18,
    gender: 'male',
    phone: '',
  },
})

const { value: firstName, errorMessage: firstNameError } = useField<string>('firstName')
const { value: lastName, errorMessage: lastNameError } = useField<string>('lastName')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: username, errorMessage: usernameError } = useField<string>('username')
const { value: password, errorMessage: passwordError } = useField<string>('password')
const { value: age, errorMessage: ageError } = useField<number>('age')
const { value: gender } = useField<string>('gender')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')

onMounted(() => {
  if (props.initialData) {
    resetForm({
      values: {
        firstName: props.initialData.firstName,
        lastName: props.initialData.lastName,
        email: props.initialData.email,
        username: props.initialData.username,
        age: props.initialData.age,
        gender: props.initialData.gender,
        phone: props.initialData.phone,
      },
    })
  }
})

const onSubmit = handleSubmit((values) => {
  emit('submit', values as CreateUserDto)
})
</script>

<template>
  <form class="user-form" @submit.prevent="onSubmit">
    <div class="user-form__grid">
      <AppInput id="firstName" v-model="firstName" label="First Name" :error="firstNameError" />
      <AppInput id="lastName" v-model="lastName" label="Last Name" :error="lastNameError" />
    </div>

    <div class="user-form__grid">
      <AppInput id="email" v-model="email" type="email" label="Email" :error="emailError" />
      <AppInput id="phone" v-model="phone" label="Phone" :error="phoneError" />
    </div>

    <div class="user-form__grid">
      <AppInput id="username" v-model="username" label="Username" :error="usernameError" />
      <AppInput
        v-if="!initialData"
        id="password"
        v-model="password"
        type="password"
        label="Password"
        :error="passwordError"
      />
    </div>

    <div class="user-form__grid">
      <AppInput
        id="age"
        :model-value="age ? String(age) : ''"
        type="number"
        label="Age"
        :error="ageError"
        @update:model-value="age = Number($event)"
      />
      <div class="user-form__group">
        <label for="gender" class="user-form__label">Gender</label>
        <select id="gender" v-model="gender" class="user-form__select">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>

    <div class="user-form__actions">
      <AppButton
        label="Скасувати"
        severity="secondary"
        variant="outlined"
        @click="$emit('cancel')"
      />
      <AppButton type="submit" label="Зберегти" :loading="loading" />
    </div>
  </form>
</template>

<style scoped lang="scss">
.user-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 0.75rem;
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--p-text-color);
  }

  &__select {
    height: 42px;
    padding: 0 0.75rem;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-content-border-color, #cbd5e1);
    background: var(--p-content-background, #ffffff);
    color: var(--p-text-color);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--p-content-border-color, #e2e8f0);
  }
}
</style>
