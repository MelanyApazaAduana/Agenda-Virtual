import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import { useUsuarioStore } from '../stores/usuarioStore'

//import LoginView from '@/views/LoginView.vue'
import DashboardCalendarioView from '@/views/DashboardCalendarioView.vue'
import GestionTareasView from '@/views/GestionTareasView.vue'
import GestionNotasView from '@/views/GestionNotasView.vue'
import GestionProductividadView from '@/views/GestionProductividadView.vue'
import GestionUsuariosView from '@/views/GestionUsuariosView.vue'

axios.defaults.withCredentials = true

const LoginView = () => import('@/views/LoginView.vue')
const CalendarioView = () => import('@/views/DashboardCalendarioView.vue')

const routes = [
  {
    path: '/',
    redirect: '/calendario'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { layout: 'AuthLayout' }
  },
  {
    path: '/calendario',
    name: 'calendario',
    component: CalendarioView,
    meta: { requiereAuth: true }
  },
  {
    path: '/tareas',
    name: 'tareas',
    component: GestionTareasView,
    meta: { layout: 'DashboardLayout' }
  },
  {
    path: '/notas',
    name: 'notas',
    component: GestionNotasView,
    meta: { layout: 'DashboardLayout' }
  },
  {
    path: '/productividad',
    name: 'productividad',
    component: GestionProductividadView,
    meta: { layout: 'DashboardLayout' }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: GestionUsuariosView,
    meta: { layout: 'DashboardLayout' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guardia de navegación
router.beforeEach(async (to, from, next) => {
  const store = useUsuarioStore()
  
  // Si aún no cargó la sesión, esperar
  if (store.cargando) {
    await store.verificarSesion()
  }
  
  if (to.meta.requiereAuth && !store.autenticado) {
    next('/login')
  } else if (to.path === '/login' && store.autenticado) {
    next('/')
  } else {
    next()
  }
})

export default router
