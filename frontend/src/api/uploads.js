import axios from 'axios'

// Cliente sin Content-Type por defecto: axios pone multipart/form-data
// con el boundary correcto al detectar el FormData.
const cliente = axios.create({ baseURL: '', withCredentials: true })

// tipo = 'documento' | 'imagen' | 'audio'
export const subirArchivo = (tipo, archivo) => {
  const datos = new FormData()
  datos.append('archivo', archivo)
  return cliente.post(`/uploads/${tipo}`, datos)
}
