import express from "express";
import { vehiculosController } from "../controllers/vehiculos.controller.js";

const router = express.Router();

router.get('/tipos-emision', vehiculosController.listarTiposEmision);
router.post('/tipos-emision', vehiculosController.registrarTpEmision);
router.post('/tipos-emision/eliminar/:id', vehiculosController.eliminarTpEmision)
router.post('/tipos-emision/actualizar', vehiculosController.actualizarTpEmision);


export default router;