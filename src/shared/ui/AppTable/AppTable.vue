<script setup lang="ts">
import DataTable from 'primevue/datatable'

interface Props {
  value: unknown[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})
</script>

<template>
  <DataTable
    :value="value"
    :loading="loading"
    striped-rows
    responsive-layout="scroll"
    class="app-table"
  >
    <slot />
  </DataTable>
</template>

<style scoped lang="scss">
.app-table {
  border: 1px solid var(--p-content-border-color, #e2e8f0);
  border-radius: var(--p-border-radius, 8px);
  overflow: hidden;
}
</style>
