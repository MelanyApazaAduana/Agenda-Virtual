import api from './axios'

export const verificarSesion = () => api.get('/auth/verificar')

export const cerrarSesion = () => api.get('/auth/logout')

export const iniciarSesionGoogle = () => {
  window.location.href = 'http://localhost:3000/auth/google'
}

export const login = (correo, contrasena) =>
  api.post('/auth/login', { correo, contrasena })

export const registrar = (datos) =>
  api.post('/auth/registro', datos)

export const devLogin = () =>
  api.post('/auth/dev-login')
