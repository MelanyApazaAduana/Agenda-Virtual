import { createApp } from 'vue'
import { createPinia } from 'pinia'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import router from './router'
import './assets/css/main.css'
import App from './App.vue'
import { useTemaStore } from './stores/temaStore'

dayjs.locale('es')

const pinia = createPinia()
const app = createApp(App)

useTemaStore(pinia).iniciar()

app.use(pinia)
app.use(router)
app.mount('#app')
