import { defineStore } from 'pinia'
import axios from 'axios'

axios.defaults.withCredentials = true

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    usuario: null,
    cargando: true,
    autenticado: false
  }),
  
  actions: {
    async verificarSesion() {
      try {
        const respuesta = await axios.get('http://localhost:3000/auth/verificar')
        
        if (respuesta.data.autenticado) {
          this.usuario = respuesta.data.usuario
          this.autenticado = true
        } else {
          this.usuario = null
          this.autenticado = false
        }
      } catch (error) {
        this.usuario = null
        this.autenticado = false
      } finally {
        this.cargando = false
      }
    },
    
    cerrarSesion() {
      this.usuario = null
      this.autenticado = false
      window.location.href = 'http://localhost:3000/auth/logout'
    }
  }
})