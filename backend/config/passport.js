import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import UsuarioModel from '../models/UsuarioModel.js'

// Configurar estrategia de Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const { usuario, creado } = await UsuarioModel.buscarOCrearPorGoogle(profile)
      return done(null, usuario)
    } catch (error) {
      return done(error, null)
    }
  }
))

// Serializar usuario (guardar solo ID en sesión)
passport.serializeUser((usuario, done) => {
  done(null, usuario.id)
})

// Deserializar usuario (recuperar datos completos desde ID)
passport.deserializeUser(async (id, done) => {
  try {
    const usuario = await UsuarioModel.buscarPorId(id)
    done(null, usuario)
  } catch (error) {
    done(error, null)
  }
})

export default passport