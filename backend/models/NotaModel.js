// backend/models/NotaModel.js
import promisePool from '../config/database.js';

class NotaModel {
    
    static async crear(usuarioId, datos) {
        const { titulo, contenido, audio_url, imagen_url, estado, color_fondo, evento_id } = datos;
        
        if (!titulo || titulo.trim() === '') {
            throw new Error('El título es obligatorio');
        }

        // Validar que el evento pertenezca al usuario si se especifica
        // if (evento_id) {
        //     const [evento] = await promisePool.execute(
        //         'SELECT id FROM eventos WHERE id = ? AND usuario_id = ?',
        //         [evento_id, usuarioId]
        //     );
        //     if (evento.length === 0) {
        //         throw new Error('El evento especificado no existe o no pertenece al usuario');
        //     }
        // }

        const estadoFinal = estado || 'borrador';
        
        // Validar que el estado sea válido si viene
        // if (estado && !['borrador', 'guardado', 'archivado'].includes(estado)) {
        //     throw new Error('Estado no válido. Debe ser: borrador, guardado o archivado');
        // }

        // Validar color (formato hex)
        // if (color_fondo && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color_fondo)) {
        //     throw new Error('El color debe ser un código hexadecimal válido (ej: #FFFFFF)');
        // }

        const sql = `
            INSERT INTO notas (usuario_id, titulo, contenido, audio_url, imagen_url, estado, color_fondo, evento_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuarioId,
            titulo.trim(),
            contenido || null,
            audio_url || null,
            imagen_url || null,
            estadoFinal,
            color_fondo || null,
            evento_id || null
        ]);
        
        // Obtener la nota creada con todos sus datos
        return await this.obtenerPorId(result.insertId, usuarioId);
    }

    // Obtener todas las notas de un usuario
    static async listarPorUsuario(usuarioId, filtros = {}) {
        let sql = `
            SELECT n.*, 
                   e.titulo as evento_titulo,
                   e.estado as evento_estado
            FROM notas n
            LEFT JOIN eventos e ON n.evento_id = e.id
            WHERE n.usuario_id = ?
        `;
        const params = [usuarioId];

        // Filtro por estado
        if (filtros.estado) {
            const estadosValidos = ['borrador', 'guardado', 'archivado'];
            if (estadosValidos.includes(filtros.estado)) {
                sql += ` AND n.estado = ?`;
                params.push(filtros.estado);
            }
        }

        // Filtro por evento
        if (filtros.evento_id) {
            sql += ` AND n.evento_id = ?`;
            params.push(filtros.evento_id);
        }

        // Filtro por búsqueda en título o contenido
        if (filtros.busqueda) {
            sql += ` AND (n.titulo LIKE ? OR n.contenido LIKE ?)`;
            const busqueda = `%${filtros.busqueda}%`;
            params.push(busqueda, busqueda);
        }

        // Filtro por fecha de creación
        if (filtros.fecha_desde) {
            sql += ` AND DATE(n.fecha_creacion) >= ?`;
            params.push(filtros.fecha_desde);
        }
        if (filtros.fecha_hasta) {
            sql += ` AND DATE(n.fecha_creacion) <= ?`;
            params.push(filtros.fecha_hasta);
        }

        // Filtro por notas con audio
        if (filtros.tiene_audio !== undefined) {
            if (filtros.tiene_audio) {
                sql += ` AND n.audio_url IS NOT NULL`;
            } else {
                sql += ` AND n.audio_url IS NULL`;
            }
        }

        // Filtro por notas con imagen
        if (filtros.tiene_imagen !== undefined) {
            if (filtros.tiene_imagen) {
                sql += ` AND n.imagen_url IS NOT NULL`;
            } else {
                sql += ` AND n.imagen_url IS NULL`;
            }
        }

        // Ordenamiento
        const orden = filtros.orden || 'fecha_modificacion';
        const direccion = filtros.direccion || 'DESC';
        const ordenesPermitidos = ['fecha_creacion', 'fecha_modificacion', 'titulo', 'estado'];
        const ordenFinal = ordenesPermitidos.includes(orden) ? orden : 'fecha_modificacion';
        sql += ` ORDER BY n.${ordenFinal} ${direccion === 'ASC' ? 'ASC' : 'DESC'}`;

        // Límite
        if (filtros.limite) {
            sql += ` LIMIT ?`;
            params.push(parseInt(filtros.limite));
        }

        const [rows] = await promisePool.execute(sql, params);
        return rows;
    }

    // Obtener una nota por ID
    static async obtenerPorId(id, usuarioId) {
        const sql = `
            SELECT n.*, 
                   e.titulo as evento_titulo,
                   e.estado as evento_estado
            FROM notas n
            LEFT JOIN eventos e ON n.evento_id = e.id
            WHERE n.id = ? AND n.usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Actualizar una nota
    static async actualizar(id, usuarioId, datos) {
        // Verificar que la nota existe y pertenece al usuario
        const notaExistente = await this.obtenerPorId(id, usuarioId);
        if (!notaExistente) {
            throw new Error('Nota no encontrada o no pertenece al usuario');
        }

        const { titulo, contenido, audio_url, imagen_url, estado, color_fondo, evento_id } = datos;

        // Validar título si viene
        if (titulo !== undefined && titulo.trim() === '') {
            throw new Error('El título no puede estar vacío');
        }

        // Validar evento si viene
        if (evento_id !== undefined) {
            if (evento_id) {
                const [evento] = await promisePool.execute(
                    'SELECT id FROM eventos WHERE id = ? AND usuario_id = ?',
                    [evento_id, usuarioId]
                );
                if (evento.length === 0) {
                    throw new Error('El evento especificado no existe o no pertenece al usuario');
                }
            }
        }

        // Validar estado si viene
        if (estado) {
            const estadosValidos = ['borrador', 'guardado', 'archivado'];
            if (!estadosValidos.includes(estado)) {
                throw new Error('Estado no válido. Debe ser: borrador, guardado o archivado');
            }
        }

        // Validar color si viene
        if (color_fondo) {
            if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color_fondo)) {
                throw new Error('El color debe ser un código hexadecimal válido (ej: #FFFFFF)');
            }
        }

