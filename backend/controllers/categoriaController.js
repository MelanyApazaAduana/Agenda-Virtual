import CategoriaModel from '../models/CategoriaModel.js';

// Obtener todas las categorías del usuario autenticado
export const listarCategorias = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const categorias = await CategoriaModel.listarPorUsuario(usuarioId);
        
        res.json({
            success: true,
            data: categorias
        });
    } catch (error) {
        console.error('Error al listar categorías:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las categorías',
            error: error.message
        });
    }
};

// Obtener categorías por tipo
export const listarCategoriasPorTipo = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { tipo } = req.params;
        
        const tiposPermitidos = ['evento', 'tarea', 'gasto', 'ingreso', 'todos'];
        if (!tiposPermitidos.includes(tipo)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo no válido. Use: evento, tarea, gasto, ingreso o todos.'
            });
        }
        
        const categorias = await CategoriaModel.listarPorTipo(usuarioId, tipo);
        
        res.json({
            success: true,
            data: categorias
        });
    } catch (error) {
        console.error('Error al listar categorías por tipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las categorías',
            error: error.message
        });
    }
};

// Obtener una categoría específica
export const obtenerCategoria = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        
        const categoria = await CategoriaModel.obtenerPorId(id, usuarioId);
        
        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }
        
        res.json({
            success: true,
            data: categoria
        });
    } catch (error) {
        console.error('Error al obtener categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la categoría',
            error: error.message
        });
    }
};

// Crear nueva categoría
export const crearCategoria = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { nombre, color_hex, icono, tipo_aplicable } = req.body;
        
        // Validaciones
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la categoría es obligatorio'
            });
        }
        
        if (nombre.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'El nombre no puede exceder los 50 caracteres'
            });
        }
        
        // Validar tipo_aplicable
        const tiposPermitidos = ['evento', 'tarea', 'gasto', 'ingreso', 'todos'];
        if (!tipo_aplicable || !tiposPermitidos.includes(tipo_aplicable)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo de aplicación no válido. Use: evento, tarea, gasto, ingreso o todos'
            });
        }

        // Verificar si ya existe una categoría con el mismo nombre
        const existe = await CategoriaModel.existeNombre(usuarioId, nombre, tipo_aplicable);
        if (existe) {
            return res.status(400).json({
                success: false,
                message: `Ya existe una categoría "${nombre}" para el tipo ${tipo_aplicable}`
            });
        }
        
        const nuevaCategoria = await CategoriaModel.crear(usuarioId, {
            nombre: nombre.trim(),
            color_hex,
            icono,
            tipo_aplicable
        });
        
        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: nuevaCategoria
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la categoría',
            error: error.message
        });
    }
};

// Actualizar categoría (versión modificada)
// export const actualizarCategoria = async (req, res) => {
//     try {
//         const usuarioId = req.user.id;
//         const { id } = req.params;
//         const { nombre, color_hex, icono, tipo_aplicable } = req.body;
        
//         // Verificar que la categoría existe
//         const categoriaExistente = await CategoriaModel.obtenerPorId(id, usuarioId);
//         if (!categoriaExistente) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Categoría no encontrada'
//             });
//         }
        
//         // Validar nombre
//         if (nombre && nombre.trim() === '') {
//             return res.status(400).json({
//                 success: false,
//                 message: 'El nombre no puede estar vacío'
//             });
//         }
        
//         // Determinar valores finales
//         const nombreFinal = nombre || categoriaExistente.nombre;
//         const tipoFinal = tipo_aplicable || categoriaExistente.tipo_aplicable;
        
//         // Verificar nombre duplicado (excluyendo la categoría actual)
//         if (nombre && (nombre !== categoriaExistente.nombre || tipo_aplicable !== categoriaExistente.tipo_aplicable)) {
//             const nombreExiste = await CategoriaModel.existeNombre(
//                 usuarioId, 
//                 nombreFinal, 
//                 tipoFinal, 
//                 id
//             );
//             if (nombreExiste) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `Ya existe otra categoría "${nombreFinal}" para el tipo ${tipoFinal}`
//                 });
//             }
//         }
        
//         const actualizado = await CategoriaModel.actualizar(id, usuarioId, {
//             nombre: nombreFinal,
//             color_hex: color_hex || categoriaExistente.color_hex,
//             icono: icono !== undefined ? icono : categoriaExistente.icono,
//             tipo_aplicable: tipoFinal
//         });
        
//         if (actualizado) {
//             const categoriaActualizada = await CategoriaModel.obtenerPorId(id, usuarioId);
//             res.json({
//                 success: true,
//                 message: 'Categoría actualizada exitosamente',
//                 data: categoriaActualizada
//             });
//         } else {
//             res.status(400).json({
//                 success: false,
//                 message: 'No se pudo actualizar la categoría'
//             });
//         }
//     } catch (error) {
//         console.error('Error al actualizar categoría:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error al actualizar la categoría',
//             error: error.message
//         });
//     }
// };

// Eliminar categoría
// export const eliminarCategoria = async (req, res) => {
//     try {
//         const usuarioId = req.user.id;
//         const { id } = req.params;
        
//         // Verificar que la categoría existe
//         const categoria = await CategoriaModel.obtenerPorId(id, usuarioId);
//         if (!categoria) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Categoría no encontrada'
//             });
//         }
        
//         const eliminado = await CategoriaModel.eliminar(id, usuarioId);
        
//         if (eliminado) {
//             res.json({
//                 success: true,
//                 message: 'Categoría eliminada exitosamente'
//             });
//         } else {
//             res.status(400).json({
//                 success: false,
//                 message: 'No se pudo eliminar la categoría'
//             });
//         }
//     } catch (error) {
//         console.error('Error al eliminar categoría:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error al eliminar la categoría',
//             error: error.message
//         });
//     }
// };

// Crear categorías predeterminadas para un usuario (útil para nuevos registros)
export const crearCategoriasPredeterminadas = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        
        // Verificar si el usuario ya tiene categorías
        const categoriasExistentes = await CategoriaModel.listarPorUsuario(usuarioId);
        
        if (categoriasExistentes.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya tiene categorías creadas'
            });
        }
        
        const nuevasCategorias = await CategoriaModel.crearPredeterminadas(usuarioId);
        
        res.status(201).json({
            success: true,
            message: 'Categorías predeterminadas creadas exitosamente',
            data: nuevasCategorias
        });
    } catch (error) {
        console.error('Error al crear categorías predeterminadas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear las categorías predeterminadas',
            error: error.message
        });
    }
};