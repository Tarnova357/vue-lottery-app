<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}>()

const localQuery = ref(props.modelValue)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.modelValue,
  (newVal) => {
    localQuery.value = newVal
  },
)

watch(localQuery, (newVal) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    emit('update:modelValue', newVal)
    emit('search')
  }, 350)
})

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<template>
  <div class="search-bar-wrapper">
    <input
      v-model="localQuery"
      type="text"
      class="form-control search-input"
      placeholder="Пошук користувачів за ім'ям..."
    />
  </div>
</template>

<style scoped lang="scss">
.search-bar-wrapper {
  margin-bottom: 1.25rem;
}

.search-input {
  background-color: #fafbfc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.5rem 0.85rem;
  font-size: 0.95rem;

  &:focus {
    background-color: #ffffff;
    border-color: #33a3dc;
    box-shadow: none;
  }
}
</style>
