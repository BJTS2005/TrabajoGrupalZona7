import express from "express";
import { unidadesController } from "../controllers/unidadesController.js"; 

const router = express.Router();

router.get('/', unidadesController.getAll); 
router.get('/crear', unidadesController.crear);
router.post("/", unidadesController.guardar);
router.post('/eliminar/:id', unidadesController.eliminar);
router.get('/editar/:id', unidadesController.editar);
router.post('/actualizar', unidadesController.actualizar)


export default router;