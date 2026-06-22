import express from 'express'
import passport from '../config/passport.js'
import promisePool from '../config/database.js'
import UsuarioModel from '../models/UsuarioModel.js'

const router = express.Router()

// Registro de un usuario nuevo con correo y contraseña
router.post('/registro', async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body

    // Validaciones
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ success: false, message: 'El nombre es obligatorio' })
    }
    if (!correo || correo.trim() === '') {
      return res.status(400).json({ success: false, message: 'El correo es obligatorio' })
    }
    if (!contrasena || contrasena.length < 6) {
      return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres' })
    }

    // Verificar que el correo no esté registrado
    const existente = await UsuarioModel.buscarPorCorreo(correo.trim())
    if (existente) {
      return res.status(409).json({ success: false, message: 'Ya existe una cuenta con ese correo' })
    }

    const usuario = await UsuarioModel.crearLocal({
      nombre: nombre.trim(),
      correo: correo.trim(),
      contrasena
    })

    // Iniciar sesión automáticamente tras registrarse
    req.login(usuario, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Cuenta creada, pero no se pudo iniciar sesión' })
      }
      res.status(201).json({
        success: true,
        message: 'Cuenta creada exitosamente',
        data: usuario
      })
    })
  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({ success: false, message: 'Error al registrar el usuario' })
  }
})

// Login con correo y contraseña
router.post('/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body

    if (!correo || !contrasena) {
      return res.status(400).json({ success: false, message: 'Correo y contraseña son obligatorios' })
    }

    const usuario = await UsuarioModel.buscarPorCorreo(correo.trim())
    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' })
    }

    const valida = await UsuarioModel.verificarContrasena(contrasena, usuario.contrasena)
    if (!valida) {
      return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' })
    }

    if (!usuario.estado) {
      return res.status(403).json({ success: false, message: 'La cuenta está deshabilitada' })
    }

    await promisePool.query('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?', [usuario.id])

    // No exponer la contraseña en la sesión/respuesta
    const usuarioSeguro = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      foto_url: usuario.foto_url,
      estado: usuario.estado
    }

    req.login(usuarioSeguro, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al iniciar sesión' })
      }
      res.json({
        success: true,
        message: 'Sesión iniciada',
        data: usuarioSeguro
      })
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ success: false, message: 'Error al iniciar sesión' })
  }
})

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
        `INSERT INTO usuarios (nombre, correo, contrasena, rol, estado, ultimo_acceso)
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