import express from "express";
import { campusController } from "../controllers/campus.controller.js";

const router = express.Router();

router.get('/', campusController.listar);
router.get('/registrar', campusController.registrar);
router.post('/', campusController.guardar);
router.post('/eliminar/:id', campusController.eliminar);
router.get('/editar/:id', campusController.editar);
router.post('/actualizar', campusController.actualizar);
router.get('/:camp_id', campusController.detalles);

export default router;