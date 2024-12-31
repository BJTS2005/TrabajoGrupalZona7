import express from 'express';
import { reportesController } from '../controllers/reportes.controller.js';

const router = express.Router();

router.get('/campus', reportesController.listar);
router.get('/campus/:camp_id', reportesController.reporteCampus);
//router.get('/para-campus/campus/:camp_id', reportesCampusController.reporteCampus);

export default router;