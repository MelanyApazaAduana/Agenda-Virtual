import { createRouter, createWebHistory } from 'vue-router'
import { useUsuarioStore } from '../stores/usuarioStore'

const LoginView = () => import('@/views/LoginView.vue')
const CalendarioView = () => import('@/views/DashboardCalendarioView.vue')
const GestionTareasView = () => import('@/views/GestionTareasView.vue')
const GestionNotasView = () => import('@/views/GestionNotasView.vue')
const GestionProductividadView = () => import('@/views/GestionProductividadView.vue')
const GestionUsuariosView = () => import('@/views/GestionUsuariosView.vue')
const RegistrarIngresoView = () => import('@/views/RegistrarIngresoView.vue')
const ReportesFinancierosView = () => import('@/views/ReportesFinancierosView.vue')

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
    meta: { layout: 'DashboardLayout', requiereAuth: true }
  },
  {
    path: '/tareas',
    name: 'tareas',
    component: GestionTareasView,
    meta: { layout: 'DashboardLayout', requiereAuth: true }
  },
  {
    path: '/notas',
    name: 'notas',
    component: GestionNotasView,
    meta: { layout: 'DashboardLayout', requiereAuth: true }
  },
  {
    path: '/productividad',
    name: 'productividad',
    component: GestionProductividadView,
    meta: { layout: 'DashboardLayout', requiereAuth: true }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: GestionUsuariosView,
    meta: { layout: 'DashboardLayout', requiereAuth: true }
  },
  {
    path: '/ingresos/registrar',
    name: 'registrar-ingreso',
    component: RegistrarIngresoView,
    meta: { layout: 'DashboardLayout', requiereAuth: true }
  },
  {
    path: '/ingresos/reportes',
    name: 'reportes-financieros',
    component: ReportesFinancierosView,
    meta: { layout: 'DashboardLayout', requiereAuth: true }
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
