import express from 'express';
import { reportesController } from '../controllers/reportes.controller.js';
import { reporteCategoriaController } from '../controllers/reportesCategorias.controller.js';


const router = express.Router();

router.get('/campus', reportesController.listar);
router.get('/campus/:camp_id', reportesController.reporteCampus);
router.get('/total', reportesController.reporteTotal);
router.get('/indicadores', reporteCategoriaController.listarCategorias);
router.get('/indicadores/:cat_cod', reporteCategoriaController.reporteCategoria);
//router.get('/para-campus/campus/:camp_id', reportesCampusController.reporteCampus);

export default router;