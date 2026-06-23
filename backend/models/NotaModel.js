import promisePool from '../config/database.js';

class NotaModel {
    // Validar que el evento pertenezca al usuario (si se especifica)
    static async validarEvento(usuarioId, eventoId) {
        const [rows] = await promisePool.execute(
            'SELECT id FROM eventos WHERE id = ? AND usuario_id = ?',
            [eventoId, usuarioId]
        );
        if (rows.length === 0) {
            throw new Error('El evento especificado no existe o no pertenece al usuario');
        }
    }

    // Validar que la tarea pertenezca al usuario (si se especifica)
    static async validarTarea(usuarioId, tareaId) {
        const [rows] = await promisePool.execute(
            'SELECT id FROM tareas WHERE id = ? AND usuario_id = ?',
            [tareaId, usuarioId]
        );
        if (rows.length === 0) {
            throw new Error('La tarea especificada no existe o no pertenece al usuario');
        }
    }

    // Crear una nueva nota
    static async crear(usuarioId, datos) {
        const { titulo, contenido, audio_url, imagen_url, color_hex, evento_id, tarea_id } = datos;

        if (!titulo || titulo.trim() === '') {
            throw new Error('El título es obligatorio');
        }

        if (evento_id) await this.validarEvento(usuarioId, evento_id);
        if (tarea_id) await this.validarTarea(usuarioId, tarea_id);

        const sql = `
            INSERT INTO notas (usuario_id, evento_id, tarea_id, titulo, contenido, audio_url, imagen_url, color_hex)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuarioId,
            evento_id || null,
            tarea_id || null,
            titulo.trim(),
            contenido || null,
            audio_url || null,
            imagen_url || null,
            color_hex || null
        ]);

        return await this.obtenerPorId(result.insertId, usuarioId);
    }

    // Obtener todas las notas de un usuario
    static async listarPorUsuario(usuarioId, filtros = {}) {
        let sql = `
            SELECT n.*,
                   e.titulo as evento_titulo,
                   t.titulo as tarea_titulo
            FROM notas n
            LEFT JOIN eventos e ON n.evento_id = e.id
            LEFT JOIN tareas t ON n.tarea_id = t.id
            WHERE n.usuario_id = ?
        `;
        const params = [usuarioId];

        if (filtros.evento_id) {
            sql += ` AND n.evento_id = ?`;
            params.push(filtros.evento_id);
        }

        if (filtros.tarea_id) {
            sql += ` AND n.tarea_id = ?`;
            params.push(filtros.tarea_id);
        }

        if (filtros.busqueda) {
            sql += ` AND (n.titulo LIKE ? OR n.contenido LIKE ?)`;
            const busqueda = `%${filtros.busqueda}%`;
            params.push(busqueda, busqueda);
        }

        if (filtros.fecha_desde) {
            sql += ` AND DATE(n.fecha_creacion) >= ?`;
            params.push(filtros.fecha_desde);
        }
        if (filtros.fecha_hasta) {
            sql += ` AND DATE(n.fecha_creacion) <= ?`;
            params.push(filtros.fecha_hasta);
        }

        if (filtros.tiene_audio !== undefined) {
            sql += filtros.tiene_audio ? ` AND n.audio_url IS NOT NULL` : ` AND n.audio_url IS NULL`;
        }

        const orden = filtros.orden || 'fecha_modificacion';
        const direccion = filtros.direccion === 'ASC' ? 'ASC' : 'DESC';
        const ordenesPermitidos = ['fecha_creacion', 'fecha_modificacion', 'titulo'];
        const ordenFinal = ordenesPermitidos.includes(orden) ? orden : 'fecha_modificacion';
        sql += ` ORDER BY n.${ordenFinal} ${direccion}`;

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
                   t.titulo as tarea_titulo
            FROM notas n
            LEFT JOIN eventos e ON n.evento_id = e.id
            LEFT JOIN tareas t ON n.tarea_id = t.id
            WHERE n.id = ? AND n.usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Actualizar una nota
    static async actualizar(id, usuarioId, datos) {
        const notaExistente = await this.obtenerPorId(id, usuarioId);
        if (!notaExistente) {
            throw new Error('Nota no encontrada');
        }

        const { titulo, contenido, audio_url, imagen_url, color_hex, evento_id, tarea_id } = datos;

        if (titulo !== undefined && titulo.trim() === '') {
            throw new Error('El título no puede estar vacío');
        }

        if (evento_id) await this.validarEvento(usuarioId, evento_id);
        if (tarea_id) await this.validarTarea(usuarioId, tarea_id);

        const sql = `
            UPDATE notas
            SET titulo = ?,
                contenido = ?,
                audio_url = ?,
                imagen_url = ?,
                color_hex = ?,
                evento_id = ?,
                tarea_id = ?,
                fecha_modificacion = NOW()
            WHERE id = ? AND usuario_id = ?
        `;

        const [result] = await promisePool.execute(sql, [
            titulo !== undefined ? titulo.trim() : notaExistente.titulo,
            contenido !== undefined ? (contenido || null) : notaExistente.contenido,
            audio_url !== undefined ? (audio_url || null) : notaExistente.audio_url,
            imagen_url !== undefined ? (imagen_url || null) : notaExistente.imagen_url,
            color_hex !== undefined ? (color_hex || null) : notaExistente.color_hex,
            evento_id !== undefined ? (evento_id || null) : notaExistente.evento_id,
            tarea_id !== undefined ? (tarea_id || null) : notaExistente.tarea_id,
            id,
            usuarioId
        ]);

        if (result.affectedRows === 0) {
            throw new Error('No se pudo actualizar la nota');
        }

        return await this.obtenerPorId(id, usuarioId);
    }

    // Autoguardar: crea la nota si no existe (id) o la actualiza
    static async autoguardar(usuarioId, datos) {
        const { id } = datos;
        const tituloFinal = (datos.titulo && datos.titulo.trim() !== '') ? datos.titulo.trim() : 'Nota sin título';

        if (id) {
            return await this.actualizar(id, usuarioId, { ...datos, titulo: tituloFinal });
        }
        return await this.crear(usuarioId, { ...datos, titulo: tituloFinal });
    }

    // Eliminar una nota
    static async eliminar(id, usuarioId) {
        const sql = 'DELETE FROM notas WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [id, usuarioId]);
        return result.affectedRows > 0;
    }

    static async listarPorEvento(usuarioId, eventoId) {
        return await this.listarPorUsuario(usuarioId, { evento_id: eventoId });
    }

    static async listarPorTarea(usuarioId, tareaId) {
        return await this.listarPorUsuario(usuarioId, { tarea_id: tareaId });
    }

    static async buscar(usuarioId, texto) {
        if (!texto || texto.trim() === '') {
            return [];
        }
        return await this.listarPorUsuario(usuarioId, { busqueda: texto.trim() });
    }

    static async obtenerRecientes(usuarioId, limite = 10) {
        return await this.listarPorUsuario(usuarioId, {
            limite,
            orden: 'fecha_modificacion',
            direccion: 'DESC'
        });
    }

    // Obtener resumen de notas
    static async obtenerResumen(usuarioId) {
        const sql = `
            SELECT
                COUNT(*) as total_notas,
                SUM(CASE WHEN audio_url IS NOT NULL THEN 1 ELSE 0 END) as con_audio,
                SUM(CASE WHEN imagen_url IS NOT NULL THEN 1 ELSE 0 END) as con_imagen,
                SUM(CASE WHEN evento_id IS NOT NULL THEN 1 ELSE 0 END) as asociadas_evento,
                SUM(CASE WHEN tarea_id IS NOT NULL THEN 1 ELSE 0 END) as asociadas_tarea
            FROM notas
            WHERE usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        return rows[0];
    }

    // Verificar si existe una nota
    static async existe(id, usuarioId) {
        const sql = 'SELECT id FROM notas WHERE id = ? AND usuario_id = ?';
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows.length > 0;
    }
}

export default NotaModel;
