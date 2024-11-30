import express from "express";
import { indicadoresController } from "../controllers/indicadoresController.js";

const router = express.Router();

router.get('/', indicadoresController.getAll); 
router.get('/crear', indicadoresController.crear);


export default router;