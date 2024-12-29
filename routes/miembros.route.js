import express from "express";
import { miembrosController } from "../controllers/miembros.controller.js";

const router = express.Router();

// Rutas para miembros
router.get("/", miembrosController.listar);
router.post("/", miembrosController.registrarMiembro);
router.post("/actualizar", miembrosController.actualizarMiembro);
router.post("/eliminar/:mie_ci", miembrosController.eliminarMiembro);

// Rutas para tipos de miembro
router.get("/tipos", miembrosController.listarTipos);
router.post("/tipos", miembrosController.registrarTipo);
router.post("/tipos/actualizar", miembrosController.actualizarTipo);
router.post("/tipos/eliminar/:tipmi_id", miembrosController.eliminarTipo);

export default router;
