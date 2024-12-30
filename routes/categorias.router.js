import express from "express";
import { categoriasController } from "../controllers/categorias.controller.js";

const router = express.Router();

router.get("/", categoriasController.listar);
router.get("/crear", categoriasController.mostrarFormularioCrear);
router.post("/", categoriasController.guardar);
router.get("/editar/:id", categoriasController.mostrarFormularioEditar);
router.post("/actualizar", categoriasController.actualizar);
router.post("/eliminar/:id", categoriasController.eliminar);

export default router;
