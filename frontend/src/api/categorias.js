import api from './axios'

export const listarCategorias = () => api.get('/categorias')

export const listarCategoriasPorTipo = (tipo) => api.get(`/categorias/tipo/${tipo}`)

export const obtenerCategoria = (id) => api.get(`/categorias/${id}`)

export const crearCategoria = (datos) => api.post('/categorias', datos)

export const crearCategoriasPredeterminadas = () =>
  api.post('/categorias/predeterminadas/crear')