        const sql = `
            UPDATE notas 
            SET titulo = COALESCE(?, titulo),
                contenido = ?,
                audio_url = ?,
                imagen_url = ?,
                estado = COALESCE(?, estado),
                color_fondo = ?,
                evento_id = ?,
                fecha_modificacion = NOW()
            WHERE id = ? AND usuario_id = ?
        `;

        const [result] = await promisePool.execute(sql, [
            titulo !== undefined ? titulo.trim() : undefined,
            contenido !== undefined ? (contenido || null) : undefined,
            audio_url !== undefined ? (audio_url || null) : undefined,
            imagen_url !== undefined ? (imagen_url || null) : undefined,
            estado !== undefined ? estado : undefined,
            color_fondo !== undefined ? (color_fondo || null) : undefined,
            evento_id !== undefined ? (evento_id || null) : undefined,
            id,
            usuarioId
        ]);

        if (result.affectedRows === 0) {
            throw new Error('No se pudo actualizar la nota');
        }

        // Retornar la nota actualizada
        return await this.obtenerPorId(id, usuarioId);
    }

    // Autoguardar nota (siempre como borrador)
    static async autoguardar(usuarioId, datos) {
        const { titulo, contenido, audio_url, imagen_url, color_fondo, evento_id } = datos;
        
        // Si no hay título, poner uno por defecto
        const tituloFinal = (titulo && titulo.trim() !== '') ? titulo.trim() : 'Nota sin título';

        // Validar evento si viene
        if (evento_id) {
            const [evento] = await promisePool.execute(
                'SELECT id FROM eventos WHERE id = ? AND usuario_id = ?',
                [evento_id, usuarioId]
            );
            if (evento.length === 0) {
                throw new Error('El evento especificado no existe o no pertenece al usuario');
            }
        }

        // Validar color si viene
        if (color_fondo && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color_fondo)) {
            throw new Error('El color debe ser un código hexadecimal válido (ej: #FFFFFF)');
        }

        const sql = `
            INSERT INTO notas (usuario_id, titulo, contenido, audio_url, imagen_url, estado, color_fondo, evento_id)
            VALUES (?, ?, ?, ?, ?, 'borrador', ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuarioId,
            tituloFinal,
            contenido || null,
            audio_url || null,
            imagen_url || null,
            color_fondo || null,
            evento_id || null
        ]);
        
        return await this.obtenerPorId(result.insertId, usuarioId);
    }

    // Actualizar autoguardado (mantiene estado borrador)
    static async actualizarAutoguardado(id, usuarioId, datos) {
        // Verificar que la nota existe y pertenece al usuario
        const notaExistente = await this.obtenerPorId(id, usuarioId);
        if (!notaExistente) {
            throw new Error('Nota no encontrada o no pertenece al usuario');
        }

        const { titulo, contenido, audio_url, imagen_url, color_fondo, evento_id } = datos;

        // Si no hay título, poner uno por defecto
        const tituloFinal = (titulo && titulo.trim() !== '') ? titulo.trim() : 'Nota sin título';

        // Validar evento si viene
        if (evento_id !== undefined) {
            if (evento_id) {
                const [evento] = await promisePool.execute(
                    'SELECT id FROM eventos WHERE id = ? AND usuario_id = ?',
                    [evento_id, usuarioId]
                );
                if (evento.length === 0) {
                    throw new Error('El evento especificado no existe o no pertenece al usuario');
                }
            }
        }

        // Validar color si viene
        if (color_fondo) {
            if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color_fondo)) {
                throw new Error('El color debe ser un código hexadecimal válido (ej: #FFFFFF)');
            }
        }

        // Mantener estado 'borrador' siempre en autoguardado
        const sql = `
            UPDATE notas 
            SET titulo = ?,
                contenido = ?,
                audio_url = ?,
                imagen_url = ?,
                estado = 'borrador',
                color_fondo = ?,
                evento_id = ?,
                fecha_modificacion = NOW()
            WHERE id = ? AND usuario_id = ?
        `;

        const [result] = await promisePool.execute(sql, [
            tituloFinal,
            contenido !== undefined ? (contenido || null) : undefined,
            audio_url !== undefined ? (audio_url || null) : undefined,
            imagen_url !== undefined ? (imagen_url || null) : undefined,
            color_fondo !== undefined ? (color_fondo || null) : undefined,
            evento_id !== undefined ? (evento_id || null) : undefined,
            id,
            usuarioId
        ]);

        if (result.affectedRows === 0) {
            throw new Error('No se pudo autoguardar la nota');
        }

        return await this.obtenerPorId(id, usuarioId);
    }

    // Guardar nota definitivamente (cambiar a estado guardado)
    static async guardarNota(id, usuarioId, datos) {
        // Verificar que la nota existe y pertenece al usuario
        const notaExistente = await this.obtenerPorId(id, usuarioId);
        if (!notaExistente) {
            throw new Error('Nota no encontrada o no pertenece al usuario');
        }

        const { titulo, contenido, audio_url, imagen_url, color_fondo, evento_id } = datos;

        // Validar título si viene
        if (titulo !== undefined && titulo.trim() === '') {
            throw new Error('El título no puede estar vacío');
        }

        // Validar evento si viene
        if (evento_id !== undefined) {
            if (evento_id) {
                const [evento] = await promisePool.execute(
                    'SELECT id FROM eventos WHERE id = ? AND usuario_id = ?',
                    [evento_id, usuarioId]
                );
                if (evento.length === 0) {
                    throw new Error('El evento especificado no existe o no pertenece al usuario');
                }
            }
        }

        // Validar color si viene
        if (color_fondo) {
            if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color_fondo)) {
                throw new Error('El color debe ser un código hexadecimal válido (ej: #FFFFFF)');
            }
        }

        // Cambiar estado a 'guardado'
        const sql = `
            UPDATE notas 
            SET titulo = COALESCE(?, titulo),
                contenido = ?,
                audio_url = ?,
                imagen_url = ?,
                estado = 'guardado',
                color_fondo = ?,
                evento_id = ?,
                fecha_modificacion = NOW()
            WHERE id = ? AND usuario_id = ?
        `;

        const [result] = await promisePool.execute(sql, [
            titulo !== undefined ? titulo.trim() : undefined,
            contenido !== undefined ? (contenido || null) : undefined,
            audio_url !== undefined ? (audio_url || null) : undefined,
            imagen_url !== undefined ? (imagen_url || null) : undefined,
            color_fondo !== undefined ? (color_fondo || null) : undefined,
            evento_id !== undefined ? (evento_id || null) : undefined,
            id,
            usuarioId
        ]);

        if (result.affectedRows === 0) {
            throw new Error('No se pudo guardar la nota');
        }

        return await this.obtenerPorId(id, usuarioId);
    }

    // Cambiar estado de una nota
    static async cambiarEstado(id, usuarioId, estado) {
        const estadosValidos = ['borrador', 'guardado', 'archivado'];
        if (!estadosValidos.includes(estado)) {
            throw new Error('Estado no válido. Debe ser: borrador, guardado o archivado');
        }

        const sql = `
            UPDATE notas 
            SET estado = ?, fecha_modificacion = NOW()
            WHERE id = ? AND usuario_id = ?
        `;
        const [result] = await promisePool.execute(sql, [estado, id, usuarioId]);

        if (result.affectedRows === 0) {
            throw new Error('Nota no encontrada o no pertenece al usuario');
        }

        return await this.obtenerPorId(id, usuarioId);
    }

    // Archivar una nota (cambiar a estado archivado)
    static async archivar(id, usuarioId) {
        return await this.cambiarEstado(id, usuarioId, 'archivado');
    }

    // Restaurar nota archivada (cambiar a estado guardado)
    static async restaurar(id, usuarioId) {
        return await this.cambiarEstado(id, usuarioId, 'guardado');
    }

    // Eliminar una nota
    static async eliminar(id, usuarioId) {
        const sql = 'DELETE FROM notas WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [id, usuarioId]);
        return result.affectedRows > 0;
    }

    // Obtener notas archivadas
    static async listarArchivadas(usuarioId) {
        return await this.listarPorUsuario(usuarioId, { estado: 'archivado' });
    }

    // Obtener notas por evento
    static async listarPorEvento(usuarioId, eventoId) {
        return await this.listarPorUsuario(usuarioId, { evento_id: eventoId });
    }

    // Buscar notas por texto
    static async buscar(usuarioId, texto) {
        if (!texto || texto.trim() === '') {
            return [];
        }
        return await this.listarPorUsuario(usuarioId, { busqueda: texto.trim() });
    }

    // Obtener notas recientes
    static async obtenerRecientes(usuarioId, limite = 10) {
        return await this.listarPorUsuario(usuarioId, {
            limite: limite,
            orden: 'fecha_modificacion',
            direccion: 'DESC'
        });
    }

    // Obtener resumen de notas
    static async obtenerResumen(usuarioId) {
        const sql = `
            SELECT 
                COUNT(*) as total_notas,
                SUM(CASE WHEN estado = 'borrador' THEN 1 ELSE 0 END) as borradores,
                SUM(CASE WHEN estado = 'guardado' THEN 1 ELSE 0 END) as guardados,
                SUM(CASE WHEN estado = 'archivado' THEN 1 ELSE 0 END) as archivados,
                SUM(CASE WHEN audio_url IS NOT NULL THEN 1 ELSE 0 END) as con_audio,
                SUM(CASE WHEN imagen_url IS NOT NULL THEN 1 ELSE 0 END) as con_imagen,
                SUM(CASE WHEN evento_id IS NOT NULL THEN 1 ELSE 0 END) as asociadas_evento,
                COUNT(DISTINCT evento_id) as eventos_distintos
            FROM notas
            WHERE usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        return rows[0];
    }

    // Contar notas por estado
    static async contarPorEstado(usuarioId) {
        const sql = `
            SELECT estado, COUNT(*) as cantidad
            FROM notas
            WHERE usuario_id = ?
            GROUP BY estado
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        return rows;
    }

    // Verificar si existe una nota
    static async existe(id, usuarioId) {
        const sql = 'SELECT id FROM notas WHERE id = ? AND usuario_id = ?';
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows.length > 0;
    }
}

export default NotaModel;