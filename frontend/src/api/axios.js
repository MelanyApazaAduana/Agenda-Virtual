import axios from 'axios'

// baseURL vacía => las peticiones van al mismo origen (localhost:5173) y el
// proxy de Vite las reenvía al backend. La cookie de sesión queda de primera
// parte, así el navegador la envía siempre.
const api = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    // Ante un 401 redirige al login, pero solo si no estamos ya ahí.
    // Esto evita el bucle de recargas login <-> dashboard.
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
