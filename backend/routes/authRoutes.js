import express from 'express'
import passport from '../config/passport.js'

const router = express.Router()

// Iniciar autenticación con Google
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
)

// Callback de Google - adonde Google redirige después del login
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:5173/login',
    successRedirect: 'http://localhost:5173/'
  })
)

// Verificar si el usuario está autenticado (para el frontend)
router.get('/verificar', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      autenticado: true, 
      usuario: req.user 
    })
  } else {
    res.json({ 
      autenticado: false, 
      usuario: null 
    })
  }
})

// Cerrar sesión
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err)
      return res.status(500).json({ error: 'Error al cerrar sesión' })
    }
    res.redirect('http://localhost:5173/login')
  })
})

export default router