import express from "express";
import { magnitudesController } from "../controllers/magnitudesController.js";

const router = express.Router();

router.get('/', magnitudesController.getAll); 
router.get('/crear', magnitudesController.crear);
router.post("/", magnitudesController.guardar);
router.post('/eliminar/:id', magnitudesController.eliminar);
router.get('/editar/:id', magnitudesController.editar);
router.post('/actualizar', magnitudesController.actualizar)


export default router;
