<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import AppButton from '@/components/base/AppButton.vue'
import AppInput from '@/components/base/AppInput.vue'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const usersStore = useUsersStore()

const schema = yup.object({
  firstName: yup.string().required("Обов'язкове поле"),
  lastName: yup.string().required("Обов'язкове поле"),
  email: yup.string().email('Некоректний email').required("Обов'язкове поле"),
  username: yup.string().required("Обов'язкове поле"),
  age: yup.number().typeError('Має бути числом').positive().required("Обов'язкове поле"),
  gender: yup.string().oneOf(['male', 'female', 'other']).required("Обов'язкове поле"),
  phone: yup.string().required("Обов'язкове поле"),
})

const { handleSubmit, resetForm } = useForm({ validationSchema: schema })

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
const { value: age, errorMessage: ageError, meta: ageMeta } = useField<number>('age')
const { value: gender } = useField<string>('gender')
const { value: phone, errorMessage: phoneError, meta: phoneMeta } = useField<string>('phone')

onMounted(async () => {
  const user = await usersStore.fetchUserById(Number(props.id))
  if (user) {
    resetForm({
      values: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
      },
    })
  }
})

const onUpdate = handleSubmit(async (values) => {
  await usersStore.updateUser(Number(props.id), values as never)
  router.push({ name: 'user-details', params: { id: props.id } })
})
</script>

<template>
  <div class="lottery-card col-md-8 mx-auto my-3">
    <h3 class="h5 mb-4">Редагування користувача #{{ id }}</h3>

    <form @submit.prevent="onUpdate">
      <div class="row">
        <div class="col-md-6">
          <AppInput
            id="firstName"
            v-model="firstName"
            label="First Name"
            :error="firstNameError"
            :is-valid="firstNameMeta.valid && firstNameMeta.dirty"
          />
        </div>
        <div class="col-md-6">
          <AppInput
            id="lastName"
            v-model="lastName"
            label="Last Name"
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
            :error="emailError"
            :is-valid="emailMeta.valid && emailMeta.dirty"
          />
        </div>
        <div class="col-md-6">
          <AppInput
            id="phone"
            v-model="phone"
            label="Phone"
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
            :error="usernameError"
            :is-valid="usernameMeta.valid && usernameMeta.dirty"
          />
        </div>
        <div class="col-md-3">
          <AppInput
            id="age"
            :model-value="age ? String(age) : ''"
            type="number"
            label="Age"
            :error="ageError"
            :is-valid="ageMeta.valid && ageMeta.dirty"
            @update:model-value="age = Number($event)"
          />
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label fw-bold" style="font-size: 0.95rem">Gender</label>
          <select v-model="gender" class="form-select">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2 pt-3 border-top mt-3">
        <AppButton variant="secondary" @click="router.back()"> Скасувати </AppButton>
        <AppButton type="submit" variant="primary" :disabled="usersStore.isLoading">
          {{ usersStore.isLoading ? 'Збереження...' : 'Зберегти зміни' }}
        </AppButton>
      </div>
    </form>
  </div>
</template>
