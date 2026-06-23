import EtiquetaModel from '../models/EtiquetaModel.js';
import EntidadEtiquetaModel, { TIPOS_ENTIDAD } from '../models/EntidadEtiquetaModel.js';

// Listar todas las etiquetas del usuario autenticado
export const listarEtiquetas = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const etiquetas = await EtiquetaModel.listarPorUsuario(usuarioId);

        res.json({
            success: true,
            data: etiquetas
        });
    } catch (error) {
        console.error('Error al listar etiquetas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las etiquetas',
            error: error.message
        });
    }
};

// Obtener una etiqueta específica
export const obtenerEtiqueta = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const etiqueta = await EtiquetaModel.obtenerPorId(id, usuarioId);

        if (!etiqueta) {
            return res.status(404).json({
                success: false,
                message: 'Etiqueta no encontrada'
            });
        }

        res.json({
            success: true,
            data: etiqueta
        });
    } catch (error) {
        console.error('Error al obtener etiqueta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la etiqueta',
            error: error.message
        });
    }
};

// Crear nueva etiqueta
export const crearEtiqueta = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { nombre, color_hex } = req.body;

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la etiqueta es obligatorio'
            });
        }

        if (nombre.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'El nombre no puede exceder los 50 caracteres'
            });
        }

        const existe = await EtiquetaModel.existeNombre(usuarioId, nombre.trim());
        if (existe) {
            return res.status(400).json({
                success: false,
                message: `Ya existe una etiqueta "${nombre.trim()}"`
            });
        }

        const nuevaEtiqueta = await EtiquetaModel.crear(usuarioId, {
            nombre: nombre.trim(),
            color_hex
        });

        res.status(201).json({
            success: true,
            message: 'Etiqueta creada exitosamente',
            data: nuevaEtiqueta
        });
    } catch (error) {
        console.error('Error al crear etiqueta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la etiqueta',
            error: error.message
        });
    }
};

// Eliminar una etiqueta
export const eliminarEtiqueta = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const eliminado = await EtiquetaModel.eliminar(id, usuarioId);
        if (!eliminado) {
            return res.status(404).json({
                success: false,
                message: 'Etiqueta no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Etiqueta eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar etiqueta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la etiqueta',
            error: error.message
        });
    }
};

// Crear etiquetas predeterminadas para un usuario nuevo
export const crearEtiquetasPredeterminadas = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const existentes = await EtiquetaModel.listarPorUsuario(usuarioId);
        if (existentes.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya tiene etiquetas creadas'
            });
        }

        const nuevas = await EtiquetaModel.crearPredeterminadas(usuarioId);

        res.status(201).json({
            success: true,
            message: 'Etiquetas predeterminadas creadas exitosamente',
            data: nuevas
        });
    } catch (error) {
        console.error('Error al crear etiquetas predeterminadas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear las etiquetas predeterminadas',
            error: error.message
        });
    }
};

// Vincular una etiqueta a una entidad (evento/tarea/ingreso/gasto)
export const vincularEtiqueta = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { etiqueta_id, entidad_tipo, entidad_id } = req.body;

        if (!etiqueta_id || !entidad_tipo || !entidad_id) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren etiqueta_id, entidad_tipo y entidad_id'
            });
        }

        if (!TIPOS_ENTIDAD.includes(entidad_tipo)) {
            return res.status(400).json({
                success: false,
                message: `Tipo de entidad no válido. Use: ${TIPOS_ENTIDAD.join(', ')}`
            });
        }

        // La etiqueta debe pertenecer al usuario
        const etiqueta = await EtiquetaModel.obtenerPorId(etiqueta_id, usuarioId);
        if (!etiqueta) {
            return res.status(404).json({
                success: false,
                message: 'Etiqueta no encontrada'
            });
        }

        await EntidadEtiquetaModel.vincular(etiqueta_id, entidad_tipo, entidad_id);

        res.status(201).json({
            success: true,
            message: 'Etiqueta vinculada exitosamente'
        });
    } catch (error) {
        console.error('Error al vincular etiqueta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al vincular la etiqueta',
            error: error.message
        });
    }
};

// Quitar el vínculo entre una etiqueta y una entidad
export const desvincularEtiqueta = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { etiqueta_id, entidad_tipo, entidad_id } = req.body;

        if (!etiqueta_id || !entidad_tipo || !entidad_id) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren etiqueta_id, entidad_tipo y entidad_id'
            });
        }

        const etiqueta = await EtiquetaModel.obtenerPorId(etiqueta_id, usuarioId);
        if (!etiqueta) {
            return res.status(404).json({
                success: false,
                message: 'Etiqueta no encontrada'
            });
        }

        await EntidadEtiquetaModel.desvincular(etiqueta_id, entidad_tipo, entidad_id);

        res.json({
            success: true,
            message: 'Etiqueta desvinculada exitosamente'
        });
    } catch (error) {
        console.error('Error al desvincular etiqueta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al desvincular la etiqueta',
            error: error.message
        });
    }
};

// Listar las etiquetas asociadas a una entidad concreta
export const listarEtiquetasDeEntidad = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { entidad_tipo, entidad_id } = req.params;

        if (!TIPOS_ENTIDAD.includes(entidad_tipo)) {
            return res.status(400).json({
                success: false,
                message: `Tipo de entidad no válido. Use: ${TIPOS_ENTIDAD.join(', ')}`
            });
        }

        const etiquetas = await EntidadEtiquetaModel.listarEtiquetasDeEntidad(
            usuarioId,
            entidad_tipo,
            parseInt(entidad_id)
        );

        res.json({
            success: true,
            data: etiquetas,
            total: etiquetas.length
        });
    } catch (error) {
        console.error('Error al listar etiquetas de entidad:', error);
        res.status(500).json({
            success: false,
            message: 'Error al listar las etiquetas de la entidad',
            error: error.message
        });
    }
};

// Listar las entidades vinculadas a una etiqueta (búsqueda global)
export const listarEntidadesPorEtiqueta = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const etiqueta = await EtiquetaModel.obtenerPorId(id, usuarioId);
        if (!etiqueta) {
            return res.status(404).json({
                success: false,
                message: 'Etiqueta no encontrada'
            });
        }

        const entidades = await EntidadEtiquetaModel.listarEntidadesPorEtiqueta(usuarioId, id);

        res.json({
            success: true,
            data: entidades,
            total: entidades.length
        });
    } catch (error) {
        console.error('Error al listar entidades por etiqueta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al listar las entidades de la etiqueta',
            error: error.message
        });
    }
};
