import multer from "multer";
import path from "path";
import fs from "fs";

const ALLOWED_EXTENSIONS = ['.png'];

// Modificar la configuración de storage para usar el ID de la URL
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const tempDir = 'uploads/temp';
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        // Aquí puedes acceder a req.params.id
        const id = req.params.id;
        const ext = path.extname(file.originalname).toLowerCase();
        // Usar el ID como parte del nombre del archivo
        const filename = `${id}${ext}`;
        cb(null, filename);
    }
});

export const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ALLOWED_EXTENSIONS.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Formato de archivo no permitido'));
        }
    }
});

export const imagenesController = {
    guardarImagen: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No se envió ninguna imagen' });
            }

            const file = req.file;
            const ext = path.extname(file.originalname).toLowerCase();
            const campusId = req.params.id; // Obtener el ID de la URL

            // Validar extensión
            if (!ALLOWED_EXTENSIONS.includes(ext)) {
                fs.unlinkSync(file.path);
                return res.status(400).json({ 
                    error: 'Formato de archivo no permitido' 
                });
            }

            // El nombre del archivo ya incluye el ID del campus desde multer
            const newFileName = file.filename;
            
            const uploadDir = 'uploads';
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const newPath = path.join(uploadDir, newFileName);

            // Mover el archivo
            fs.renameSync(file.path, newPath);

            res.redirect('/campus');
        } catch (error) {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            console.error('Error al guardar imagen:', error);
            res.status(500).json({ error: 'Ocurrió un error al subir la imagen' });
        }
    },
    eliminarImagen: async (req, res) => {
        const campusId = req.params.id;
        
        try {
            const imagePath = path.join('uploads', `${campusId}.png`);
     
            // Verificar si la imagen existe
            if (fs.existsSync(imagePath)) {
                // Eliminar la imagen
                fs.unlinkSync(imagePath);
                
                return res.status(200).json({
                    message: 'Imagen eliminada exitosamente',
                    campusId: campusId
                });
            } 
     
            return res.status(404).json({
                error: 'No se encontró la imagen',
                campusId: campusId
            });
            
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            return res.status(500).json({
                error: 'Error al eliminar la imagen',
                details: error.message
            });
        }
     },
};