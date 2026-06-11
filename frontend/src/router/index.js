import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardCalendarioView from '@/views/DashboardCalendarioView.vue'
import GestionTareasView from '@/views/GestionTareasView.vue'
import GestionNotasView from '@/views/GestionNotasView.vue'
import GestionProductividadView from '@/views/GestionProductividadView.vue'
import GestionUsuariosView from '@/views/GestionUsuariosView.vue'

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
    component: DashboardCalendarioView,
    meta: { layout: 'DashboardLayout' }
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

export default router
