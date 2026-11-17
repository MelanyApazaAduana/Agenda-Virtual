import { defineStore } from 'pinia'

const CLAVE = 'agenda-tema'

const temaGuardado = () => {
  try {
    const valor = localStorage.getItem(CLAVE)
    return valor === 'light' || valor === 'dark' ? valor : null
  } catch {
    return null
  }
}

export const useTemaStore = defineStore('tema', {
  state: () => ({
    tema: 'dark'
  }),
  actions: {
    iniciar() {
      const actual = document.documentElement.dataset.theme
      const inicial =
        actual === 'light' || actual === 'dark'
          ? actual
          : temaGuardado() || 'dark'
      this.aplicar(inicial)
    },
    aplicar(tema) {
      this.tema = tema === 'light' ? 'light' : 'dark'
      document.documentElement.dataset.theme = this.tema
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) meta.setAttribute('content', this.tema === 'light' ? '#F7F8F8' : '#08090A')
      try {
        localStorage.setItem(CLAVE, this.tema)
      } catch {
        /* almacenamiento no disponible */
      }
    },
    alternar() {
      this.aplicar(this.tema === 'dark' ? 'light' : 'dark')
    }
  }
})
