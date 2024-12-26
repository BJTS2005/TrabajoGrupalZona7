import express from "express";
import { vehiculosController } from "../controllers/vehiculos.controller.js";

const router = express.Router();

router.get('/tipos-emision', vehiculosController.listarTiposEmision);
router.post('/tipos-emision', vehiculosController.registrarTpEmision);
router.post('/tipos-emision/eliminar/:id', vehiculosController.eliminarTpEmision);
router.post('/tipos-emision/actualizar', vehiculosController.actualizarTpEmision);

router.get('/frecuencias', vehiculosController.listarFrecuencias);
router.post('/frecuencias', vehiculosController.registrarFrecuencia);
router.post('/frecuencias/eliminar/:id', vehiculosController.eliminarFrecuencia);
router.post('/frecuencias/actualizar', vehiculosController.actualizarFrecuencia);

router.get('/tipos-vehiculo', vehiculosController.listarTpVehiculo);
router.post('/tipos-vehiculo', vehiculosController.registrarTpVehiculo);
router.post('/tipos-vehiculo/eliminar/:id', vehiculosController.eliminarTpVehiculo);
router.post('/tipos-vehiculo/actualizar', vehiculosController.actualizarTpVehiculo);

router.get('/gestionar', vehiculosController.listarVehiculos);
router.post('/gestionar', vehiculosController.registrarVehiculo);
router.post('/gestionar/eliminar/:id', vehiculosController.eliminarVehiculo);
router.post('/gestionar/actualizar', vehiculosController.actualizarVehiculo);


export default router;