import express from "express";
import { login, logout, renderLogin } from "../controllers/auth.controller.js";
import { estaAutenticado } from "../middlewares/validarToken.middleware.js";
const router = express.Router();

router.get('/login', estaAutenticado, renderLogin);
router.post('/login', login); 
router.post("/logout", logout);

export default router;