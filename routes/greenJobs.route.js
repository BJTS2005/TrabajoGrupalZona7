import express from "express";
import { greenJobsController } from "../controllers/greenJobs.controller.js";

const router = express.Router();

router.get("/listar", greenJobsController.listarGreenJobs);
router.post("/registrar", greenJobsController.registrarGreenJob);
router.post("/actualizar", greenJobsController.actualizarGreenJob);
router.post("/eliminar/:job_id", greenJobsController.eliminarGreenJob);

router.get("/gestionar/:camp_id", greenJobsController.listarGreenJobsPorCampus);
router.post("/gestionar/:camp_id", greenJobsController.registrarGraduadosGreenJob);
router.post("/gestionar/:camp_id/actualizar", greenJobsController.actualizarGraduadosGreenJob);
router.post("/gestionar/:camp_id/eliminar/:gra_id", greenJobsController.eliminarGraduadosGreenJob);

export default router;