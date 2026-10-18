<script setup lang="ts">
import InputText from 'primevue/inputtext'

interface Props {
  modelValue: string | number | undefined
  id?: string
  label?: string
  type?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  id: '',
  label: '',
  type: 'text',
  placeholder: '',
  error: '',
  disabled: false,
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}>()
</script>

<template>
  <div class="app-input-field">
    <label v-if="label" :for="id" class="app-input-label">{{ label }}</label>
    <InputText
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :invalid="Boolean(error)"
      :disabled="disabled"
      class="w-full"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur')"
    />
    <small v-if="error" class="app-input-error">{{ error }}</small>
  </div>
</template>

<style scoped lang="scss">
.app-input-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}

.app-input-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--p-text-color);
}

.app-input-error {
  color: var(--p-red-500, #ef4444);
  font-size: 0.75rem;
}
</style>
