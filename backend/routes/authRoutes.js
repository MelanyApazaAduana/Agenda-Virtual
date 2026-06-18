import express from 'express'
import passport from '../config/passport.js'
import promisePool from '../config/database.js'

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

// Login de desarrollo (solo sin Google OAuth configurado)
router.post('/dev-login', async (req, res) => {
  try {
    const [existentes] = await promisePool.query(
      "SELECT * FROM usuarios WHERE correo = 'dev@test.com'"
    )

    let usuario
    if (existentes.length > 0) {
      usuario = existentes[0]
      await promisePool.query(
        'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?',
        [usuario.id]
      )
    } else {
      const [resultado] = await promisePool.query(
        `INSERT INTO usuarios (nombre, correo, contraseña, rol, estado, ultimo_acceso)
         VALUES ('Usuario Dev', 'dev@test.com', '', 'usuario', true, NOW())`
      )
      const [nuevo] = await promisePool.query(
        'SELECT id, nombre, correo, rol, foto_url, estado FROM usuarios WHERE id = ?',
        [resultado.insertId]
      )
      usuario = nuevo[0]
    }

    req.login(usuario, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al iniciar sesión' })
      }
      res.json({
        success: true,
        message: 'Sesión de desarrollo iniciada',
        data: usuario
      })
    })
  } catch (error) {
    console.error('Error en dev-login:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router