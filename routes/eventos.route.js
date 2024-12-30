import express from "express";
import { eventosController } from "../controllers/eventos.controller.js";

const router = express.Router();

router.get('/tipos', eventosController.listarTiposEvento);
router.post('/tipos', eventosController.registrarTipoEvento);
router.post('/tipos/actualizar', eventosController.actualizarTipoEvento);
router.post('/tipos/eliminar/:id', eventosController.eliminarTipoEvento);

router.get('/gestionar/:camp_id', eventosController.listarEventos);
router.post('/gestionar/:camp_id', eventosController.registrarEvento);
router.post('/gestionar/:camp_id/actualizar', eventosController.actualizarEvento);
router.post('/gestionar/:camp_id/eliminar/:id', eventosController.eliminarEvento);


export default router;