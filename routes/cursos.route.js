import express from "express";
import { cursosController } from "../controllers/cursos.controller.js";

const router = express.Router();

router.get("/gestionar/:camp_id", cursosController.listarCursosPorCampus);
router.post("/gestionar/:camp_id", cursosController.registrarCurso);
router.post("/gestionar/:camp_id/actualizar", cursosController.actualizarCurso);
router.post("/gestionar/:camp_id/eliminar/:cur_id", cursosController.eliminarCurso);

export default router;
