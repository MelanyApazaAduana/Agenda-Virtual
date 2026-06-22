import promisePool from '../config/database.js'

class UsuarioModel {
    // Buscar o crear usuario por Google
    static async buscarOCrearPorGoogle(profile) {
        const googleId = profile.id
        const correo = profile.emails[0].value
        const nombre = profile.displayName
        const foto_url = profile.photos[0]?.value || null

        try {
           
            const [existentes] = await promisePool.query(
                'SELECT * FROM usuarios WHERE google_id = ?',
                [googleId]
            )

            if (existentes.length > 0) {
                
                await promisePool.query(
                    'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?',
                    [existentes[0].id]
                )
                return { usuario: existentes[0], creado: false }
            }

            // 2. Buscar si existe con el mismo correo (sin google_id)
            const [porCorreo] = await promisePool.query(
                'SELECT * FROM usuarios WHERE correo = ?',
                [correo]
            )

            if (porCorreo.length > 0) {
                // Actualizar el registro existente con google_id
                await promisePool.query(
                    'UPDATE usuarios SET google_id = ?, foto_url = ?, ultimo_acceso = NOW() WHERE id = ?',
                    [googleId, foto_url, porCorreo[0].id]
                )
                const [actualizado] = await promisePool.query(
                    'SELECT * FROM usuarios WHERE id = ?',
                    [porCorreo[0].id]
                )
                return { usuario: actualizado[0], creado: false }
            }

            // 3. Crear usuario nuevo
            const [resultado] = await promisePool.query(
                `INSERT INTO usuarios 
                (nombre, correo, contrasena, google_id, foto_url, rol, estado, ultimo_acceso) 
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
                [nombre, correo, '', googleId, foto_url, 'usuario', true]
            )

            const [nuevoUsuario] = await promisePool.query(
                'SELECT * FROM usuarios WHERE id = ?',
                [resultado.insertId]
            )
            return { usuario: nuevoUsuario[0], creado: true }

        } catch (error) {
            console.error('Hubo un error al buscar o crear su cuenta:', error)
            throw error
        }
    }

    // Buscar usuario por ID
    static async buscarPorId(id) {
        try {
            const [rows] = await promisePool.query(
                'SELECT id, nombre, correo, rol, foto_url, estado FROM usuarios WHERE id = ?',
                [id]
            )
            return rows[0] || null
        } catch (error) {
            console.error('Error en buscarPorId:', error)
            throw error
        }
    }
}

export default UsuarioModel