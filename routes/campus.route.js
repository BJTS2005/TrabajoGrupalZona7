import express from "express";
import { campusController } from "../controllers/campus.controller.js";

const router = express.Router();

router.get('/', campusController.listar);
router.get('/registrar', campusController.registrar);

export default router;