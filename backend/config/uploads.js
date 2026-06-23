import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Carpeta local donde se guardan los archivos subidos
export const CARPETA_UPLOADS = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(CARPETA_UPLOADS)) {
    fs.mkdirSync(CARPETA_UPLOADS, { recursive: true });
}

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => cb(null, CARPETA_UPLOADS),
    filename: (req, file, cb) => {
        // nombre único: timestamp-aleatorio.ext
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}-${base}${ext}`);
    }
});

// Tipos permitidos por categoría
const TIPOS = {
    documento: ['.pdf', '.txt', '.doc', '.docx', '.odt', '.rtf'],
    imagen: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
    audio: ['.mp3', '.wav', '.ogg', '.m4a', '.aac']
};

const filtro = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const tipo = req.params.tipo;
    const permitidos = TIPOS[tipo];
    if (!permitidos) return cb(new Error('Tipo de archivo no soportado'));
    if (!permitidos.includes(ext)) {
        return cb(new Error(`Extensión ${ext} no permitida para ${tipo}`));
    }
    cb(null, true);
};

export const subida = multer({
    storage: almacenamiento,
    fileFilter: filtro,
    limits: { fileSize: 20 * 1024 * 1024 } // 20 MB
});
