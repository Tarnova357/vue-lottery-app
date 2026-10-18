import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import { router } from './app/providers/router'
import { setupUI } from './app/providers/ui'
import { registerServices } from './app/providers/services'

import './app/styles/index.scss'
import 'primeicons/primeicons.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
registerServices()
setupUI(app)
app.use(router)

app.mount('#app')
