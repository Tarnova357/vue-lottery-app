import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('app:theme') === 'dark')

  function toggleTheme(): void {
    isDark.value = !isDark.value
    applyTheme()
  }

  function applyTheme(): void {
    if (isDark.value) {
      document.documentElement.classList.add('app-dark')
      localStorage.setItem('app:theme', 'dark')
    } else {
      document.documentElement.classList.remove('app-dark')
      localStorage.setItem('app:theme', 'light')
    }
  }

  return {
    isDark,
    toggleTheme,
    applyTheme,
  }
})
