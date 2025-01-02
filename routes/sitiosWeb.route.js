import express from "express";
import { sitiosWebController } from "../controllers/sitiosWeb.controller.js";

const router = express.Router();

// Rutas para la gestión de sitios web
router.get("/gestionar/:camp_id", sitiosWebController.listarSitiosWeb);
router.post("/gestionar/:camp_id", sitiosWebController.registrarSitioWeb);
router.post("/gestionar/:camp_id/actualizar", sitiosWebController.actualizarSitioWeb);
router.post("/gestionar/:camp_id/eliminar/:id", sitiosWebController.eliminarSitioWeb);

export default router;
