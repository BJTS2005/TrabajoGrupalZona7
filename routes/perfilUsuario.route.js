import express from "express";
import { perfilUsuarioController } from "../controllers/perfilUsuario.controller.js";

const router = express.Router();

router.get("/informacion", perfilUsuarioController.render);

export default router;