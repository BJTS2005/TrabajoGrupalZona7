import express from "express";
import { indicadoresController } from "../controllers/indicadores.controller.js";
import { rangosController } from "../controllers/rangos.controller.js";

const router = express.Router();

router.get('/gestionar/:cat_cod', indicadoresController.listar);
router.post('/registrar', indicadoresController.registrar);
router.post('/editar', indicadoresController.editar);
router.post('/eliminar/:cat_cod/:ind_cod', indicadoresController.eliminar);
router.get('/formulario/:cat_cod', indicadoresController.obtenerDatosFormulario);

router.get("/:cat_cod/rangos/listar/:ind_cod", rangosController.listar);
router.post("/rangos/registrar", rangosController.registrar);
router.post("/rangos/editar", rangosController.actualizar);
router.post("/:cat_cod/rangos/eliminar/:ind_cod/:id", rangosController.eliminar);
router.post("/rangos/seleccionar/:id", rangosController.seleccionar);

export default router;