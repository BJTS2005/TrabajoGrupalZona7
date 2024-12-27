import express from "express";
import { shuttlesController } from "../controllers/shuttles.controller.js";

const router = express.Router();

router.get('/gestionar/:camp_id', shuttlesController.listarShuttles);
router.post('/gestionar/:camp_id', shuttlesController.registrarShuttle);
router.post('/gestionar/:camp_id/eliminar/:id', shuttlesController.eliminarShuttle);
router.post('/gestionar/:camp_id/actualizar', shuttlesController.actualizarShuttle);

export default router;