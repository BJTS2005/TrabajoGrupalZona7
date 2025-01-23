import { Router } from 'express';
import { imagenesController, upload } from '../controllers/imagenes.controller.js';

const router = Router();

// La ruta será /campus/imagenes
router.post('/:id', upload.single('imagen'), imagenesController.guardarImagen);
router.delete('/:id', imagenesController.eliminarImagen);

export default router;